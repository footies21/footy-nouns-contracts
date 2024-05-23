const hre = require('hardhat');
const png = require('png-js');

// parts are 1 indexed lmfao
const TOTAL_KITS = 1;
const TOTAL_HEADS = 1;
const TOTAL_GLASSES = 1;

// transparent: 0 (both 0 & 1 are not included in the actual palette arrays, so access needs to subtract 2)
const BASE_PALETTE_TO_COLOR_INDEX = {
  '#8ac24a': 1,
  '#009688': 2,
  '#f54336': 3, // skin
  '#fefffe': 4, // highlight
  '#2196f2': 5,
};

function decodePixels(path) {
  return new Promise((resolve) => {
    png.decode(path, resolve);
  });
}

function componentToHex(c) {
  let hex = c.toString(16);
  return hex.length == 1 ? '0' + hex : hex;
}

function rgbToHex(r, g, b) {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

async function encodeImage(path) {
  const pixels = await decodePixels(path);

  const rleEncodedData = [];
  let runLength = 0;
  let currentColorIndex = 0;
  for (let i = 0; i < pixels.length; i = i + 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];

    console.log(i);

    console.log({ r, g, b, a });

    let colorIndex = 0;
    if (a == 255) {
      console.log(rgbToHex(r, g, b));
      colorIndex = BASE_PALETTE_TO_COLOR_INDEX[rgbToHex(r, g, b)];
    }

    if (colorIndex != currentColorIndex || runLength == 255) {
      rleEncodedData.push(runLength);
      rleEncodedData.push(currentColorIndex);
      runLength = 0;
      currentColorIndex = colorIndex;
    }
    runLength++;
  }

  return hre.ethers.utils.hexlify(rleEncodedData);
}

async function main() {
  const kits = [];
  for (let i = 1; i <= TOTAL_KITS; i++) {
    kits.push(await encodeImage(`images/kits-i/kit-${i}.png`));
  }

  const heads = [];
  for (let i = 1; i <= TOTAL_HEADS; i++) {
    heads.push(await encodeImage(`images/heads-i/head-${i}.png`));
  }

  const glasses = [];
  for (let i = 1; i <= TOTAL_GLASSES; i++) {
    glasses.push(await encodeImage(`images/glasses-i/glasses-${i}.png`));
  }

  console.log({ kits, heads, glasses });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
