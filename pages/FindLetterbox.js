import { ethers } from 'ethers';
import { InjectedConnector } from "@web3-react/injected-connector";
import LetterBoxList from '../components/LetterBoxList';
import styles from '../styles/Global.module.css';
import LetterBoxingABI from "../util/LetterBoxing.json";
import * as  constants from '../util/constants.js';

const DEPLOYED_CONTRACT_ADDRESS = constants.DEPLOYED_CONTRACT_ADDRESS;
const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_ETHERS_PROVIDER);

export const injected = new InjectedConnector();
  
export const getStaticProps = async () => {
    const contract = new ethers.Contract(DEPLOYED_CONTRACT_ADDRESS, LetterBoxingABI["abi"], provider);
    const allLetterboxes = await contract.letterboxList(); 
    console.log('All Letterbox IDs: ' + allLetterboxes);
    let letterBoxList = [];
    for (let i = 0; i < allLetterboxes.length; i++) {
        const resources = await contract.getActiveResources(allLetterboxes[i].toNumber()); 
        const{ metadataURI } = await contract.getResource(resources[0]);
        await fetch(metadataURI)
            .then(response => response.json())
            .then(data => {
                letterBoxList.push({
                    id: allLetterboxes[i].toNumber(),
                    name: data.name,
                    description: data.description,
                    src: data.media_uri_image,
                    city: data.properties.city,
                    country: data.properties.country,
                    lattitude: data.properties.lattitude,
                    longitude: data.properties.longitude,
                    state: data.properties.state,
                    zip: data.properties.zip
                    })
            });
    }
    return {
        props: { letterBoxList: letterBoxList }
    };
};
const FindLetterbox = ({ letterBoxList }) => {
    return (
        <div className='h-screen'>
            <div>
                <div>&nbsp;</div>
                <h1 className={styles.center}>Letterboxes</h1>
                <LetterBoxList letterbox={letterBoxList}/>
            </div> 
        </div>
    );
};

export default FindLetterbox;