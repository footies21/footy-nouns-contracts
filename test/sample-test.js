const { expect } = require('chai');
const { ethers } = require('hardhat');
const { palette } = require('../parts/palette');
const { backgrounds } = require('../parts/backgrounds');
const { commonHeads } = require('../parts/commonHeads');
const { rareHeads } = require('../parts/rareHeads');
const { legendaryHeads } = require('../parts/legendaryHeads');
const { kits } = require('../parts/kits');
const { glasses } = require('../parts/glasses');

describe('FootyNouns', function () {
  let myContract;

  this.beforeAll(async () => {
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
  });

  it('Should call mint correctly', async function () {
    const price = await myContract.mintOnePrice();

    const result = await myContract.mint({
      value: price,
    });

    expect(result).to.emit(myContract, 'Transfer');

    const receipt = await result.wait();

    const gasUsed = receipt.gasUsed.toNumber();
    console.log({ gasUsed });

    const transferEvent = receipt.events.find((i) => i.event === 'Transfer');

    expect(transferEvent.args['tokenId'].toNumber()).to.equal(1);

    const tokenURI = await myContract.tokenURI(1);
    const json = Buffer.from(tokenURI.substring(29), 'base64').toString();
    const parsed = JSON.parse(json);
    console.log({ parsed });
    expect(parsed).to.haveOwnProperty('image');
    expect(parsed.image).to.include('data:image/svg+xml;base64');
  });

  // it('Should call mintThree correctly', async function () {
  //   // const price = await myContract.mintThreePrice();

  //   const result = await myContract.mintMany(3, {
  //     value: "75000000000000000",
  //   });

  //   expect(result).to.emit(myContract, 'Transfer');

  //   const receipt = await result.wait();

  //   const gasUsed = receipt.gasUsed.toNumber();
  //   console.log({ gasUsed });

  //   const transferEvent = receipt.events.find((i) => i.event === 'Transfer');

  //   expect(transferEvent.args['tokenId'].toNumber()).to.equal(2);

  //   const totalSupply = await myContract.totalSupply();
  //   // const tokenURI1 = await myContract.tokenURI(2);
  //   // const tokenURI2 = await myContract.tokenURI(2);
  //   const tokenURI3 = await myContract.tokenURI(4);
  //   const json = Buffer.from(tokenURI3.substring(29), 'base64').toString();
  //   const parsed = JSON.parse(json);
  //   console.log(json);
  //   expect(parsed).to.haveOwnProperty('image');
  //   expect(parsed.image).to.include('data:image/svg+xml;base64');
  //   expect(totalSupply).to.eq(4);
  // });

  // it('Should call mintFive correctly', async function () {
  //   const price = await myContract.mintFivePrice();
  //   // console.log(price.toNumber())
  //   const result = await myContract.mintMany(5, {
  //     value: "100000000000000000"
  //   });

  //   expect(result).to.emit(myContract, 'Transfer');

  //   const receipt = await result.wait();

  //   const gasUsed = receipt.gasUsed.toNumber();
  //   console.log({ gasUsed });

  //   const transferEvent = receipt.events.find((i) => i.event === 'Transfer');

  //   expect(transferEvent.args['tokenId'].toNumber()).to.equal(5);

  //   const totalSupply = await myContract.totalSupply();
  //   // const tokenURI1 = await myContract.tokenURI(2);
  //   // const tokenURI2 = await myContract.tokenURI(2);
  //   const tokenURI13 = await myContract.tokenURI(9);
  //   const json = Buffer.from(tokenURI13.substring(29), 'base64').toString();
  //   const parsed = JSON.parse(json);
  //   console.log(json);
  //   expect(parsed).to.haveOwnProperty('image');
  //   expect(parsed.image).to.include('data:image/svg+xml;base64');
  //   expect(totalSupply).to.eq(9);
  // });
});
