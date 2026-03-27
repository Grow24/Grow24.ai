#!/bin/bash
# Generate simple placeholder icons for the extension

# Create SVG
cat > icon.svg << 'EOF'
<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ea4335;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#d23f31;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="128" height="128" rx="24" fill="url(#grad)"/>
  <circle cx="64" cy="64" r="32" fill="white"/>
  <circle cx="64" cy="64" r="20" fill="#ea4335"/>
</svg>
EOF

echo "Icon SVG created!"
echo "To convert to PNG, install ImageMagick and run:"
echo "  convert icon.svg -resize 16x16 icon16.png"
echo "  convert icon.svg -resize 48x48 icon48.png"
echo "  convert icon.svg -resize 128x128 icon128.png"
