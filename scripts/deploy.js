const { palette } = require('../parts/palette');
const { backgrounds } = require('../parts/backgrounds');
const { commonHeads } = require('../parts/commonHeads');
const { rareHeads } = require('../parts/rareHeads');
const { legendaryHeads } = require('../parts/legendaryHeads');
const { kits } = require('../parts/kits');
const { glasses } = require('../parts/glasses');

async function main() {
  const network = await ethers.provider.getNetwork();
  const networkName = network.name == 'unknown' ? 'localhost' : network.name;

  console.log(`Network: ${networkName} (chainId=${network.chainId})`);

  // deploy seeder
  const FootySeeder = await ethers.getContractFactory('FootySeeder');
  const seeder = await FootySeeder.deploy();
  console.log('FootySeeder deployed to:', seeder.address);

  // deploy descriptor
  const FootyDescriptor = await ethers.getContractFactory('FootyDescriptor');
  const descriptor = await FootyDescriptor.deploy();
  console.log('FootyDescriptor deployed to:', descriptor.address);

  // const contract = await FootyNouns.deploy({gasLimit: 8000000000000})

  // deploy main contract with descriptor address as argument
  const FootyNouns = await ethers.getContractFactory('FootyNouns');
  myContract = await FootyNouns.deploy(descriptor.address, seeder.address);
  console.log('FootyNouns deployed to:', myContract.address);

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

  const commonHeadsTx = await descriptor.addManyCommonHeads(commonHeads);
  const resultCommonHeads = await commonHeadsTx.wait();
  console.log(
    `${(
      await descriptor.commonHeadCount()
    ).toString()} heads added using ${resultCommonHeads.gasUsed.toNumber()} units of gas`,
  );

  const rareHeadsTx = await descriptor.addManyRareHeads(rareHeads);
  const resultRareHeads = await rareHeadsTx.wait();
  console.log(
    `${(
      await descriptor.rareHeadCount()
    ).toString()} heads added using ${resultRareHeads.gasUsed.toNumber()} units of gas`,
  );

  const legendaryHeadsTx = await descriptor.addManyLegendaryHeads(
    legendaryHeads,
  );
  const resultLegendaryHeads = await legendaryHeadsTx.wait();
  console.log(
    `${(
      await descriptor.legendaryHeadCount()
    ).toString()} heads added using ${resultLegendaryHeads.gasUsed.toNumber()} units of gas`,
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

  const FootyNames = await ethers.getContractFactory('FootyNames');

  const namesContract = await FootyNames.deploy(myContract.address);

  console.log('FootyNames deployed to:', namesContract.address);

  const FootySquads = await ethers.getContractFactory('FootySquads');

  const squadsContract = await FootySquads.deploy(myContract.address);

  console.log('FootySquads deployed to:', squadsContract.address);

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
