// Database setup and operations
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const argon2 = require('argon2');

const DB_PATH = path.join(__dirname, '..', 'data', 'koas.db');
const DB_DIR = path.dirname(DB_PATH);

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
}

// Initialize database
function initDatabase() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(DB_PATH, (err) => {
            if (err) {
                console.error('Error opening database:', err);
                reject(err);
                return;
            }
            console.log('Connected to SQLite database');
        });

        // Create tables
        db.serialize(() => {
            // Admin users table
            db.run(`CREATE TABLE IF NOT EXISTS admin_users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`, (err) => {
                if (err) {
                    console.error('Error creating admin_users table:', err);
                    reject(err);
                    return;
                }
            });

            // Team members table
            db.run(`CREATE TABLE IF NOT EXISTS team_members (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                role TEXT,
                department TEXT,
                photo_path TEXT,
                summary TEXT,
                display_order INTEGER DEFAULT 0,
                is_active INTEGER DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`, (err) => {
                if (err) {
                    console.error('Error creating team_members table:', err);
                    reject(err);
                    return;
                }
            });

            // Create default admin user if none exists
            db.get('SELECT COUNT(*) as count FROM admin_users', (err, row) => {
                if (err) {
                    console.error('Error checking admin users:', err);
                    reject(err);
                    return;
                }

                if (row.count === 0) {
                    const defaultUsername = process.env.ADMIN_USERNAME || 'KOASADMIN';
                    const defaultPassword = process.env.ADMIN_PASSWORD || 'Koas.123!';
                    if (process.env.NODE_ENV === 'production' && (!process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD === 'admin123' || process.env.ADMIN_PASSWORD === 'Koas.123!')) {
                        console.warn('Warning: Using default ADMIN_PASSWORD in production. Set a strong ADMIN_PASSWORD in environment variables.');
                    }
                    argon2.hash(defaultPassword)
                        .then((hash) => {
                            db.run(
                                'INSERT INTO admin_users (username, password_hash) VALUES (?, ?)',
                                [defaultUsername, hash],
                                (err) => {
                                    if (err) {
                                        console.error('Error creating default admin:', err);
                                        reject(err);
                                        return;
                                    }
                                    console.log('Default admin user created: username=' + defaultUsername);
                                    resolve(db);
                                }
                            );
                        })
                        .catch((hashErr) => {
                            console.error('Error hashing password:', hashErr);
                            reject(hashErr);
                        });
                } else {
                    resolve(db);
                }
            });
        });
    });
}

// Get database instance
function getDatabase() {
    return new sqlite3.Database(DB_PATH);
}

// Team member operations
const TeamMember = {
    getAll: () => {
        return new Promise((resolve, reject) => {
            const db = getDatabase();
            db.all(
                'SELECT * FROM team_members WHERE is_active = 1 ORDER BY display_order, name',
                (err, rows) => {
                    db.close();
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    },

    getById: (id) => {
        return new Promise((resolve, reject) => {
            const db = getDatabase();
            db.get(
                'SELECT * FROM team_members WHERE id = ?',
                [id],
                (err, row) => {
                    db.close();
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });
    },

    create: (member) => {
        return new Promise((resolve, reject) => {
            const db = getDatabase();
            db.run(
                `INSERT INTO team_members (name, role, department, photo_path, summary, display_order)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [member.name, member.role, member.department, member.photo_path, member.summary, member.display_order || 0],
                function(err) {
                    db.close();
                    if (err) reject(err);
                    else resolve({ id: this.lastID, ...member });
                }
            );
        });
    },

    update: (id, member) => {
        return new Promise((resolve, reject) => {
            const db = getDatabase();
            db.run(
                `UPDATE team_members 
                 SET name = ?, role = ?, department = ?, photo_path = ?, summary = ?, display_order = ?, updated_at = CURRENT_TIMESTAMP
                 WHERE id = ?`,
                [member.name, member.role, member.department, member.photo_path, member.summary, member.display_order || 0, id],
                (err) => {
                    db.close();
                    if (err) reject(err);
                    else resolve({ id, ...member });
                }
            );
        });
    },

    delete: (id) => {
        return new Promise((resolve, reject) => {
            const db = getDatabase();
            db.run(
                'UPDATE team_members SET is_active = 0 WHERE id = ?',
                [id],
                (err) => {
                    db.close();
                    if (err) reject(err);
                    else resolve();
                }
            );
        });
    }
};

// Admin user operations
const AdminUser = {
    findByUsername: (username) => {
        return new Promise((resolve, reject) => {
            const db = getDatabase();
            db.get(
                'SELECT * FROM admin_users WHERE username = ?',
                [username],
                (err, row) => {
                    db.close();
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });
    },

    verifyPassword: async (password, hash) => {
        return argon2.verify(hash, password);
    },

    changePassword: (username, newPassword) => {
        return new Promise((resolve, reject) => {
            argon2.hash(newPassword)
                .then((hash) => {
                    const db = getDatabase();
                    db.run(
                        'UPDATE admin_users SET password_hash = ? WHERE username = ?',
                        [hash, username],
                        (err) => {
                            db.close();
                            if (err) reject(err);
                            else resolve();
                        }
                    );
                })
                .catch((err) => reject(err));
        });
    }
};

module.exports = {
    initDatabase,
    getDatabase,
    TeamMember,
    AdminUser
};

