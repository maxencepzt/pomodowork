const fs = require('fs');
const path = require('path');

// Minimal 1-frame MP3 silence (approx 26ms). We will loop this.
// Hex for a valid MP3 frame (MPEG 1 Layer 3, 44.1kHz, 32kbps, Joint Stereo)
const hexData = 'FFFB9064000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';

const buffer = Buffer.from(hexData, 'hex');
const filePath = path.join(__dirname, 'assets/sounds/silence.mp3');

fs.writeFileSync(filePath, buffer);
console.log('Created silence.mp3');
