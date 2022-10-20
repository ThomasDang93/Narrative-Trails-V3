import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import styles from '../../styles/Global.module.css';
import LetterBoxingABI from "../../util/LetterBoxing.json";
import StampList from "../../components/StampList";
import * as  constants from '../../util/constants.js';
import Map from '../../components/Map';
const DEPLOYED_CONTRACT_ADDRESS = constants.DEPLOYED_CONTRACT_ADDRESS;
const ethersProvider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_ETHERS_PROVIDER);
const contract = new ethers.Contract(DEPLOYED_CONTRACT_ADDRESS, LetterBoxingABI["abi"], ethersProvider);
export const injected = new InjectedConnector();
export const getStaticPaths = async () => {
  let allLetterboxes = await contract.letterboxList(); 
  console.log('allLetterboxes: ' + allLetterboxes);
  let paths = [];
  for (let i = 0; i < allLetterboxes.length; i++) {
      paths.push({
          params: {
              id: allLetterboxes[i].toString()
          }
      });
  }
  return {
    paths,
    fallback: false
  };
};

export const getStaticProps = async (context) => {
  console.log("Letterbox ID: " + context.params.id);
  const resources = await contract.getActiveResources(parseInt(context.params.id)); 
  console.log("Number of Resources: " + resources.length)
  const{ metadataURI } = await contract.getResource(resources[0]);
  let stampList = [];
  let counter = 0;
  for(const resource in resources) {
    if(counter !== 0) {
      console.log("resource: " + resources[resource]);
      const returnedResource = await contract.getResource(resources[resource]);
      console.log("returnedResource: ", returnedResource);
      const resourceURI = returnedResource.metadataURI;
      console.log("resourceURI: ", resourceURI);
      await fetch(resourceURI)
          .then(response => response.json())
          .then(data => {
                  stampList.push({
                    src: data.media_uri_image
                  });
          });
      counter++;
      continue;
    }
    counter++;
  }
  const res = await fetch(metadataURI); //
  let data = await res.json();
  data.stampList = stampList;

  return {
    props: { box: data },
    revalidate: 10
  };
};

const Letterbox = ({ box }) => {
  const router = useRouter();
  console.log({router});
  const id = router.query.id;
  const {
    active,
    account,
    library: provider,
  } = useWeb3React();

  const foundLetterbox = async () => {
    if (active) {
      console.log("Signer: ", provider.getSigner());
      const signer = provider.getSigner();
      const contractAddress = DEPLOYED_CONTRACT_ADDRESS;
      const contract = new ethers.Contract(contractAddress, LetterBoxingABI["abi"], signer);
      try{
        let letterboxResources = await contract.getActiveResources(id);
        console.log('letterbox resource count: ', letterboxResources.length);
        await contract.stampToLetterbox(account, id, true);
        await contract.letterboxToStamp(account, id, {gasLimit:500000});
        letterboxResources = await contract.getActiveResources(id);

      } catch(error) {
        console.log(error);
      }
        
    } else {
      console.log("Please install MetaMask");
    }
  };

  return (
    <div>
      <div className="flex mb-4 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="w-full px-5">
          <img src={box.media_uri_image} alt="Image cap" top width="100%"></img>
          <div>&nbsp;</div>
          {active ? <button className={styles.submitbtn} onClick={() => foundLetterbox()}>I found it!</button> : ""}
          <div>&nbsp;</div>
          <h2>Resources</h2>
          <StampList box={box}/>
        </div>
        <div className="w-full px-5">
          <h1>{<b>Name: </b>} {box.name} {" #"}{id}</h1>
          <div>&nbsp;</div>
          {<b>Description: </b>} {box.description}
          <div>&nbsp;</div>
          {<b>City: </b>} {box.properties.city}
          <div>&nbsp;</div>
          {<b>State: </b>} {box.properties.state}
          <div>&nbsp;</div>
          {<b>Country: </b>} {box.properties.country}
          <div>&nbsp;</div>
          {<b>Zip: </b>} {box.properties.zip}
          <div>&nbsp;</div>
          {<b>Lattitude: </b>} {box.properties.lattitude}
          <div>&nbsp;</div>
          {<b>Longitude: </b>} {box.properties.longitude}
          <div>&nbsp;</div>
          {<b>City: </b>} {box.properties.city}
          <div>&nbsp;</div>
          <Map query={box}/>
        </div>
      </div>
    </div>
  );
};
 
export default Letterbox;