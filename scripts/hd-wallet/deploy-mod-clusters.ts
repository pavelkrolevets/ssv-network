import { ethers } from 'hardhat';
const { LedgerSigner } = require("@ethersproject/hardware-wallets");

async function deploy() {
  const provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_ETH_NODE_URL);
  const signer = new LedgerSigner(provider);
  console.log(`Deploying contracts with the account:${await signer.getAddress()}`);

  // Initialize contract
  const ssvClustersModFactory = await ethers.getContractFactory('SSVClusters', signer);

  // Deploy ssvClustersMod
  const ssvClustersMod = await ssvClustersModFactory.deploy({
    gasPrice: 300000000000,
    gas: 5000000
  });
  await ssvClustersMod.deployed();
  console.log(`SSVClusters module deployed to: ${ssvClustersMod.address}`);
}

deploy()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
