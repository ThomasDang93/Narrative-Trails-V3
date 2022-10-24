import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import styles from '../styles/Global.module.css';
import LetterBoxingABI from "../util/LetterBoxing.json";
import fleek from '@fleekhq/fleek-storage-js';  
import * as  constants from '../util/constants.js';
import UserStamp from '../components/UserStamp';
import { ipfsMetaDataUpload, getUserStamp } from '../util/nft_operations.js';

const DEPLOYED_CONTRACT_ADDRESS = constants.DEPLOYED_CONTRACT_ADDRESS;

export const injected = new InjectedConnector();

const MintStamp = () => {
    const {
        active,
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
        imageUrl: "",
        errors: "",
        stampList: []
    });
    const [file, setFile] = useState({});

    useEffect(() => {
        if(active) {
            getStamp();
        }
    },[active]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = handleValidation();
        if(form.validation) {
            const confirmation = confirm("Are you sure you want to mint?");
            if(confirmation) {
                const imageUrl = await ipfsImageUpload({
                    fleek: fleek,
                    file: file,
                    imagePath: constants.STAMP_IMAGE_PATH
                });
                const metaDataResult = await ipfsMetaDataUpload({
                    fleek: fleek,
                    imageUrl: imageUrl.publicUrl,
                    metadataPath: constants.STAMP_METADATA_PATH,
                    state: state
                });
                const contract = new ethers.Contract(DEPLOYED_CONTRACT_ADDRESS, LetterBoxingABI["abi"], provider.getSigner());
                const tx = contract.mintStamp(account, metaDataResult.publicUrl);
                const receipt = await tx.wait();
                const event = receipt.events.find(x => x.event === "StampCreated");
                if(event.args.tokenId) {
                    router.push({
                        pathname: `/stamp/${event.args.tokenId}`
                    });
                }
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

    const handleValidation = () => {
        const fields = state;
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

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleChange = (event) => {
        let change = {
            ...state
        };
        change[event.target.name] = event.target.value;
        setState(change);
    };

    const getStamp = async () => {
        const contract = new ethers.Contract(DEPLOYED_CONTRACT_ADDRESS, LetterBoxingABI["abi"], provider.getSigner());
        const stampList = await getUserStamp({
            account: account,
            contract: contract
        });
        setState({
            ...state,
            stampList: stampList
        });
    };

    return (
        <div className="min-h-[calc(100vh_-_80px_-_40px)]">
            <div className='flex flex-col h-screen justify-center items-center'>
                <form className="w-full max-w-lg -mt-20 bg-white shadow-lg rounded-xl" onSubmit={handleSubmit}>
                    <h1 className="text-4xl mt-14 text-center">Mint NFT Stamp</h1>
                    <div>&nbsp;</div>
                    <div className="p-10 ">
                        <div className="flex flex-wrap -mx-3 mb-6 ">
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="name">
                                    Name
                                </label>
                                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="name" name="name" type="text" placeholder="Stamp Name" onChange={handleChange}/>
                            </div>
                            <div className="w-full md:w-1/2 px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="upload">
                                Upload
                                </label>
                                <input className="appearance-none text-gray-700 py-3 px-4                            
                                " id="upload" name="upload"type="file" onChange={handleFileChange}/>
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
                        <div className="flex justify-center items-center">
                        {
                            active ?
                            <div>
                                <button type="submit" className="bg-green-500 text-center hover:bg-[#355176] text-white font-bold py-2 px-4 rounded">Mint</button>
                                <h1 className={styles.center}>Your Current Stamp</h1>
                                <UserStamp stamp={state}/>
                            </div>
                            : <p className="bg-green-500 text-center hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Connect Wallet</p>
                        }
                        </div>
                    </div>
                </form> 
            </div>
        </div>
    );
};

export default MintStamp;