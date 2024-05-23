const { palette } = require('../parts/palette');
const { backgrounds } = require('../parts/backgrounds');
const { heads } = require('../parts/heads');
const { kits } = require('../parts/kits');
const { glasses } = require('../parts/glasses');
const { ethers } = require('hardhat');

async function main() {
  // deploy descriptor
  // const FootyDescriptor = await ethers.getContractFactory('FootyDescriptor');
  // const descriptor = await FootyDescriptor.deploy();
  // console.log('FootyDescriptor deployed to:', descriptor.address);

  // const contract = await FootyNouns.deploy({gasLimit: 8000000000000})

  // deploy main contract with descriptor address as argument
  // const FootyNouns = await ethers.getContractFactory('FootyNouns');
  // const main = await FootyNouns.deploy(descriptor.address);
  // console.log('FootyNouns deployed to:', main.address);

  // update descriptor on main contract
  const contract = await ethers.getContractAt(
    'FootyNouns',
    '0xCaB2c5E4136423E834BA222E166d89980e35aA7c',
  );
  const updateTx = await contract.setDescriptor(
    '0x0a4eFA4eB3354Ce07bF707A77eb56B119D126b43',
  );
  const result = await updateTx.wait();
  console.log(
    `Updated descriptor using ${result.gasUsed.toNumber()} units of gas`,
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
