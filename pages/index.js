import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import logo from '../public/logo.png';

export default function Home() {
  const hStyle = { color: 'red' };
  return (
    <div className={styles.container}>
      <Head>
        <title>Narrative Trails | Home</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/logo.png" />
      </Head>
        <h1 className={styles.title} style={hStyle}>This is a Demo environment. Not all features are representative of final product.</h1>
        <p className={styles.text} style={hStyle}>To access certain pages/features from this Dapp, you must install Metamask and connect to the Moonbase Alpha network. 
        The following are network details that you will input in Metamask in order to establish connection with Moonbase Alpha.</p>
        <div>&nbsp;</div>
        <li className={styles.text} style={hStyle}>RPC URL: https://rpc.api.moonbase.moonbeam.network</li>
        <li className={styles.text} style={hStyle}>Chain ID: 1287</li>
        <li className={styles.text} style={hStyle}>Currency Symbol: Dev</li>
        <li className={styles.text} style={hStyle}>Block Explorer URL: https://moonbase.moonscan.io/</li>
        <div>&nbsp;</div>
        <h1 className={styles.title}>Narrative Trails Letterboxing Dapp</h1>
        <p className={styles.text}>Experiment with us in real world and on-chain fun.</p>
        <h2 className={styles.title}>Letterboxing is simple</h2>
        <p className={styles.text}>People hide letterboxes (there are lots already out there) </p>
        <p className={styles.text}>Someone hides a letterbox: a stamp and a notebook in a box.</p>
        <p className={styles.text}>You use their clues to go find it! (complexity and difficulty varies)</p>
        <p className={styles.text}>Stamp swap! Use your stamp in the letterbox log, and stamp your notebook with the one you found!</p>
        <p className={styles.text}>(if you are new, read more to get the full details.. ) </p>
        <h2 className={styles.title}>Multi-resource NFTs bring the fun on-chain</h2>
        <a className={styles.btn} href="https://narrativetrails.xyz/" target="_blank" rel="noopener noreferrer">About</a>
    </div>
  );
};
