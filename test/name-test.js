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
  let namesContract;

  this.beforeAll(async () => {
    // deploy seeder
    const FootySeeder = await ethers.getContractFactory('FootySeeder');
    const seeder = await FootySeeder.deploy();
    console.log('FootySeeder deployed to:', seeder.address);

    // deploy descriptor
    const FootyDescriptor = await ethers.getContractFactory('FootyDescriptor');
    const descriptor = await FootyDescriptor.deploy();
    console.log('FootyDescriptor deployed to:', descriptor.address);

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
    namesContract = await FootyNames.deploy(myContract.address);
  });

  it('Should call mint correctly', async function () {
    const price = await myContract.mintOnePrice();

    const result = await myContract.mint({
      value: price,
    });

    myContract.mint({
      value: price,
    });

    myContract.mint({
      value: price,
    });

    expect(result).to.emit(myContract, 'Transfer');

    const receipt = await result.wait();

    const gasUsed = receipt.gasUsed.toNumber();
    console.log({ gasUsed });

    const transferEvent = receipt.events.find((i) => i.event === 'Transfer');

    expect(transferEvent.args['tokenId'].toNumber()).to.equal(1);

    const tokenURI = await myContract.tokenURI(1);
    // const json = Buffer.from(tokenURI.substring(29), 'base64').toString();
    // const parsed = JSON.parse(json);
    console.log({ tokenURI });
    // expect(parsed).to.haveOwnProperty('image');
    // expect(parsed.image).to.include('data:image/svg+xml;base64');
  });

  it('can rename a footy', async function () {
    const newClubName = 'mboopis goopies';
    const renameTx = await namesContract.nameClubAndFooties(
      'mboopis goopies',
      [1, 2, 3],
      ['mboopi', 'troopi', 'poopi'],
    );

    const footyOneName = await namesContract.getFootyName(1);
    const footyTwoName = await namesContract.getFootyName(2);
    const footyThreeName = await namesContract.getFootyName(3);
    const clubName = await namesContract.getClubName(
      '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
    );

    expect(footyOneName).to.equal('mboopi');
    expect(footyTwoName).to.equal('troopi');
    expect(footyThreeName).to.equal('poopi');
    expect(clubName).to.equal(newClubName);
  });
});
