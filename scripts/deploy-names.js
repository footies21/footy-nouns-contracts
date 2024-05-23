async function main() {
  const network = await ethers.provider.getNetwork();
  const networkName = network.name == 'unknown' ? 'localhost' : network.name;

  console.log(`Network: ${networkName} (chainId=${network.chainId})`);

  // deploy seeder
  const FootyNames = await ethers.getContractFactory('FootyNames');
  // localhost address
  // const namesContract = await FootyNames.deploy(
  //   '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
  // );

  // arb testnet address
  // const namesContract = await FootyNames.deploy(
  //   '0x79B1F18d447F6FBAA4E90c4762A762723f30fAac',
  // );

  // arb mainnet address
  const namesContract = await FootyNames.deploy(
    '0x4C96226495E28AE2772CD5134608Ba6efbF88169',
  );

  console.log('FootyNames deployed to:', namesContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
