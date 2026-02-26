const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const screenshots = [
  { name: 'dashboard', width: 1280, height: 720, label: 'Dashboard AgriHub untuk petani' },
  { name: 'marketplace', width: 750, height: 1334, label: 'Marketplace produk pertanian' }
];

const outputDir = path.join(__dirname, 'public/screenshots');

async function generateScreenshot(name, width, height, label) {
  const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="#10b981" opacity="0.2"/>
  <rect x="20" y="20" width="${width - 40}" height="${height - 40}" fill="#ffffff" rx="16"/>
  <text x="${width / 2}" y="${height / 2 - 20}" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" fill="#374151">${label}</text>
  <text x="${width / 2}" y="${height / 2 + 20}" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#6b7280">${width} x ${height}</text>
</svg>`;
  
  const svgBuffer = Buffer.from(svg);
  const outputPath = path.join(outputDir, `${name}.png`);
  await sharp(svgBuffer)
    .png()
    .toFile(outputPath);
  console.log(`Generated ${outputPath}`);
}

async function generateAll() {
  try {
    await fs.mkdir(outputDir, { recursive: true });
    for (const shot of screenshots) {
      await generateScreenshot(shot.name, shot.width, shot.height, shot.label);
    }
    console.log('All screenshots generated!');
  } catch (error) {
    console.error('Error generating screenshots:', error);
    process.exit(1);
  }
}

generateAll();