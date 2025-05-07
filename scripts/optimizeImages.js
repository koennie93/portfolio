const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

/**
 * Optimize images in a directory
 * @param {string} directory Directory containing images to optimize
 * @param {number} quality JPEG quality (1-100)
 * @param {boolean} force Force optimization even if optimized version exists
 * @param {boolean} skipExisting Skip files that already have an optimized version
 */
function optimizeImages(directory, quality = 80, force = false, skipExisting = true) {
  console.log(`Optimizing images in ${directory}...`);
  
  // Check if directory exists
  if (!fs.existsSync(directory)) {
    console.error(`Directory not found: ${directory}`);
    return;
  }
  
  // Get all files in directory
  const files = fs.readdirSync(directory);
  
  // Process each file
  for (const file of files) {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Recursively process subdirectories
      optimizeImages(filePath, quality, force, skipExisting);
    } else if (/\.(jpe?g|png)$/i.test(file)) {
      // Skip files that already have -optimized in the name
      if (/-optimized\.(jpe?g|png)$/i.test(file)) {
        console.log(`Skipping already optimized file: ${file}`);
        continue;
      }
      
      // Process image files
      const outputPath = filePath.replace(/(\.[^.]+)$/, '-optimized$1');
      
      // Check if optimized version already exists
      const optimizedExists = fs.existsSync(outputPath);
      
      // Skip if optimized version exists and we're not forcing re-optimization
      if (optimizedExists && !force) {
        console.log(`Optimized version exists: ${path.basename(outputPath)}`);
        continue;
      }
      
      // Check if we should skip files that already have an optimized version
      if (optimizedExists && skipExisting) {
        console.log(`Skipping (optimized version exists): ${file}`);
        continue;
      }
      
      // Get file size before optimization
      const originalSize = stat.size;
      
      // Create Sharp instance
      const sharpInstance = sharp(filePath);
      
      // Apply different optimizations based on file type
      if (/\.png$/i.test(file)) {
        // PNG optimization
        sharpInstance.png({
          quality,
          compressionLevel: 9,
          adaptiveFiltering: true,
          force: true
        });
      } else {
        // JPEG optimization
        sharpInstance.jpeg({
          quality,
          mozjpeg: true
        });
      }
      
      // Save the optimized image
      sharpInstance
        .toFile(outputPath)
        .then(() => {
          // Get optimized file size
          const optimizedSize = fs.statSync(outputPath).size;
          const reduction = 100 - (optimizedSize / originalSize * 100);
          
          console.log(`Optimized ${file}: ${reduction.toFixed(2)}% reduction (${(originalSize/1024).toFixed(1)}KB → ${(optimizedSize/1024).toFixed(1)}KB)`);
        })
        .catch(err => {
          console.error(`Error optimizing ${file}:`, err);
        });
    }
  }
}

// Main function
function main() {
  // Set default values
  let directory = 'img';
  let quality = 80;
  let force = false;
  let skipExisting = true;
  
  // Simple manual argument parsing
  const args = process.argv.slice(2);
  
  // Print usage if help is requested
  if (args.includes('--help') || args.includes('-h')) {
    console.log('Usage: node optimize-images.js [options]');
    console.log('');
    console.log('Options:');
    console.log('  --dir, -d        Directory to process (default: img)');
    console.log('  --quality, -q    Image quality (1-100, default: 80)');
    console.log('  --force, -f      Force re-optimization of images that already have optimized versions');
    console.log('  --process-all    Process all images, including those with existing optimized versions');
    console.log('  --help, -h       Show this help');
    return;
  }
  
  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--dir' || arg === '-d') {
      if (i + 1 < args.length && !args[i + 1].startsWith('-')) {
        directory = args[i + 1];
        i++;
      }
    } else if (arg === '--quality' || arg === '-q') {
      if (i + 1 < args.length && !args[i + 1].startsWith('-')) {
        const parsedQuality = parseInt(args[i + 1], 10);
        if (!isNaN(parsedQuality) && parsedQuality > 0 && parsedQuality <= 100) {
          quality = parsedQuality;
        }
        i++;
      }
    } else if (arg === '--force' || arg === '-f') {
      force = true;
    } else if (arg === '--process-all') {
      skipExisting = false;
    }
  }
  
  // Display configuration
  console.log('Image Optimizer Script');
  console.log('=====================');
  console.log(`Directory: ${directory}`);
  console.log(`Quality: ${quality}`);
  console.log(`Force mode: ${force ? 'Enabled' : 'Disabled'}`);
  console.log(`Skip existing: ${skipExisting ? 'Yes' : 'No'}`);
  console.log('=====================');
  
  // Run the optimizer
  optimizeImages(directory, quality, force, skipExisting);
}

// Start the script
main(); 