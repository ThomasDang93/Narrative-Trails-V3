import React, { useEffect, useState } from 'react';
import { injected } from '../util/connectors.js';
import { useWeb3React } from '@web3-react/core';

const WalletProvider = ({ children }) => {
  const { active: networkActive, error: networkError, activate: activateNetwork } = useWeb3React();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    injected
      .isAuthorized()
      .then((isAuthorized) => {
        setLoaded(true)
        if (isAuthorized && !networkActive && !networkError) {
          activateNetwork(injected)
        }
      })
      .catch(() => {
        setLoaded(true)
      })
  }, [activateNetwork, networkActive, networkError]);

  if (loaded) {
    return children;
  }
  return <>Loading</>;
};

export default WalletProvider;