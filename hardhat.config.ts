import 'dotenv/config';

import { HardhatUserConfig } from 'hardhat/config';
import { NetworkUserConfig } from "hardhat/types";
import '@nomicfoundation/hardhat-toolbox';
import '@openzeppelin/hardhat-upgrades';
import 'hardhat-tracer';
import '@nomiclabs/hardhat-solhint';
import 'hardhat-contract-sizer';
import 'hardhat-storage-layout-changes';
import './tasks/deploy';
import './tasks/update-module';
import './tasks/upgrade';

type SSVNetworkConfig = NetworkUserConfig & {
  ssvToken: string;
}


const config: HardhatUserConfig = {
  // Your type-safe config goes here
  mocha: {
    timeout: 40000000000000000
  },
  solidity: {
    compilers: [
      {
        version: '0.8.18',
        settings: {
          optimizer: {
            enabled: true,
            runs: 10000
          }
        }
      }
    ],
  },
  networks: {
    ganache: {
      chainId: 1337,
      url: "http://127.0.0.1:8585",
      ssvToken: process.env.SSVTOKEN_ADDRESS // if empty, deploy SSV mock token
    } as SSVNetworkConfig,
    hardhat: {
      allowUnlimitedContractSize: true
    }
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.ETHERSCAN_KEY
  },
  gasReporter: {
    enabled: true,
    currency: 'USD',
    gasPrice: 0.3
  }
};

if (process.env.GOERLI_ETH_NODE_URL) {
  const sharedConfig = {
    url: process.env.GOERLI_ETH_NODE_URL,
    accounts: [`0x${process.env.GOERLI_OWNER_PRIVATE_KEY}`],
    gasPrice: +(process.env.GAS_PRICE || ''),
    gas: +(process.env.GAS || ''),
  };
  //@ts-ignore
  config.networks = {
    ...config.networks,
    goerli_development: {
      ...sharedConfig,
      ssvToken: '0x6471F70b932390f527c6403773D082A0Db8e8A9F'
    } as SSVNetworkConfig,
    goerli_testnet: {
      ...sharedConfig,
      ssvToken: '0x3a9f01091C446bdE031E39ea8354647AFef091E7'
    } as SSVNetworkConfig,
  }
}

if (process.env.MAINNET_ETH_NODE_URL) {
  //@ts-ignore
  config.networks = {
    ...config.networks,
    mainnet: {
      url: process.env.MAINNET_ETH_NODE_URL,
      accounts: [`0x${process.env.MAINNET_OWNER_PRIVATE_KEY}`],
      gasPrice: +(process.env.GAS_PRICE || ''),
      gas: +(process.env.GAS || ''),
      ssvToken: '0x9D65fF81a3c488d585bBfb0Bfe3c7707c7917f54'
    } as SSVNetworkConfig
  }
}

if (process.env.LOCAL_ETH_NODE_URL) {
  //@ts-ignore
  config.networks = {
    ...config.networks,
    local: {
      chainId: 32382,
      url: process.env.LOCAL_ETH_NODE_URL,
      accounts: [`0x${process.env.LOCAL_OWNER_PRIVATE_KEY}`],
      gasPrice: +(process.env.GAS_PRICE || ''),
      gas: +(process.env.GAS || ''),
      ssvToken: ''
    } as SSVNetworkConfig
  }
}


export default config;
