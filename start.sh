#!/bin/bash

echo "🚀 Starting KOAS Information Page..."

# Stop and remove existing containers
docker-compose down

# Build and start services
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check service status
docker-compose ps

echo ""
echo "✅ Services started!"
echo ""
echo "🌐 Access your application:"
echo "   - Via domain (KOAS subpath): https://${SITE_DOMAIN:-haokaiii.com}/koas"
echo "   - Via domain (main site):    https://${SITE_DOMAIN:-haokaiii.com}"
echo "   - Via IP (direct):           http://14.137.78.138:3003"
echo "   - Via localhost:             http://localhost:3003"
echo "   - Via nginx proxy:           http://localhost/koas"
echo ""
echo "📊 Check logs with: docker-compose logs -f"
echo "🛑 Stop with: docker-compose down"