const { palette } = require('../parts/palette');
const { backgrounds } = require('../parts/backgrounds');
const { heads } = require('../parts/heads');
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
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
