
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import LetterBoxingABI from "../../util/LetterBoxing.json";
import * as  constants from '../../util/constants.js';
import StampResources from '../../components/StampResources.js';
import { useRouter } from 'next/router';

export const injected = new InjectedConnector();

const DEPLOYED_CONTRACT_ADDRESS = constants.DEPLOYED_CONTRACT_ADDRESS;

const Stamp = () => {
  const router = useRouter();
  const id = router.query.id;
  const {
    active,
    account,
    library: provider,
  } = useWeb3React();
  const [state, setState] = useState({
    name: "",
    description: "",
    src: "",
    letterBoxList: []
  });

  useEffect(() => {
    if(active) {
      getStamp();
    }
  },[active]);

  const getStamp = async () => {
    const contract = new ethers.Contract(DEPLOYED_CONTRACT_ADDRESS, LetterBoxingABI["abi"], provider.getSigner());
    let userStamp = await contract.stampHeldBy(account); //returns tokenId
    userStamp = userStamp.toNumber();
    const userResources = await contract.getActiveResources(userStamp); //returns array of resources
    const returnedResource = await contract.getResource(userResources[0]);
    console.log("userResources: " + returnedResource);
    console.log("Type: " + typeof returnedResource);
    const userJSON = returnedResource.metadataURI;
    console.log("userJSON: " + userJSON);
    let stampMetaData;
    await fetch(userJSON)
        .then(response => response.json())
        .then(data => {
            console.log("Returned Data: " + data.name);
            stampMetaData = {
                name: data.name,
                description: data.description,
                src: data.media_uri_image
        }});
    console.log("StampMetaData:  " + stampMetaData.src);
    console.log("userResources:  " + userResources);
    console.log("Type: " + typeof userResources);
    let letterBoxMeta = [];
    let counter = 0;
    for(const userResource in userResources) {
      if(counter !== 0) {
        console.log("resource: " + userResources[userResource]);
        const returnedResource = await contract.getResource(userResources[userResource]);
        console.log("returnedResource: ", returnedResource);
        const resourceURI = returnedResource.metadataURI;
        await fetch(resourceURI)
            .then(response => response.json())
            .then(data => {
                    letterBoxMeta.push({
                      src: data.media_uri_image
                    });
            });
        counter++;
        continue;
        }
      counter++;
    }
    
    setState({
        ...state,
        name: stampMetaData.name,
        description: stampMetaData.description,
        src: stampMetaData.src,
        letterBoxList: letterBoxMeta
    });
  };

  return (
    <div>
        {console.log("State: " + state.name)}
        <div className="flex mb-4 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="w-full px-5">
            <h1>Stamp</h1>
            <img src={state.src} alt="Image cap" top width="100%"></img>
            <div>&nbsp;</div>
            <h2>Letterboxes</h2>
            <StampResources letterbox={state}/>
          </div>
          <div className="w-full px-5">
            <h1>{<b>Name: </b>} {state.name} {" #"}{id}</h1>
            <div>&nbsp;</div>
            {<b>Description: </b>} {state.description}
          </div>
        </div>
    </div>
  );
};
 
export default Stamp;