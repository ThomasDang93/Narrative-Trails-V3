import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import styles from '../styles/MintPage.module.css';
import LetterBoxingABI from "../util/LetterBoxing.json";
import fleek from '@fleekhq/fleek-storage-js';  
import * as  constants from '../util/constants.js';
import UserStamp from '../components/UserStamp';
import Map from '../components/Map';
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
        const form = handleValidation();
        if(form.validation) {
            const confirmation = confirm("Are you sure you want to mint?");
            if(confirmation) {
                let metaDataResult = await ipfsUpload({
                    fleek: fleek,
                    file: file,
                    imagePath: constants.STAMP_IMAGE_PATH,
                    metadataPath: constants.STAMP_METADATA_PATH,
                    state: state
                });
                const contract = new ethers.Contract(DEPLOYED_CONTRACT_ADDRESS, LetterBoxingABI["abi"], provider.getSigner());
                contract.mintStamp(account, metaDataResult.publicUrl);
            }

        } else {
            let message = '';
            for(let key in form.message) {
                if(form.message.hasOwnProperty(key)) {
                    message += form.message[key] + '. \n';
                }
            }
            alert(message);
        }
    };

    function handleValidation() {
        let fields = state;
        let errors = {};
        let formIsValid = true;
    
        if (!fields["name"]) {
          formIsValid = false;
          errors["name"] = "Name cannot be empty";
        }

        if (!fields["description"]) {
            formIsValid = false;
            errors["description"] = "Description cannot be empty";
        }
        if (!file["type"]) {
            formIsValid = false;
            errors["type"] = "File Upload cannot be empty";
        }
        setState({ 
            ...state, 
            errors: errors 
        });
        return {
            validation: formIsValid, 
            message: errors
        }
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
            <form className="w-full max-w-lg" onSubmit={handleSubmit}>
                <h1 className={styles.center}>Make Stamp</h1>
                <div>&nbsp;</div>
                <div className={styles.center}>
                    <div className="flex flex-wrap -mx-3 mb-6 ">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="name">
                                Name
                            </label>
                            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="name" name="name" type="text" placeholder="Letterbox Name" onChange={handleChange}/>
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="upload">
                            Upload
                            </label>
                            <input className="appearance-none text-gray-700 py-3 px-4 " id="upload" name="upload"type="file" onChange={handleFileChange}/>
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="description">
                            A brief public bio or other text you&apos;d want to appear with your stamp
                            </label>
                            <textarea className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" rows="4" id="description" name="description" type="textarea" placeholder="Enter instructions here" onChange={handleChange}/>
                        </div>
                    </div>
                    {
                        active ?
                            <div className="flex flex-wrap -mx-3 mb-2">
                                <button type="submit"className={styles.submitbtn}>Mint</button>
                                <h1 className={styles.center}>Your Current Stamp</h1>
                                <UserStamp stamp={state}/>
                            </div>
                            : <p className={styles.center}>Connect Wallet</p>
                    }
                </div>
            </form> 
        </div>
    );
}
export default MintStamp;