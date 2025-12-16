// Image Compression Script for KOAS Agency
// Compresses images in the Pics directory for web deployment
// Run: node compress-images.js

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputDir = path.join(__dirname, 'Pics');
const outputDir = path.join(__dirname, 'Pics-compressed');

console.log('🖼️  KOAS Image Compression Tool');
console.log('================================\n');

// Check if sharp is available
let sharpModule;
try {
    sharpModule = require('sharp');
} catch (e) {
    console.log('❌ sharp not installed.');
    console.log('\nTo install: npm install sharp');
    console.log('\nAlternative: Use online tools like:');
    console.log('  - https://tinypng.com/');
    console.log('  - https://compressjpeg.com/');
    console.log('  - https://imagecompressor.com/');
    process.exit(1);
}

const compressionSettings = {
    quality: 80,        // JPEG quality (1-100)
    pngQuality: 80,     // PNG quality (1-100)
    webpQuality: 75,    // WebP quality (1-100)
    maxWidth: 1200,     // Maximum width in pixels
    maxHeight: 1200,    // Maximum height in pixels
    convertToWebp: false // Convert JPEG/PNG to WebP
};

async function compressImage(inputPath, outputPath) {
    const ext = path.extname(inputPath).toLowerCase();
    const filename = path.basename(inputPath, ext);

    try {
        let pipeline = sharp(inputPath);

        // Get image metadata
        const metadata = await pipeline.metadata();

        // Resize if too large
        if (metadata.width > compressionSettings.maxWidth || metadata.height > compressionSettings.maxHeight) {
            pipeline = pipeline.resize(compressionSettings.maxWidth, compressionSettings.maxHeight, {
                fit: 'inside',
                withoutEnlargement: true
            });
        }

        // Compress based on format
        if (ext === '.jpg' || ext === '.jpeg') {
            if (compressionSettings.convertToWebp) {
                await pipeline.webp({ quality: compressionSettings.webpQuality }).toFile(outputPath.replace(ext, '.webp'));
            } else {
                await pipeline.jpeg({ quality: compressionSettings.quality }).toFile(outputPath);
            }
        } else if (ext === '.png') {
            if (compressionSettings.convertToWebp) {
                await pipeline.webp({ quality: compressionSettings.webpQuality }).toFile(outputPath.replace(ext, '.webp'));
            } else {
                await pipeline.png({ quality: compressionSettings.pngQuality }).toFile(outputPath);
            }
        } else {
            // Copy other formats as-is
            await pipeline.toFile(outputPath);
        }

        return true;
    } catch (error) {
        throw error;
    }
}

async function processDirectory(dirPath, relativePath = '') {
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const itemRelativePath = path.join(relativePath, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
            // Recursively process subdirectories
            await processDirectory(itemPath, itemRelativePath);
        } else if (stat.isFile()) {
            const ext = path.extname(item).toLowerCase();
            if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
                const outputPath = path.join(outputDir, itemRelativePath);

                // Ensure output directory exists
                const outputDirPath = path.dirname(outputPath);
                if (!fs.existsSync(outputDirPath)) {
                    fs.mkdirSync(outputDirPath, { recursive: true });
                }

                try {
                    const originalSize = stat.size;
                    process.stdout.write(`🔄 Compressing ${itemRelativePath}... `);

                    await compressImage(itemPath, outputPath);

                    const compressedSize = fs.statSync(outputPath).size;
                    const savings = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);

                    console.log(`✓ Saved ${savings}% (${(originalSize/1024).toFixed(1)}KB → ${(compressedSize/1024).toFixed(1)}KB)`);
                } catch (error) {
                    console.log(`✗ Error: ${error.message}`);
                }
            }
        }
    }
}

async function main() {
    if (!fs.existsSync(inputDir)) {
        console.error('❌ Pics directory not found');
        process.exit(1);
    }

    // Create output directory
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log(`📁 Input directory: ${inputDir}`);
    console.log(`📁 Output directory: ${outputDir}`);
    console.log(`⚙️  Settings:`);
    console.log(`   Quality: JPEG ${compressionSettings.quality}%, PNG ${compressionSettings.pngQuality}%`);
    console.log(`   Max size: ${compressionSettings.maxWidth}x${compressionSettings.maxHeight}px`);
    console.log(`   Convert to WebP: ${compressionSettings.convertToWebp ? 'Yes' : 'No'}`);
    console.log('');

    try {
        await processDirectory(inputDir);
        console.log('\n✅ Compression complete!');
        console.log(`📦 Compressed images saved to: ${outputDir}`);
        console.log('\n💡 Tips:');
        console.log('   - Replace original images with compressed versions');
        console.log('   - Test image quality before replacing');
        console.log('   - Consider using WebP format for better compression');
    } catch (error) {
        console.error('❌ Fatal error:', error);
        process.exit(1);
    }
}

main();