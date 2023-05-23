import { MetaMaskInpageProvider } from '@metamask/providers';

declare module '*.less';

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}
