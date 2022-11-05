import React, {useEffect, useRef, useState} from "react";
import ReactDOM from 'react-dom';


const ConfirmationModal = ({show, onClose}) => {
    const [isBrowser, setIsBrowser] = useState(false);
    useEffect(() => {
        setIsBrowser(true);
    }, []);

    const handleCloseClick = (e) => {
        e.preventDefault();
        onClose();
    };

    const modalContent = show ? (
            <div className="modalOverlay relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3 text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                        <svg
                            className="h-6 w-6 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                            ></path>
                        </svg>
                    </div>
                    <h3 className="text-lg leading-6 font-medium text-white">Waiting...</h3>
                    <div className="mt-2 px-7 py-3">
                        <p className="text-sm text-white">
                            Please confirm transaction from your wallet.
                        </p>
                    </div>
                    <div className="items-center px-4 py-3">
                        <a href="#" onClick={handleCloseClick} id="ok-btn" className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300" >
                            Close
                        </a>
                    </div>
                </div>
            </div>
    ) : null;

    if(isBrowser) {
        return ReactDOM.createPortal(
            modalContent,
            document.getElementById("modal-root")
        );
    } else {
        return null;
    }
};
   
export default ConfirmationModal;
