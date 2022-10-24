import React, { useState } from 'react';
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import styles from '../styles/Global.module.css';
import fleek from '@fleekhq/fleek-storage-js';  
import * as  constants from '../util/constants.js';
import { ipfsImageUpload } from '../util/nft_operations.js';
import { useRouter } from "next/router";
const keccak256 = require('keccak256');
export const injected = new InjectedConnector();

const MintLetterBox = () => {
    const {active, account } = useWeb3React();
    const [state, setState] = useState({
        name: "",
        dateTimeStamp: ""
    });
    const router = useRouter();
    const [file, setFile] = useState({});
    const handleQRCodeGenerator = async (event) => {
        event.preventDefault();
        const form = handleValidation();
        if(form.validation) {
            const confirmation = confirm("You are about to generate a QR code for a pending letterbox. Are you sure you want to proceed?");
            if(confirmation) {
                const imageUrl = await ipfsImageUpload({
                    fleek: fleek,
                    file: file,
                    imagePath: constants.LETTERBOX_IMAGE_PATH
                });
                const urlHash = keccak256(state.name + Date.now());
                const urlHashString = urlHash.toString('hex');
                const response = await fetch('/api/create_pending_letterbox', {
                    method: 'POST',
                    body: JSON.stringify({
                        letterbox_name: state.name,
                        wallet_address: account,
                        image_uri: imageUrl.publicUrl,
                        url_hash: urlHashString
                    })
                });

                if(!response.ok) {
                    throw new Error(response.statusText);
                } else {
                    router.push({
                        pathname: `pendingletterbox/${urlHashString}`
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
    }

    const handleValidation = () => {
        let errors = {};
        let formIsValid = true;
        const fields = state;
        const validationList = [
            {
                condition: !fields["name"],
                message: "Name cannot be empty",
                field: "name"
            },
            {
                condition: !file["type"],
                message: "File upload cannot be empty",
                field: "type"
            },
        ];

        for(let i = 0; i < validationList.length; i++) {
            validateData(validationList[i].condition, validationList[i].message, validationList[i].field);
        }
        
        setState({ 
            ...state, 
            errors: errors 
        });
        
        return {
            validation: formIsValid,
            message: errors
        };

        function validateData(condition, message, field) {
            if(condition) {
                formIsValid = false;
                errors[field] = message;
            }
        };
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleNameChange = (event) => {
        let change = {
            ...state
        };
        change[event.target.name] = event.target.value;
        setState(change);
    };

    return (
        <div>  
            {console.log(state)}
            <form className="w-full max-w-lg" onSubmit={handleQRCodeGenerator}>
                <h1 className={styles.center}>Plant Letterbox</h1>
                <div>&nbsp;</div>
                <div className={styles.center}>
                    <div className="flex flex-wrap -mx-3 mb-6 ">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="name">
                                Name
                            </label>
                            <input  className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                                    id="name" 
                                    name="name" 
                                    type="text" 
                                    placeholder="Letterbox Name" 
                                    onChange={handleNameChange}/>
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="upload">
                                Upload
                            </label>
                            <input className="appearance-none text-gray-700 py-3 px-4 " id="upload" name="upload"type="file" onChange={handleFileChange}/>
                        </div>
                        {
                            active ?
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <button type="submit" className="appearance-none block w-full bg-[#335383FF] text-white border rounded py-3 px-4 mb-3 leading-tight focus:outline-none hover:bg-green-700">Generate QR Code</button>
                            </div> 
                            : <p className={styles.center}>Connect Wallet</p>
                        }
                    </div>
                </div>
            </form> 
        </div>
    );
};
export default MintLetterBox;