import React from "react";
import Image from "next/image";
import LetterboxingIRL from "../public/LetterboxingIRL.svg";
import LetterboxingNFT from "../public/LetterboxingNFT.svg";
import { useRouter } from "next/router";

export default function GettingStarted() {
  const router = useRouter();
  const handleClick = () => {
    router.push("/MintStamp");
  };
  return (
    <>
      <div className="h-screen flex flex-col items-center justify-center">
        <div className=" -mt-32">
          <h5 className="text-3xl text-center pb-10">Getting Started</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="flex flex-col items-center px-6 py-8 hover:text-white bg-white rounded-xl shadow-sm hover:bg-slate-400 hover:border-1 hover:cursor-pointer hover:shadow-xl">
              <div className="pt-14">
                <Image
                  layout="intrinsic"
                  className=""
                  src={LetterboxingIRL}
                  height={125}
                  width={125}
                />
              </div>
              <h5 className="text-center text-2xl pt-5 pb-3">IRL</h5>
              <p className="text-center pb-10 px-3">
                IRL Have your stamp, ink pad <br></br>and notepade at the ready.
              </p>
            </div>
            <button className="flex flex-col items-center px-6 py-8 bg-white rounded-xl shadow-sm  hover:text-white hover:bg-slate-400 hover:border-1 hover:cursor-pointer hover:shadow-xl">
              <div className="pt-14">
                <Image
                  layout="intrinsic"
                  className=""
                  src={LetterboxingNFT}
                  height={125}
                  width={125}
                  onClick={handleClick}
                />
              </div>
              <h5 className="text-center text-2xl pt-5 pb-3">On-chain</h5>
              <p className="text-center pb-10 px-3">
                Drop a .jpg or .png of your stamp
                <br></br> to mint your NFT stamp or browse your files
              </p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
