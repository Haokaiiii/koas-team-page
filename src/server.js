// Node.js server for handling file uploads and admin panel
// Run with: node src/server.js

const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');
const cors = require('cors');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const compression = require('compression');
const { MEMBER_FILE_MAP, PHOTOS_DIR } = require('./config/constants');
const { initDatabase, TeamMember, AdminUser } = require('./database');
const { requireAuth, requireAuthHTML } = require('./middleware/auth');
const sharp = require('sharp');

const app = express();
const PORT = process.env.PORT || 3000;
const HTTPS_PORT = process.env.HTTPS_PORT || 1025;

// Initialize database
initDatabase().catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
});

// Trust proxy (for secure cookies when behind reverse proxy)
app.set('trust proxy', 1);

// Compression middleware - compress all responses
app.use(compression());

// Security headers - relaxed for HTTP IP access and CDN resources
const disableNosniff = (process.env.DISABLE_NOSNIFF || '').toLowerCase() === 'true';
const isHttps = process.env.NODE_ENV === 'production' && process.env.SESSION_COOKIE_SECURE !== 'false';

// Configure Helmet with CSP that allows GSAP CDN and inline scripts
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "'unsafe-inline'", // Allow inline scripts
                "'unsafe-hashes'", // Allow inline event handlers (onclick, etc.)
                "https://cdnjs.cloudflare.com", // GSAP CDN
                "https://cdn.jsdelivr.net" // Alternative CDN if needed
            ],
            scriptSrcAttr: [
                "'unsafe-inline'", // Required for inline event handlers (onclick="...")
                "'unsafe-hashes'" // Required for inline event handlers
            ],
            styleSrc: [
                "'self'",
                "'unsafe-inline'", // Allow inline styles
                "https://fonts.googleapis.com" // Google Fonts
            ],
            fontSrc: [
                "'self'",
                "https://fonts.gstatic.com" // Google Fonts
            ],
            imgSrc: [
                "'self'",
                "data:", // Allow data URIs for images
                "https:" // Allow HTTPS images (for CDN if needed)
            ],
            connectSrc: ["'self'"]
        }
    },
    crossOriginOpenerPolicy: false, // Completely disable COOP for HTTP IP (prevents warnings)
    crossOriginEmbedderPolicy: false, // Disable for HTTP
    hsts: false, // Disable HSTS to prevent HTTPS upgrades
    contentTypeOptions: disableNosniff ? false : true
}));

// Prevent HTTPS upgrade and ensure HTTP-only for IP access
app.use((req, res, next) => {
    // Force HTTP protocol in response headers for IP-based access
    if (!isHttps) {
        // Remove any HTTPS upgrade hints
        res.removeHeader('Strict-Transport-Security');
        // Set protocol to HTTP explicitly
        res.setHeader('X-Forwarded-Proto', 'http');
    }
    next();
});

// Session configuration - MUST be before static files
// Use file-based session store instead of MemoryStore
const sessionsDir = path.join(__dirname, '..', 'data', 'sessions');
if (!fs.existsSync(sessionsDir)) {
    fs.mkdirSync(sessionsDir, { recursive: true });
}

// Allow overriding cookie secure flag for non-HTTPS deployments (e.g., IP + port forwarding)
const cookieSecure =
    (process.env.SESSION_COOKIE_SECURE ?? '').toLowerCase() === 'true'
        ? true
        : (process.env.SESSION_COOKIE_SECURE ?? '').toLowerCase() === 'false'
            ? false
            : process.env.NODE_ENV === 'production';

app.use(session({
    store: new FileStore({
        path: sessionsDir,
        ttl: 24 * 60 * 60, // 24 hours in seconds
        retries: 0
    }),
    secret: process.env.SESSION_SECRET || 'koas-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    name: 'koas.sid',
    cookie: {
        secure: cookieSecure,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax'
    }
}));

// Enable CORS
const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(s => s.trim())
    : true;
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic health endpoint for Docker/infra
app.get('/healthz', (req, res) => {
    res.status(200).send('ok');
});

// Rate limiting
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
});
app.use('/api/auth/', authLimiter);

// Explicit MIME type mapping for static files (fixes router/proxy issues)
const mime = require('mime-types');

// Note: We do NOT inject upgrade-insecure-requests meta tag for HTTP IP access
// That would force HTTPS upgrades which we want to avoid

// Serve static files from public directory with explicit MIME types
const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath, {
    maxAge: '1y',
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
        // Explicitly set correct MIME types to prevent router/proxy from breaking them
        const ext = path.extname(filePath).toLowerCase();
        const mimeType = mime.lookup(filePath) || mime.lookup(ext);
        if (mimeType) {
            res.setHeader('Content-Type', mimeType);
        }
        
        // Cache control
        if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache');
        } else if (filePath.endsWith('.css') || filePath.endsWith('.js')) {
            res.setHeader('Cache-Control', 'public, max-age=31536000');
        }
    }
}));

// Also serve Pics directory from root (for backward compatibility)
const picsPath = path.join(__dirname, '..', 'Pics');
app.use('/Pics', express.static(picsPath, {
    maxAge: '1y',
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
        // Explicitly set correct MIME types for images
        const mimeType = mime.lookup(filePath);
        if (mimeType) {
            res.setHeader('Content-Type', mimeType);
        }
    }
}));

// Admin panel routes (protected) - check auth before serving
app.use('/admin', (req, res, next) => {
    // Allow login page and static assets (JS, CSS, etc.)
    const path = req.path.toLowerCase();
    if (path === '/login.html' || 
        path === '/' || 
        path.endsWith('.js') || 
        path.endsWith('.css') || 
        path.endsWith('.png') || 
        path.endsWith('.jpg') || 
        path.endsWith('.svg') ||
        path.endsWith('.ico') ||
        path.endsWith('.woff') ||
        path.endsWith('.woff2') ||
        path.endsWith('.ttf')) {
        return next();
    }
    // Check auth for other admin pages
    if (req.session && req.session.user && req.session.user.username) {
        return next();
    }
    res.redirect('/admin/login.html');
});

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '..', PHOTOS_DIR);
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Get the filename from the request
        const member = req.body.member;
        const customFilename = req.body.filename;
        
        const baseName = customFilename || MEMBER_FILE_MAP[member] || member;
        const ext = path.extname(file.originalname);
        const fileName = `${baseName}${ext}`;
        
        cb(null, fileName);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: function (req, file, cb) {
        // Accept image files and HEIC/HEIF files
        const isImage = file.mimetype.startsWith('image/');
        const isHeic = file.originalname.toLowerCase().endsWith('.heic') || 
                       file.originalname.toLowerCase().endsWith('.heif') ||
                       file.mimetype === 'image/heic' || 
                       file.mimetype === 'image/heif';
        
        if (isImage || isHeic) {
            cb(null, true);
        } else {
            cb(new Error('Only image files (including HEIC) are allowed!'));
        }
    }
});

// Limit upload endpoints to reduce abuse
const uploadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false
});

async function processUploadedImage(inputPath, baseName, uploadPath) {
    const outputFilename = `${baseName}.jpg`;
    const outputPath = path.join(uploadPath, outputFilename);
    await sharp(inputPath)
        .rotate()
        .jpeg({ quality: 85 })
        .toFile(outputPath);
    if (path.normalize(inputPath) !== path.normalize(outputPath)) {
        try { fs.unlinkSync(inputPath); } catch (e) {}
    }
    return { outputFilename, outputPath };
}

// ==================== AUTHENTICATION ROUTES ====================

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        const user = await AdminUser.findByUsername(username);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValid = await AdminUser.verifyPassword(password, user.password_hash);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Set session
        req.session.user = { id: user.id, username: user.username };
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).json({ error: 'Failed to create session' });
            }
            res.json({ success: true, user: { username: user.username } });
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to logout' });
        }
        res.json({ success: true });
    });
});

// Check auth status
app.get('/api/auth/status', (req, res) => {
    if (req.session && req.session.user && req.session.user.username) {
        res.json({ authenticated: true, user: req.session.user });
    } else {
        res.json({ authenticated: false });
    }
});

// Change password
app.post('/api/auth/change-password', requireAuth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current and new password required' });
        }

        const user = await AdminUser.findByUsername(req.session.user.username);
        const isValid = await AdminUser.verifyPassword(currentPassword, user.password_hash);
        
        if (!isValid) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        await AdminUser.changePassword(req.session.user.username, newPassword);
        res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ==================== TEAM MEMBER API ROUTES ====================

// Get all team members
app.get('/api/team-members', async (req, res) => {
    try {
        const members = await TeamMember.getAll();
        res.json(members);
    } catch (error) {
        console.error('Get team members error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get single team member
app.get('/api/team-members/:id', async (req, res) => {
    try {
        const member = await TeamMember.getById(req.params.id);
        if (!member) {
            return res.status(404).json({ error: 'Team member not found' });
        }
        res.json(member);
    } catch (error) {
        console.error('Get team member error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create team member
app.post('/api/team-members', requireAuth, async (req, res) => {
    try {
        const member = await TeamMember.create(req.body);
        res.status(201).json(member);
    } catch (error) {
        console.error('Create team member error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update team member
app.put('/api/team-members/:id', requireAuth, async (req, res) => {
    try {
        const member = await TeamMember.update(req.params.id, req.body);
        res.json(member);
    } catch (error) {
        console.error('Update team member error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete team member (soft delete)
app.delete('/api/team-members/:id', requireAuth, async (req, res) => {
    try {
        await TeamMember.delete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        console.error('Delete team member error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ==================== FILE UPLOAD ROUTES ====================

// Upload endpoint (public)
app.post('/api/upload', uploadLimiter, upload.single('photo'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const uploadPath = path.join(__dirname, '..', PHOTOS_DIR);
        const baseName = path.parse(req.file.filename).name;
        const { outputFilename } = await processUploadedImage(req.file.path, baseName, uploadPath);
        res.json({
            success: true,
            message: 'File uploaded successfully',
            filename: outputFilename,
            url: `/Pics/${outputFilename}`
        });
    } catch (err) {
        console.error('Image processing error:', err);
        res.status(500).json({ error: 'Failed to process image' });
    }
});

// Admin upload endpoint (with custom path)
app.post('/api/admin/upload', requireAuth, uploadLimiter, upload.single('photo'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const uploadPath = path.join(__dirname, '..', PHOTOS_DIR);
        const baseName = path.parse(req.file.filename).name;
        const { outputFilename, outputPath } = await processUploadedImage(req.file.path, baseName, uploadPath);
        const relativePath = path.relative(path.join(__dirname, '..'), outputPath).replace(/\\/g, '/');
        res.json({
            success: true,
            message: 'File uploaded successfully',
            filename: outputFilename,
            relativePath,
            url: `/${relativePath}`
        });
    } catch (err) {
        console.error('Image processing error:', err);
        res.status(500).json({ error: 'Failed to process image' });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
        }
    }
    
    res.status(400).json({ error: error.message });
});

// Start server with HTTPS support (Cloudflare Origin Certificate)
const certPath = path.join(__dirname, '..', 'cloudflare-origin.crt');
const keyPath = path.join(__dirname, '..', 'cloudflare-origin.key');

if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
    // HTTPS server with Cloudflare Origin Certificate
    const options = {
        cert: fs.readFileSync(certPath),
        key: fs.readFileSync(keyPath)
    };
    
    https.createServer(options, app).listen(HTTPS_PORT, () => {
        console.log(`HTTPS server running on https://localhost:${HTTPS_PORT}`);
        console.log(`Upload endpoint: https://localhost:${HTTPS_PORT}/api/upload`);
        console.log(`Serving static files from: ${publicPath}`);
        console.log(`Using Cloudflare Origin Certificate`);
    });
    
    // Also start HTTP server on port 3000 for internal use
    http.createServer(app).listen(PORT, () => {
        console.log(`HTTP server running on http://localhost:${PORT} (internal)`);
    });
} else {
    // Fallback to HTTP only if certificates not found
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`Upload endpoint: http://localhost:${PORT}/api/upload`);
        console.log(`Serving static files from: ${publicPath}`);
        if (process.env.HTTPS_PORT) {
            console.log(`⚠️  HTTPS_PORT set but certificates not found. Place cloudflare-origin.crt and cloudflare-origin.key in project root.`);
        }
    });
}

