import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect} from 'react';
import { useRouter } from 'next/router';
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import styles from '../styles/Global.module.css';
export const injected = new InjectedConnector();
  const Navbar = () => {
    const [hasMetamask, setHasMetamask] = useState(false);
    const [navbar, setNavbar] = useState(false);
    const { active, activate } = useWeb3React();
    const router = useRouter();

    useEffect(() => {
      if (typeof window.ethereum !== "undefined") {
        setHasMetamask(true);
      }
    }, []);

    useEffect(() => {
      if (navbar) {
        setNavbar(!navbar);
      }
    }, [router.asPath]);

    const connect = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          await activate(injected);
          setHasMetamask(true);
        } catch (e) {
          console.log(e);
        }
      }
    };
    
    return (
      <>
      <nav className={`bg-[#f2f2f2] w-screen sticky top-0 z-10 backdrop-filter backdrop-blur-lg bg-opacity-30 border-b border-gray-200 ${navbar === false ? 'displayflex' : ""}`}>
        <div className="flex w-screen bg-none justify-between items-center">
          <div className="ml-8">
            <Link href='/'>
              <a><Image src="/NT_logo271x40px.png" width={271} height={40}/></a>
            </Link>
          </div>

          <button className="px-4 cursor-pointer md:hidden" id="burger" onClick={() => setNavbar(!navbar)}>
            <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button> 
        </div>
        <div className={`px-2 pt-2 pb-4 justify-evenly items-center text-xs lg:text-sm h-full w-7/12 lg:w-6/12 gap-2 md:flex ${navbar === false ? "hidden" : "block"}  `} id='menu'>
          <Link href='/MintLetterBox'><a className="mt-1 block px-2 py-1 text-black">Plant Letter Box</a></Link>
          <Link href='/MintStamp'><a className="mt-1 block px-2 py-1 text-black">Make Stamp</a></Link>
          <Link href='/FindLetterbox'><a className="mt-1 block px-2 py-1 text-black"  >Find Letterbox</a></Link>
          <Link href='/UsersCollection'><a className="mt-1 block px-2 py-1 text-black" >My Collection</a></Link>
          {hasMetamask ? (
              active ? (
                  <button className={`${styles.connectbtn}`} >Connected</button>
              ) : (
                  <button className={styles.connectbtn} onClick={() => connect()}>Connect</button>
              )
          ) : (
              <div className={styles.connectbtn}>Install Wallet</div>
          )}
        </div>
      </nav>
      </>
    );
  };
  
  export default Navbar;