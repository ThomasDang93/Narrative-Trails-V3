import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import styles from '../styles/MintPage.module.css';
import LetterBoxingABI from "../util/LetterBoxing.json";
import fleek from '@fleekhq/fleek-storage-js';  
import * as  constants from '../util/constants.js';
import UserStamp from '../components/UserStamp';
import { ipfsUpload, getUserStamp } from '../util/nft_operations.js';

const DEPLOYED_CONTRACT_ADDRESS = constants.DEPLOYED_CONTRACT_ADDRESS;

export const injected = new InjectedConnector();

function MintStamp() {
    const [hasMetamask, setHasMetamask] = useState(false);
    const {
        active,
        activate,
        account,
        library: provider,
      } = useWeb3React();
    const [state, setState] = useState(    {
        name: "",
        lattitude: "",
        longitude: "",
        description: "",
        city: "",
        state: "",
        country: "",
        zip: "",
        isStamp: true,
        selectedAddress: "",
        balance: "",
        errors: "",
        stampList: []
    });
    const [file, setFile] = useState({});

    const handleSubmit = async(event) => {
        event.preventDefault();
        if(handleValidation()) {
            let metaDataResult = await ipfsUpload({
                fleek: fleek,
                file: file,
                imagePath: constants.STAMP_IMAGE_PATH,
                metadataPath: constants.STAMP_METADATA_PATH,
                state: state
            });
            const contract = new ethers.Contract(DEPLOYED_CONTRACT_ADDRESS, LetterBoxingABI["abi"], provider.getSigner());
            contract.mintStamp(account, metaDataResult.publicUrl);

        } else {
            alert("Please enter value for mandatory fields");
        }
    };

    function handleValidation() {
        let fields = state;
        let errors = {};
        let formIsValid = true;
    
        if (!fields["name"]) {
          formIsValid = false;
          errors["name"] = "Cannot be empty";
        }

        if (!fields["description"]) {
            formIsValid = false;
            errors["description"] = "Cannot be empty";
        }
        if (!file["type"]) {
            formIsValid = false;
            errors["type"] = "Cannot be empty";
        }
        setState({ 
            ...state, 
            errors: errors 
        });
        return formIsValid;
    };

    function handleFileChange(event) {
        setFile(event.target.files[0]);
    };

    function handleChange(event) {
        let change = {
            ...state
        };
        change[event.target.name] = event.target.value;
        setState(change);
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

    async function getNFTs() {
        const contract = new ethers.Contract(DEPLOYED_CONTRACT_ADDRESS, LetterBoxingABI["abi"], provider.getSigner());
        let stampList = await getUserStamp({
            account: account,
            contract: contract
        });
        setState({
            ...state,
            stampList: stampList
        });
    };

    useEffect(() => {
        if (typeof window.ethereum !== "undefined") {
            setHasMetamask(true);
        }
    });

    useEffect(() => {
        if(active) {
            getNFTs();
        }
    },[active]);
    
    return (
        <div>
            {console.log('State Context: ', state)}
            {console.log('File Context: ', file)}
            {console.log('Account Context: ', account)}
            {console.log('Account Active: ', active)}
            
            {hasMetamask ? (
                active ? (
                <div className={styles.topright}>Connected</div>
                ) : (
                    <button className={styles.topright} onClick={() => connect()}>Connect</button>
                )
            ) : (
                <div className={styles.topright}>Please Install Metamask</div>
            )}
             {console.log('Stamp URL: ', state.stampList)}
            {active ? 
            <form onSubmit={handleSubmit}>
                <h1>Mint a Stamp</h1>
                <div>&nbsp;</div>
                <label htmlFor="letter-stamp-name">Name:
                    <input type="text" name="name" id="letter-stamp-name" onChange={handleChange}/>
                </label>
                <div>&nbsp;</div>
                <label htmlFor="letter-stamp-description">Description:
                    <textarea type="text" name="description" rows="4" cols="50" id="letter-stamp-description" onChange={handleChange}/>
                </label>
                <div>&nbsp;</div>
                <label htmlFor="letter-stamp-lattitude">Lattitude:
                    <input type="text" name="lattitude" id="letter-stamp-lattitude" onChange={handleChange}/>
                </label>
                <div>&nbsp;</div>
                <label htmlFor="letter-stamp-longitude">Longitude:
                    <input type="text" name="longitude" id="letter-stamp-longitude" onChange={handleChange}/>
                </label>
                <div>&nbsp;</div>
                <label htmlFor="letter-stamp-city">City:
                    <input type="text" name="city" id="letter-stamp-city"onChange={handleChange}/>
                </label>
                <div>&nbsp;</div>
                <label htmlFor="letter-stamp-state">State:
                    <input type="text" name="state" id="letter-stamp-state"onChange={handleChange}/>
                </label>
                <div>&nbsp;</div>
                <label htmlFor="letter-stamp-country">Country: 
                    <input type="text" name="country" id="letter-stamp-country"onChange={handleChange}/>
                </label>
                <div>&nbsp;</div>
                <label htmlFor="letter-stamp-zip">Zip Code:
                    <input type="text" name="zip" id="letter-stamp-zip"onChange={handleChange}/>
                </label>
                <div>&nbsp;</div>
                <label htmlFor="letter-stamp-upload">Upload: 
                    <input type="file" id="letter-stamp-upload"onChange={handleFileChange}/>
                </label>
                <div>&nbsp;</div>
                <button type="submit"className={styles.submitbtn}>Mint</button>
                <div>&nbsp;</div>
                {<div>
                    <h2>Your Current Stamp</h2>
                    <UserStamp stamp={state}/>
                </div>}
            </form> : <h1 className={styles.center}>Connect Wallet</h1>}
        </div>
    );
}
export default MintStamp;