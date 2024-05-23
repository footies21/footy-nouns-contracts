const { palette } = require('../parts/palette');
const { backgrounds } = require('../parts/backgrounds');
const { heads } = require('../parts/heads');
const { kits } = require('../parts/kits');
const { glasses } = require('../parts/glasses');

async function main() {
  // deploy descriptor
  const FootyDescriptor = await ethers.getContractFactory('FootyDescriptor');
  const descriptor = await FootyDescriptor.deploy();
  console.log('FootyDescriptor deployed to:', descriptor.address);

  // const contract = await FootyNouns.deploy({gasLimit: 8000000000000})

  // deploy main contract with descriptor address as argument
  // const FootyNouns = await ethers.getContractFactory('FootyNouns');
  // const main = await FootyNouns.deploy(descriptor.address);
  // console.log('FootyNouns deployed to:', main.address);

  // add parts to descriptor
  const paletteTx = await descriptor.addManyColorsToPalette(palette);
  const resultPalette = await paletteTx.wait();
  console.log(
    `${(
      await descriptor.colorCount()
    ).toString()} colors using ${resultPalette.gasUsed.toNumber()} units of gas`,
  );

  const backgroundsTx = await descriptor.addManyBackgrounds(backgrounds);
  const resultBackgrounds = await backgroundsTx.wait();
  console.log(
    `${(
      await descriptor.backgroundCount()
    ).toString()} backgrounds added using ${resultBackgrounds.gasUsed.toNumber()} units of gas`,
  );

  const headsTx = await descriptor.addManyHeads(heads);
  const resultHeads = await headsTx.wait();
  console.log(
    `${(
      await descriptor.headCount()
    ).toString()} heads added using ${resultHeads.gasUsed.toNumber()} units of gas`,
  );

  const kitsTx = await descriptor.addManyKits(kits);
  const resultKits = await kitsTx.wait();
  console.log(
    `${(
      await descriptor.kitCount()
    ).toString()} kits added using ${resultKits.gasUsed.toNumber()} units of gas`,
  );

  const glassesTx = await descriptor.addManyGlasses(glasses);
  const resultGlasses = await glassesTx.wait();
  console.log(
    `${(
      await descriptor.glassesCount()
    ).toString()} glasses added using ${resultGlasses.gasUsed.toNumber()} units of gas`,
  );

  // if (networkName != 'localhost') {
  //   console.log('');
  //   console.log('To verify this contract on Etherscan, try:');
  //   console.log(
  //     `npx hardhat verify --network ${networkName} ${contract.address}`,
  //   );
  // }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
