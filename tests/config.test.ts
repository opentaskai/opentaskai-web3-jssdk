import { API_KEY, API_GATEWAY } from '../src/constants';
import TEST_CONFIG from './test.config';

describe('ethers', () => {
  beforeAll(async () => {
    console.log('before');
    console.log(TEST_CONFIG);
  });

  it('api key', async () => {
    const res = API_KEY(5, 'APPID');
    console.log('res:', res);

    const USER_HOME = process.env.HOME || process.env.USERPROFILE;
    console.log('USER_HOME:', USER_HOME);

    const gateway = API_GATEWAY('x2y2') ?? 'gateway';
    console.log('gateway:', gateway);
  });
});
