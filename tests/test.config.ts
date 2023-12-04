import fs from 'fs';
import path from 'path';

let TEST_CONFIG = {
  pklist: [],
  nftlist: [],
  erc1155list: [],
  erc20list: [],
};

const USER_HOME = process.env.HOME || process.env.USERPROFILE;

let filePath = path.join(USER_HOME + '/.opentaskai-web3-jssdk.conf.json');
if (fs.existsSync(filePath)) {
  TEST_CONFIG = require(filePath.toString());
}

export default TEST_CONFIG;
