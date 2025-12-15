import { Router } from 'itty-router';

// Create a new router
const router = Router();

// Static file responses (you can replace these with actual file contents)
const staticFiles = {
  '/': `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KOAS Agency - Our Core Team & Structure</title>
    <link rel="stylesheet" href="/css/main.css">
    <link rel="stylesheet" href="/css/components.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="container">
            <div class="header-content">
                <div class="header-top">
                    <div class="logo-container">
                        <img src="https://via.placeholder.com/100x50/333/fff?text=KOAS" alt="KOAS Agency Logo" class="company-logo">
                    </div>
                    <div class="header-nav">
                        <a href="/upload.html" class="upload-link-header">📤 Upload Photos</a>
                        <a href="/admin/login.html" class="admin-login-btn">🔐 Admin</a>
                    </div>
                </div>
                <p class="agency-subtitle">Asia's Premier Creator Management Agency</p>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
        <div class="container">
            <div class="page-title-section">
                <h2 class="page-title">Our Core Team & Structure</h2>
                <p class="page-subtitle">Q4 2025</p>
                <p style="margin-top: 2rem;">
                    <a href="/story.html" class="story-link">View Our Story →</a>
                </p>
            </div>

            <!-- Team Structure -->
            <div class="org-chart">
                <!-- Founders & Executives -->
                <div class="department founders">
                    <div class="department-header">
                        <span class="department-icon">🏛</span>
                        <h3 class="department-title">Founders & Executives</h3>
                    </div>
                    <div class="team-members">
                        <div class="member-card">
                            <div class="member-photo">
                                <img src="https://via.placeholder.com/150x150/4A90E2/fff?text=J" alt="Jack">
                                <div class="photo-placeholder" style="display:none;">
                                    <span>J</span>
                                </div>
                            </div>
                            <div class="member-name">Jack</div>
                            <div class="member-role">Head of Business Development / Co-Founder</div>
                            <div class="member-summary">
                                <div class="member-about">
                                    <span class="about-label">📝 About</span>
                                    <p><strong>Background:</strong> Chinese-German</p>
                                    <p>Owned Restaurants & Bars in Germany before switching into digital marketing due to COVID</p>
                                    <p>Bachelors in Economics and lived all over South East Asia and China, Dubai & Europe</p>
                                    <p><strong>Hobbies:</strong> Learning languages & Training e.g. martial Arts, Cooking</p>
                                    <p><strong>Current Responsibilities:</strong> HR Management, Financials & Salarys, Operative Team Leader in Taipei and Model Acquisition</p>
                                </div>
                            </div>
                        </div>

                        <div class="member-card">
                            <div class="member-photo">
                                <img src="https://via.placeholder.com/150x150/50C878/fff?text=M" alt="Michael">
                                <div class="photo-placeholder" style="display:none;">
                                    <span>M</span>
                                </div>
                            </div>
                            <div class="member-name">Michael</div>
                            <div class="member-role">Founder, Head of Marketing</div>
                        </div>

                        <div class="member-card">
                            <div class="member-photo">
                                <img src="https://via.placeholder.com/150x150/FF6B6B/fff?text=A" alt="Alexander">
                                <div class="photo-placeholder" style="display:none;">
                                    <span>A</span>
                                </div>
                            </div>
                            <div class="member-name">Alexander</div>
                            <div class="member-role">Founder, Head of Sales</div>
                        </div>
                    </div>
                </div>

                <!-- Creative Department -->
                <div class="department creative">
                    <div class="department-header">
                        <span class="department-icon">💡</span>
                        <h3 class="department-title">Creative Department</h3>
                    </div>
                    <div class="team-members">
                        <div class="member-card">
                            <div class="member-photo">
                                <img src="https://via.placeholder.com/150x150/9B59B6/fff?text=O" alt="Oliver">
                                <div class="photo-placeholder" style="display:none;">
                                    <span>O</span>
                                </div>
                            </div>
                            <div class="member-name">Oliver</div>
                            <div class="member-role">Creative Director</div>
                            <div class="member-subtitle">since Sept 2025</div>
                        </div>

                        <div class="member-card">
                            <div class="member-photo">
                                <img src="https://via.placeholder.com/150x150/E74C3C/fff?text=E" alt="Elena">
                                <div class="photo-placeholder" style="display:none;">
                                    <span>E</span>
                                </div>
                            </div>
                            <div class="member-name">Elena</div>
                            <div class="member-role">Creative Director</div>
                            <div class="member-subtitle">since June 2025</div>
                        </div>

                        <div class="member-card">
                            <div class="member-photo">
                                <img src="https://via.placeholder.com/150x150/F39C12/fff?text=A" alt="Ain">
                                <div class="photo-placeholder" style="display:none;">
                                    <span>A</span>
                                </div>
                            </div>
                            <div class="member-name">Ain</div>
                            <div class="member-role">Creative Director</div>
                            <div class="member-subtitle">full-time since Sept 2025</div>
                        </div>

                        <div class="member-card">
                            <div class="member-photo">
                                <img src="https://via.placeholder.com/150x150/8E44AD/fff?text=R" alt="Enrico">
                                <div class="photo-placeholder" style="display:none;">
                                    <span>R</span>
                                </div>
                            </div>
                            <div class="member-name">(En)Rico</div>
                            <div class="member-role">Creative Director</div>
                            <div class="member-subtitle">since Aug 2025</div>
                        </div>
                    </div>
                </div>

                <!-- Business & Operations -->
                <div class="department operations">
                    <div class="department-header">
                        <span class="department-icon">🧠</span>
                        <h3 class="department-title">Business & Operations</h3>
                    </div>
                    <div class="team-members">
                        <div class="member-card">
                            <div class="member-photo">
                                <img src="https://via.placeholder.com/150x150/3498DB/fff?text=T" alt="Tina">
                                <div class="photo-placeholder" style="display:none;">
                                    <span>T</span>
                                </div>
                            </div>
                            <div class="member-name">Tina</div>
                            <div class="member-role">Head of Support & Communication</div>
                            <div class="member-subtitle">since Feb 2025 (Assistant since April 2024)</div>
                        </div>

                        <div class="member-card">
                            <div class="member-photo">
                                <img src="https://via.placeholder.com/150x150/E67E22/fff?text=R" alt="Rin">
                                <div class="photo-placeholder" style="display:none;">
                                    <span>R</span>
                                </div>
                            </div>
                            <div class="member-name">Rin</div>
                            <div class="member-role">Head of Instagram</div>
                            <div class="member-subtitle">since Oct 2025 (Assistant since Nov 2024)</div>
                        </div>

                        <div class="member-card">
                            <div class="member-photo">
                                <img src="https://via.placeholder.com/150x150/2ECC71/fff?text=J" alt="Jarad">
                                <div class="photo-placeholder" style="display:none;">
                                    <span>J</span>
                                </div>
                            </div>
                            <div class="member-name">Jarad</div>
                            <div class="member-role">Marketing & Business Development</div>
                            <div class="member-subtitle">full-time since July 2025</div>
                        </div>

                        <div class="member-card">
                            <div class="member-photo">
                                <img src="https://via.placeholder.com/150x150/9B59B6/fff?text=A" alt="Anna">
                                <div class="photo-placeholder" style="display:none;">
                                    <span>A</span>
                                </div>
                            </div>
                            <div class="member-name">Anna</div>
                            <div class="member-role">Marketing Assistant</div>
                            <div class="member-subtitle">full-time since Sept 2025</div>
                        </div>
                    </div>
                </div>

                <!-- Sales & Expansion -->
                <div class="department sales">
                    <div class="department-header">
                        <span class="department-icon">🔥</span>
                        <h3 class="department-title">Sales & Expansion</h3>
                    </div>
                    <div class="team-members">
                        <div class="member-card">
                            <div class="member-photo">
                                <img src="https://via.placeholder.com/150x150/34495E/fff?text=D" alt="Dominik">
                                <div class="photo-placeholder" style="display:none;">
                                    <span>D</span>
                                </div>
                            </div>
                            <div class="member-name">Dominik</div>
                            <div class="member-role">Sales Manager</div>
                            <div class="member-subtitle">since Aug 2024</div>
                        </div>

                        <div class="member-card">
                            <div class="member-photo">
                                <img src="https://via.placeholder.com/150x150/16A085/fff?text=H" alt="Haokai">
                                <div class="photo-placeholder" style="display:none;">
                                    <span>H</span>
                                </div>
                            </div>
                            <div class="member-name">Haokai</div>
                            <div class="member-role">Sales Manager</div>
                            <div class="member-subtitle">since Oct 2025</div>
                        </div>
                    </div>
                </div>

                <!-- Creative / Production Team -->
                <div class="department production">
                    <div class="department-header">
                        <span class="department-icon">📸</span>
                        <h3 class="department-title">Creative / Production Team</h3>
                    </div>
                    <div class="team-members">
                        <div class="member-card">
                            <div class="member-photo">
                                <div class="photo-placeholder">
                                    <span>S</span>
                                </div>
                            </div>
                            <div class="member-name">Shot</div>
                            <div class="member-role">Photographer</div>
                            <div class="member-subtitle">since Apr 2025</div>
                        </div>
                    </div>
                </div>

                <!-- Alumni / Former Key Members -->
                <div class="department alumni">
                    <div class="department-header">
                        <span class="department-icon">🕊</span>
                        <h3 class="department-title">Alumni / Former Key Members</h3>
                    </div>
                    <div class="team-members">
                        <div class="member-card alumni">
                            <div class="member-photo">
                                <div class="photo-placeholder">
                                    <span>S</span>
                                </div>
                            </div>
                            <div class="member-name">Sam</div>
                            <div class="member-subtitle">Apr 2024 – Jun 2025</div>
                        </div>

                        <div class="member-card alumni">
                            <div class="member-photo">
                                <div class="photo-placeholder">
                                    <span>D</span>
                                </div>
                            </div>
                            <div class="member-name">David</div>
                            <div class="member-subtitle">Mar 2023 – Aug 2025</div>
                        </div>

                        <div class="member-card alumni">
                            <div class="member-photo">
                                <div class="photo-placeholder">
                                    <span>M</span>
                                </div>
                            </div>
                            <div class="member-name">Mahdi</div>
                            <div class="member-subtitle">Feb – Jul 2025</div>
                        </div>

                        <div class="member-card alumni">
                            <div class="member-photo">
                                <div class="photo-placeholder">
                                    <span>R</span>
                                </div>
                            </div>
                            <div class="member-name">Rico</div>
                            <div class="member-subtitle">Nov 2024 – Feb 2025</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>&copy; 2025 KOAS Agency. All rights reserved.</p>
        </div>
    </footer>

    <!-- Scripts -->
    <script src="/js/main.js"></script>
</body>
</html>`,
  '/story.html': `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KOAS Agency - Our Story</title>
    <link rel="stylesheet" href="/css/story.css">
</head>
<body>
    <div class="story-container">
        <h1>Our Story</h1>
        <p>Coming soon...</p>
        <a href="/" class="back-link">← Back to Team</a>
    </div>
</body>
</html>`,
  '/upload.html': `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KOAS Agency - Upload Photos</title>
    <link rel="stylesheet" href="/css/upload.css">
</head>
<body>
    <div class="upload-container">
        <h1>Upload Team Photos</h1>
        <p>Photo upload functionality is currently disabled for static deployment.</p>
        <p>Please contact the administrator for photo updates.</p>
        <a href="/" class="back-link">← Back to Team</a>
    </div>
</body>
</html>`,
  '/admin/login.html': `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KOAS Agency - Admin Login</title>
    <link rel="stylesheet" href="/css/main.css">
</head>
<body>
    <div class="admin-container">
        <h1>Admin Login</h1>
        <p>Admin functionality is not available in static deployment.</p>
        <a href="/" class="back-link">← Back to Team</a>
    </div>
</body>
</html>`
};

// API endpoint for health check
router.get('/api/health', () => {
  return new Response(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }), {
    headers: { 'Content-Type': 'application/json' }
  });
});

// Handle static file requests
router.get('*', (request) => {
  const url = new URL(request.url);
  const path = url.pathname;

  // Check if we have a static response for this path
  if (staticFiles[path]) {
    return new Response(staticFiles[path], {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  }

  // Handle CSS and JS files (you would need to host these files somewhere accessible)
  if (path.endsWith('.css') || path.endsWith('.js')) {
    return new Response(`/* ${path} - File not found in static deployment */`, {
      headers: {
        'Content-Type': path.endsWith('.css') ? 'text/css' : 'application/javascript',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  }

  // Default 404 response
  return new Response('Page not found', {
    status: 404,
    headers: { 'Content-Type': 'text/plain' }
  });
});

// Export the router
export default router;