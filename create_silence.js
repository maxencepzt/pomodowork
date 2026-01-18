const fs = require('fs');
const path = require('path');

// Minimal 1-frame MP3 silence (approx 26ms). We will loop this.
// Hex for a valid MP3 frame
const frameHex = 'FFFB9064000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';

// Repeat frame ~38 times for ~1 second of silence
let hexData = '';
for (let i = 0; i < 38; i++) {
    hexData += frameHex;
}

const buffer = Buffer.from(hexData, 'hex');
const filePath = path.join(__dirname, 'assets/sounds/silence.mp3');

fs.writeFileSync(filePath, buffer);
console.log('Created silence.mp3');
