import { ethers, Wallet } from 'ethers';
import { BrowserChain } from './index';
import WalletConnect from '@walletconnect/client';
import QRCodeModal from '@walletconnect/qrcode-modal';
import { CHAIN_RPC, CHAIN_NAME, CHAIN_BROWSER, CHAIN_SYMBOL } from './constants';

export class LocalWallet {
  public static fromPrivateKey(key: string) {
    return new Wallet(key);
  }
}

export class ChainWallet extends BrowserChain {
  private tryCount = 0;
  ethereum: any = null;
  chainInstalled = false;
  private chainStatusHandles: any[] = [];
  private chainHandles: any[] = [];
  private accountsHandles: any[] = [];
  connector: any = null;
  accounts = [];
  account = '';
  private chainIdWhiteList: number[] = [];

  constructor() {
    super();
  }

  setSession(key: string, val: any) {
    if (val !== undefined && typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(key, val);
    }
  }

  getSession(key: string) {
    if (typeof sessionStorage !== 'undefined') return sessionStorage.getItem(key);
    return '';
  }

  isConnected() {
    console.log('isConnected');
    if (this.connector && this.connector.connected) {
      return true;
    }
    if (!this.chainInstalled) {
      return false;
    }
    return this.accounts.length > 0;
  }

  onChainStatus(_handleChainStatus: any) {
    this.chainStatusHandles.push(_handleChainStatus);
  }

  onAccountsChanged(_handleNewAccounts: any) {
    console.log('ChainWallet onAccountsChanged:', this.accountsHandles);
    this.accountsHandles.push(_handleNewAccounts);
  }

  onChainChanged(handleChain: any) {
    this.chainHandles.push(handleChain);
  }

  connect(to: any = '', chainIdWhiteList: number[] = []) {
    console.log('ChainWallet ...');
    this.chainIdWhiteList = chainIdWhiteList;
    if (!to) {
      to = this.getSession('chainClient');
      if (!to) {
        to = 'm';
      }
    }
    if (this.isConnected()) {
      console.log('ChainWallet isConnected');
      return Promise.resolve(this.accounts);
    }
    console.log('ChainWallet connect to:', to);
    this.setSession('chainClient', to);
    this.tryCount = 0;
    if (to === 'm') {
      this.connectMetamask();
      if (!this.chainInstalled) {
        console.log('ChainWallet No Provider!');
        return Promise.reject('ChainWallet No Provider!');
      }
    } else if (to === 'b') {
      this.connectBinance();
      if (!this.chainInstalled) {
        console.log('ChainWallet No Provider!');
        return Promise.reject('ChainWallet No Provider!');
      }
    } else if (to === 'tp') {
      this.connectTokenPocket();
      if (!this.chainInstalled) {
        console.log('ChainWallet No Provider!');
        return Promise.reject('ChainWallet No Provider!');
      }
    } else if (to === 'w') {
      return Promise.resolve(this.connectWalletConnect());
    } else if (to === 'o') {
      this.connectOnto();
      if (!this.chainInstalled) {
        console.log('ChainWallet No Provider!');
        return Promise.reject('ChainWallet No Provider!');
      }
    } else if (to === 'okx') {
      this.connectOKX();
      if (!this.chainInstalled) {
        console.log('ChainWallet No Provider!');
        return Promise.reject('ChainWallet No Provider!');
      }
    }

    if (this.chainInstalled) {
      console.log('connect...');
      return this.ethereum
        .request({
          method: 'eth_requestAccounts',
        })
        .then((newAccounts: any) => {
          console.log('connect accounts', newAccounts);
          this._handleNewAccounts(newAccounts);
          return newAccounts;
        });
    }
  }

  async disconnect() {
    try {
      if (this.connector && this.connector.connected) {
        this.connector.killSession();
      }
      if (this.ethereum) {
        await this.ethereum.request({
          method: 'wallet_revokePermissions',
          params: [
            {
              eth_accounts: {},
            },
          ],
        });
      }

      this.chainInstalled = false;
      this._handleNewAccounts([]);
      return true;
    } catch (e) {
      return e;
    }
  }

  connectWalletConnect() {
    const bridge = 'https://bridge.walletconnect.org';
    this.connector = new WalletConnect({ bridge, qrcodeModal: QRCodeModal });
    // check if already connected
    let newAccounts = [];
    if (!this.connector.connected) {
      console.log('walletConnectInit connect...', this);
      // create new session
      this.connector.createSession();
      // Subscribe to connection events
      this.connector.on('connect', (error: any, payload: any) => {
        console.log(`on connect`);
        // console.log(JSON.stringify(payload));
        const { accounts, chainId } = payload.params[0];
        newAccounts = accounts;
        this._handleNewChain(chainId);
        this._handleChainStatus(true);
        this._handleNewAccounts(accounts);
      });
      // this._handleNewAccounts(newAccounts)
      this.connector.on('session_update', (error: any, payload: any) => {
        const { accounts, chainId } = payload.params[0];
        console.log('walletConnectInit session_update:', accounts);
        this._handleNewChain(chainId);
        this._handleNewAccounts(accounts);
      });
      this.connector.on('disconnect', (error: any, payload: any) => {
        console.log('walletConnectInit disconnect');
        this._handleNewAccounts([]);
      });
    } else {
      newAccounts = this.connector.accounts;
      console.log('walletConnectInit connected:', newAccounts);
      this._handleChainStatus(true);
      this._handleNewAccounts(newAccounts);
    }

    console.log('walletConnectInit account:', newAccounts);
    return newAccounts;
  }

  connectMetamask() {
    if (typeof window === 'undefined') return;
    if (!(window as any).ethereum) {
      console.log('not found Metamask');
      if (this.tryCount < 1) {
        setTimeout(() => {
          console.log('try to connect Metamask');
          this.connectMetamask();
          this.tryCount++;
        }, 2000);
      } else {
        console.log('not found Metamask, timeout');
        this._handleChainStatus(false);
      }
    } else {
      this._chainConnected();
    }
  }

  connectTokenPocket() {
    if (typeof window === 'undefined') return;
    if (!(window as any).tokenpocket) {
      console.log('not found TokenPocket');
      if (this.tryCount < 1) {
        setTimeout(() => {
          console.log('try to connect TokenPocket');
          this.connectTokenPocket();
          this.tryCount++;
        }, 2000);
      } else {
        console.log('not found TokenPocket, timeout');
        this._handleChainStatus(false);
      }
    } else {
      this._chainConnected((window as any).tokenpocket.ethereum);
    }
  }

  connectOKX() {
    if (typeof window === 'undefined') return;
    if (!(window as any).okexchain) {
      console.log('not found OKX');
      if (this.tryCount < 1) {
        setTimeout(() => {
          this.connectOKX();
          this.tryCount++;
        }, 2000);
      } else {
        console.log('not found OKX, timeout');
        this._handleChainStatus(false);
      }
    } else {
      this.ethereum = (window as any).okexchain;
      this._chainConnected();
    }
  }

  connectBinance() {
    if (typeof window === 'undefined') return;
    if (!(window as any).BinanceChain) {
      console.log('not found Binance');
      if (this.tryCount < 1) {
        setTimeout(() => {
          this.connectBinance();
          this.tryCount++;
        }, 2000);
      } else {
        console.log('not found Binance, timeout');
        this._handleChainStatus(false);
      }
    } else {
      this._chainConnected((window as any).BinanceChain);
    }
  }

  connectOnto() {
    if (typeof window === 'undefined') return;
    if (!(window as any).onto) {
      console.log('not found onto');
      if (this.tryCount < 1) {
        setTimeout(() => {
          this.connectOnto();
          this.tryCount++;
        }, 2000);
      } else {
        console.log('not found onto, timeout');
        this._handleChainStatus(false);
      }
    } else {
      this._chainConnected();
    }
  }

  addToken(address: any, symbol: string, decimals: number) {
    const provider: any = this.ethereum;
    return new Promise((resolve, reject) => {
      provider
        .request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address,
              symbol,
              decimals,
              image: '',
            },
          },
        })
        .then((success: any) => {
          if (success) {
            resolve(address);
            console.log('successfully added to wallet!');
          } else {
            reject();
            throw new Error('Something went wrong.');
          }
        })
        .catch(() => {
          reject();
        });
    });
  }

  async switchNetwork(chainId: number) {
    const provider = this.ethereum;
    if (chainId && provider) {
      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${chainId.toString(16)}` }],
        });
        return true;
      } catch (switchError) {
        if ((switchError as any)?.code === 4902) {
          try {
            const nodes = [CHAIN_RPC[chainId]];
            await provider.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: `0x${chainId.toString(16)}`,
                  chainName: CHAIN_NAME[chainId],
                  nativeCurrency: {
                    name: CHAIN_SYMBOL.ZeroToken[chainId],
                    symbol: CHAIN_SYMBOL.ZeroToken[chainId].toLowerCase(),
                    decimals: 18,
                  },
                  rpcUrls: nodes,
                  blockExplorerUrls: [CHAIN_BROWSER[chainId]],
                },
              ],
            });
            return true;
          } catch (error) {
            console.error('Failed to setup the network', error);
            return false;
          }
        }
        return false;
      }
    }
    return false;
  }

  _chainConnected(ethereum?: any) {
    if (typeof window === 'undefined') return;
    console.log('chain connected userAgent:', navigator.userAgent);
    this.chainInstalled = true;
    if (ethereum) {
      this.ethereum = ethereum;
    } else {
      this.ethereum = (window as any).ethereum;
    }
    // window.ethereum.autoRefreshOnNetworkChange = false
    if (navigator.userAgent.indexOf('Mobile') == -1) {
      console.log('chain connected on event');
      this.ethereum.on('chainChanged', this._handleNewChain.bind(this));
      this.ethereum.on('accountsChanged', this._handleNewAccounts.bind(this));
    }

    this._handleChainStatus(true);
    console.log('this.chainInstalled:', this.chainInstalled);

    console.log('chainClient:', this.getSession('chainClient'));
    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    this.setProvider(provider);
    // console.log('this.provider:', this.provider.getSigner(0));

    if (this.ethereum.chainId) {
      console.log('ethereum chainid', this.ethereum.chainId);
      this._handleNewChain(this.ethereum.chainId);
    } else {
      provider
        .getNetwork()
        .then((chainId: any) => {
          console.log('web chainid', chainId);
          this._handleNewChain(chainId);
        })
        .catch((e: any) => {
          console.log('web3 chainid except:', e);
        });
    }
  }

  _handleNewChain(chainId: any) {
    if (typeof chainId === 'object' && chainId?.chainId) {
      chainId = chainId.chainId;
    }
    if (!chainId) {
      console.log('disconnect before chain:', this.chainId);
      return;
    }

    let cid = Number(chainId);
    console.log('ChainWallet _handleNewChain:', this.chainId, cid);
    if (this.chainId !== cid) {
      this.clean();
    }
    this.chainId = cid;

    try {
      const provider = new ethers.providers.Web3Provider((window as any).ethereum);
      this.setProvider(provider);
    } catch (e) {
      console.error('no providers');
    }

    for (const [, cb] of this.chainHandles.entries()) {
      cb(chainId);
    }

    if (this.chainIdWhiteList.length && !this.chainIdWhiteList.includes(this.chainId)) {
      console.warn('no support chain id', this.chainId);
      return;
    }

    console.log('connectContract');
    this.connectContract();
  }

  _handleChainStatus(status: any) {
    console.log('ChainWallet _handleChainStatus:', status);
    for (const [, cb] of this.chainStatusHandles.entries()) {
      cb(status);
    }
  }

  _handleNewAccounts(newAccounts: any) {
    console.log('ChainWallet _handleNewAccounts:', newAccounts);
    this.accounts = newAccounts;
    if (newAccounts && newAccounts.length > 0) {
      this.account = newAccounts[0];
    } else {
      this.account = '';
    }
    for (const [, cb] of this.accountsHandles.entries()) {
      cb(newAccounts);
    }
  }
}

export const chainWallet = new ChainWallet();
