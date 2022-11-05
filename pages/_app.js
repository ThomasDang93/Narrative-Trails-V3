import Layout from '../components/Layout';
import WalletProvider from '../components/WalletProvider';
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import '../styles/globals.css';

const MyApp = ({ Component, pageProps }) => {
  return (
      <Web3ReactProvider getLibrary={getLibrary}>
        <WalletProvider>
          <Layout>
            <Component {...pageProps} />
            <div id="modal-root"></div>
          </Layout>
        </WalletProvider>
      </Web3ReactProvider>
  );
};

export default MyApp;

const getLibrary = (provider) => {
  return new Web3Provider(provider);
};
