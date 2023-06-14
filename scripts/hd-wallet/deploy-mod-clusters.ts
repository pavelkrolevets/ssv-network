import { ethers } from 'hardhat';
const { LedgerSigner } = require("@ethersproject/hardware-wallets");

import ssvModules from '../modules/ssvModules';

async function deploy() {
  const proxyAddress = process.env.SSVNETWORK_PROXY_ADDRESS;
  if (!proxyAddress) throw new Error("SSVNETWORK_PROXY_ADDRESS not set.");

  const provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_ETH_NODE_URL);
  const signer = new LedgerSigner(provider);
  console.log(`Deploying contracts with the account:${await signer.getAddress()}`);

  // Initialize contract
  const ssvNetworkFactory = await ethers.getContractFactory('SSVNetwork', signer);
  const ssvClustersModFactory = await ethers.getContractFactory('SSVClusters', signer);

  // Deploy ssvClustersMod
  const ssvClustersMod = await ssvClustersModFactory.deploy();
  await ssvClustersMod.deployed();
  console.log(`SSVClusters module deployed to: ${ssvClustersMod.address}`);
}

deploy()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
