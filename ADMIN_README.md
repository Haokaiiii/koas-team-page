# KOAS Admin Panel

## 🚀 Quick Start

### Access Admin Panel
1. Navigate to: `http://localhost:3000/admin/login.html`
2. Default credentials:
   - **Username:** `admin`
   - **Password:** `admin123`
3. **⚠️ IMPORTANT:** Change the password after first login!

### Features
- ✅ Add new team members
- ✅ Edit existing team members
- ✅ Upload photos for team members
- ✅ Write personal summaries/notes
- ✅ Delete team members (soft delete)
- ✅ Manage display order

## 📝 Adding a Team Member

1. **Login** to the admin panel
2. Fill in the form:
   - **Name** (required)
   - **Role** (e.g., "Head of Marketing")
   - **Department** (select from dropdown)
   - **Photo** (upload image file)
   - **Personal Summary** (background, experience, hobbies, responsibilities)
   - **Display Order** (for sorting)
3. Click **Save Member**

## 🔧 Configuration

### Environment Variables
You can set these in `docker-compose.yml` or as environment variables:

- `ADMIN_PASSWORD` - Default admin password (default: `admin123`)
- `SESSION_SECRET` - Session encryption key (change in production!)

### Database
- SQLite database stored in `./data/koas.db`
- Automatically created on first run
- Persisted via Docker volume

## 🖥️ Optimizing for M5 Mac Mini (10 CPUs)

### Docker Desktop Settings
1. Open **Docker Desktop** → **Settings** → **Resources**
2. Set:
   - **CPUs:** 10 (or maximum available)
   - **Memory:** 8GB+ (recommended)
   - **Swap:** 2GB
   - **Disk image size:** As needed

### Performance Tips
- The application will automatically utilize available CPU cores
- Node.js handles concurrent requests efficiently
- Database operations are optimized for SQLite
- File uploads are handled asynchronously

## 🔐 Security Notes

1. **Change default password** immediately after first login
2. **Set a strong SESSION_SECRET** in production
3. **Use HTTPS** in production (set `NODE_ENV=production`)
4. **Regular backups** of the `data/` directory

## 📁 File Structure

```
/admin/
  ├── login.html      # Admin login page
  ├── dashboard.html  # Admin dashboard
  └── admin.js        # Admin panel JavaScript
```

## 🐛 Troubleshooting

### Can't login?
- Check that the database was initialized
- Verify credentials (default: admin/admin123)
- Check Docker logs: `docker-compose logs`

### Photos not uploading?
- Check file size (max 10MB)
- Verify file format (images only)
- Check Docker volume mounts

### Database errors?
- Ensure `./data` directory exists and is writable
- Check Docker volume mount in `docker-compose.yml`
- Restart container: `docker-compose restart`

