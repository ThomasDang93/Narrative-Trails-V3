import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from '../../styles/Global.module.css';
import QRCode from 'qrcode';
import { ethers } from 'ethers';
import { useWeb3React } from "@web3-react/core";
import LetterBoxingABI from "../../util/LetterBoxing.json";
import fleek from '@fleekhq/fleek-storage-js';  
import * as  constants from '../../util/constants.js';
import { ipfsMetaDataUpload } from '../../util/nft_operations.js';
import useCurrentMapLocation from '../../components/useCurrentMapLocation';
import ConfirmationModal from '../../components/ConfirmationModal';
import { InjectedConnector } from "@web3-react/injected-connector";
import { PrismaClient } from '@prisma/client';
export const injected = new InjectedConnector();
const DEPLOYED_CONTRACT_ADDRESS = constants.DEPLOYED_CONTRACT_ADDRESS;
export const getServerSideProps = async ({ params }) => {
    const prisma = new PrismaClient({});
    console.log('Params: ', params);
    const pendingLetterboxes = await prisma.pendingLetterbox.findUnique({
        where: {
            url_hash: params.id
        },
        select: {
            url_hash: true,
            id: true,
            letterbox_name: true,
            image_uri: true
        }
    });
    console.log(pendingLetterboxes);
    return {
        props: {
            pendingLetterboxes: pendingLetterboxes,
            revalidate: 1
        }
    };
};

const PendingLetterbox = ({ pendingLetterboxes }) => {
    console.log({pendingLetterboxes});
    const {
        active,
        account,
        library: provider,
      } = useWeb3React();
    const [state, setState] = useState({
        name: pendingLetterboxes !== null ? pendingLetterboxes.letterbox_name : "",
        lattitude: "",
        longitude: "",
        description: "",
        city: "",
        state: "",
        country: "",
        zip: "",
        isLetterBox: true,
        imageUrl: pendingLetterboxes !== null ? pendingLetterboxes.image_uri : ""
    });
    const router = useRouter();
    const [qrcode, setQRcode] = useState('');
    const [showModal, setShowModal] = useState(false);
    const {viewState, renderMap} = useCurrentMapLocation();
    console.log({router});
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = handleValidation();
        if(form.validation) {
            const confirmation = confirm("Are you sure you want to mint?");
            if(confirmation) {
                setShowModal(true);
                const metaDataResult = await ipfsMetaDataUpload({
                    fleek: fleek,
                    imageUrl: state.imageUrl,
                    metadataPath: constants.LETTERBOX_METADATA_PATH,
                    state: state,
                    viewState: viewState
                });
                const contract = new ethers.Contract(DEPLOYED_CONTRACT_ADDRESS, LetterBoxingABI["abi"], provider.getSigner());
                const tx = await contract.mintLetterbox(account, pendingLetterboxes.url_hash ,metaDataResult.publicUrl);
                const receipt = await tx.wait();
                const event = receipt.events.find(x => x.event === "LetterboxCreated");
                if(event.args.tokenId) {
                    const response = await fetch('/api/delete_pending_letterbox', {
                        method: 'DELETE',
                        body: JSON.stringify({
                            url_hash: pendingLetterboxes.url_hash
                        })
                    });
                    if(!response.ok) {
                        throw new Error(response.statusText);
                    } else {
                         router.push({
                             pathname: `/letterbox/${pendingLetterboxes.url_hash}`
                         });
                    }
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
        let errors = {};
        let formIsValid = true;
        const fields = state;
        const coordinates = viewState;
        const pattern = /^[0-9]{5}(?:-[0-9]{4})?$/;
        const validationList = [
            {
                condition: !fields["name"],
                message: "Name cannot be empty",
                field: "name"
            },
            {
                condition: !fields["imageUrl"],
                message: "Image URL cannot be empty",
                field: "imageUrl"
            },
            {
                condition: !fields["description"],
                message: "Description cannot be empty",
                field: "description"
            },
            {
                condition: !coordinates["latitude"],
                message: "Latitude cannot be empty",
                field: "lattitude"
            },
            {
                condition: isNaN(coordinates["latitude"]) === true,
                message: "Latitude must be a number",
                field: "lattitude"
            },
            {
                condition: !coordinates["longitude"],
                message: "Longitude cannot be empty",
                field: "longitude"
            },
            {
                condition: isNaN(coordinates["longitude"]) === true,
                message: "Longitude must be a number",
                field: "longitude"
            },
            {
                condition: !fields["country"],
                message: "Country cannot be empty",
                field: "country"
            },
            {
                condition: !fields["zip"],
                message: "Zip cannot be empty",
                field: "zip"
            },
            {
                condition: !pattern.test(fields["zip"]),
                message: "Zip is not valid",
                field: "zip"
            },
            {
                condition: !fields["city"],
                message: "City cannot be empty",
                field: "city"
            },
            {
                condition: !fields["state"],
                message: "State cannot be empty",
                field: "state"
            }
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

    const handleChange = (event) => {
        let change = {
            ...state
        };
        change[event.target.name] = event.target.value;
        setState(change);
    };

    useEffect(() => {
        let pendingLetterboxUrl = window.location.href;
        let url = pendingLetterboxUrl.replace('pendingletterbox', 'letterbox');
        QRCode.toDataURL(url, {
                width: 800,
                margin: 2,
                color: {
                    dark: '#335383FF',
                    light: '#EEEEEEFF'
                }
            }, (err, url) => {
                if (err) {
                    return console.error(err);
                }
                setQRcode(url);
            });
    },[]);

    return (
        <div>
            {console.log(viewState)}
            <div className={styles.center}>
                <img src={qrcode} className="w-full hover" top width="100%"></img>
                <a href={qrcode} className="appearance-none block w-full bg-[#335383FF] text-white border rounded py-3 px-4 mb-3 leading-tight focus:outline-none hover:bg-green-700" download="qrcode.png">Download</a>
            </div>
            <form className="w-full max-w-lg" onSubmit={handleSubmit}>
            <h1 className={styles.center}>Plant Letterbox</h1>
                <div>&nbsp;</div>
                <div className={styles.center}>
                    <div className="flex flex-wrap -mx-3 mb-6 ">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="name">
                                Name
                            </label>
                            <h1>{pendingLetterboxes !== null ? pendingLetterboxes.letterbox_name : ""}</h1>
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <img src={pendingLetterboxes !== null ? pendingLetterboxes.image_uri : ""} className="w-full hover" top width="100%"></img>
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="description">
                            Description
                            </label>
                            <textarea className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" rows="4" id="description" name="description" type="textarea" placeholder="Enter instructions here" onChange={handleChange}/>
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                            {renderMap}
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap -mx-3 mb-2">
                        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="lattitude">
                            Latitude
                            </label>
                            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="lattitude" name="lattitude" type="text" placeholder="30.0455542" defaultValue={viewState.latitude} disabled = "disabled"/>
                        </div>
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="longitude">
                        Longitude
                        </label>
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="longitude" name="longitude" type="text" placeholder="-99.1405168" defaultValue={viewState.longitude} disabled = "disabled"/>
                    </div>
                        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="zip">
                            Zip
                            </label>
                            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="zip" name="zip" type="text" placeholder="90210" onChange={handleChange}/>
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-2">
                        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="city">
                            City
                            </label>
                            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="city" name="city" type="text" placeholder="Miami" onChange={handleChange}/>
                        </div>
                        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="state">
                            State
                            </label>
                            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="state" name="state" type="text" placeholder="Florida" onChange={handleChange}/>
                        </div>
                        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="country">
                            Country
                            </label>
                            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="country" name="country" type="text" placeholder="USA" onChange={handleChange}/>
                        </div>
                    </div>
                    {
                        active ?
                        <div className="flex flex-wrap -mx-3 mb-2">
                            <button type="submit" className={styles.submitbtn}>Mint</button>
                        </div>
                        : <p className={styles.center}>Connect Wallet</p>
                    }
                    
                </div>  
            </form>
            <ConfirmationModal onClose={() => setShowModal(false)} show={showModal}/>
        </div>
    )
}
export default PendingLetterbox;