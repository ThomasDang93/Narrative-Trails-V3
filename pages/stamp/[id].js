
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import styles from '../../styles/MintPage.module.css';
import LetterBoxingABI from "../../util/LetterBoxing.json";
import * as  constants from '../../util/constants.js';
import StampResources from '../../components/StampResources.js';

export const injected = new InjectedConnector();

const DEPLOYED_CONTRACT_ADDRESS = constants.DEPLOYED_CONTRACT_ADDRESS;

function Stamp ({id}) {
  const [hasMetamask, setHasMetamask] = useState(false);
  const {
    active,
    activate,
    account,
    library: provider,
  } = useWeb3React();
  const [state, setState] = useState(    {
        name: "",
        description: "",
        src: "",
        city: "",
        country: "",
        lattitude: "",
        longitude: "",
        state: "",
        zip: "",
        letterBoxList: []
  });

  useEffect(() => {
    if(active) {
      getStamp();
    }
    
  },[active]);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetamask(true);
    }
  });

  async function getStamp() {
    const contract = new ethers.Contract(DEPLOYED_CONTRACT_ADDRESS, LetterBoxingABI["abi"], provider.getSigner());
    let userStamp = await contract.stampHeldBy(account); //returns tokenId
    userStamp = userStamp.toNumber();
    let userResources = await contract.getFullResources(userStamp); //returns array of resources
    let userJSON = userResources[0].metadataURI;
    let stampMetaData;
    await fetch(userJSON)
        .then(response => response.json())
        .then(data => {
            stampMetaData = {
                name: data.name,
                description: data.description,
                src: data.media_uri_image,
                city: data.properties.city,
                country: data.properties.country,
                lattitude: data.properties.lattitude,
                longitude: data.properties.longitude,
                state: data.properties.state,
                zip: data.properties.zip

        }})

        let letterBoxMeta = [];
        for(let i = 1; i < userResources.length; i++) {
          let resourceURI = userResources[i].metadataURI;
          console.log("resource URI: ", resourceURI)
          await fetch(resourceURI)
              .then(response => response.json())
              .then(data => {
                      letterBoxMeta.push({
                        src: data.media_uri_image
                      });
                  })
        }
    setState({
        ...state,
        name: stampMetaData.name,
        description: stampMetaData.description,
        src: stampMetaData.src,
        city: stampMetaData.city,
        country: stampMetaData.country,
        lattitude: stampMetaData.lattitude,
        longitude: stampMetaData.longitude,
        state: stampMetaData.state,
        zip: stampMetaData.zip,
        letterBoxList: letterBoxMeta
    });
  };
  async function connect() {
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
    <div>
        {console.log("State: ", state)}
        {console.log('State Context: ', state)}
        {console.log('Account Context: ', account)}
        {console.log('Account Active: ', active)}
        {console.log('ID: ', id)}
        {hasMetamask ? (
            active ? (
                <div className={styles.topright}>Connected</div>
            ) : (
                <button className={styles.topright} onClick={() => connect()}>Connect</button>
            )
        ) : (
            <div className={styles.topright}>Please Install Metamask</div>
        )}
        <div className={styles.center}>
          {/* <Card>
              <CardImg top width="100%" src={ state.src} alt="Card image cap" />
              <CardBody>
                <CardTitle><h1>{state.name} {" #"}{id}</h1></CardTitle>
                <CardText>{<b>Description: </b>} {state.description}</CardText>
                <CardText>{<b>City: </b>} {state.city}</CardText>
                <CardText>{<b>State: </b>} {state.state}</CardText>
                <CardText>{<b>Country: </b>} {state.country}</CardText>
                <CardText>{<b>Zip: </b>} {state.zip}</CardText>
                <CardText>{<b>Lattitude: </b>} {state.lattitude}</CardText>
                <CardText>{<b>Longitude: </b>} {state.longitude}</CardText>
                <CardText>{<b>City: </b>} {state.city}</CardText>
              </CardBody>
            </Card>
             */}
            <img src={state.src} alt="Image cap" top width="100%"></img>
            <h1>{state.name} {" #"}{id}</h1>
            {<b>Description: </b>} {state.description}
            <div>&nbsp;</div>
            {<b>City: </b>} {state.city}
            <div>&nbsp;</div>
            {<b>State: </b>} {state.state}
            <div>&nbsp;</div>
            {<b>Country: </b>} {state.country}
            <div>&nbsp;</div>
            {<b>Zip: </b>} {state.zip}
            <div>&nbsp;</div>
            {<b>Lattitude: </b>} {state.lattitude}
            <div>&nbsp;</div>
            {<b>Longitude: </b>} {state.longitude}
            <div>&nbsp;</div>
            {<b>City: </b>} {state.city}
            <div>&nbsp;</div>
            <h2>Letterboxes</h2>
            <StampResources letterbox={state}/>
      </div>
    </div>
  );
}
 
export default Stamp;