import Layout from '../components/Layout';
import WalletProvider from '../components/WalletProvider';
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Web3ReactProvider getLibrary={getLibrary}>
        <WalletProvider>
          <Component {...pageProps} />
        </WalletProvider>
      </Web3ReactProvider>
    </Layout>
  );
}

export default MyApp;

const getLibrary = (provider) => {
  return new Web3Provider(provider);
}
