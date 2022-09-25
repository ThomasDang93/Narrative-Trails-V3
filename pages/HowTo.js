import React from "react";
import { useRouter } from "next/router";

function HowTo() {
  const router = useRouter();
  const handleClick = () => {
    router.push("/MintStamp");
  };
  return (
    <div>
      <>
        <div className="min-h-[calc(100vh_-_80px_-_40px)]">
          {/* Section 1 */}
          <div className="flex flex-col pt-20 pb-10 w-screen justify-center">
            <div className="flex items-center justify-center">
              <h1 className="text-black text-center text-2xl lg:text-5xl">
                How to Letterbox<br></br> off and on-chain
              </h1>
            </div>
            <div className=" bg-black opacity-70 flex items-center h-1/6 py-3 absolute bottom-0">
              {/* <div className="flex justify-center items-center flex-col w-screen bottom-0">
              <h1 className="text-white text-center text-base sm:text-xl lg:text-2xl">
                Letterboxing IRL
              </h1>
            </div> */}
            </div>
          </div>
          {/* Section 2 */}
          <div className="flex flex-col w-screen justify-center bg-red-400">
            <div className="flex flex-col items-center py-16 bg-green-texture justify-center">
              <div className="w-screen pl-40">
                <h1 className="text-black text-2xl lg:text-5xl">
                  Letterboxing IRL <br></br> <br></br>
                </h1>
              </div>
              <div className="lg:grid-cols-3 md:justify-items-center md:w-5/6 md:grid md:grid-cols-2 md:gap-1 grid-rows-2 sm:w-full sm:flex sm:flex-col sm:justify-center sm:items-center">
                {/* First Card */}
                <div className="flex bg-white drop-shadow-lg py-16 px-10 mb-7 rounded-2xl flex-col lg:min-w-3/5 md:w-4/5 sm:w-3/5 mt-4">
                  <div className=" text-customGreen border-customGreen mb-4 border-2 rounded-full w-12 h-12 flex items-center justify-center">
                    <h6 className="border-solid font-semibold text-3xl w-7 text-center ">
                      1
                    </h6>
                  </div>
                  <p className="text-sm text-left">
                    Make or buy your own stamp, get a blank notepad and an ink
                    pad.{" "}
                  </p>
                </div>

                {/* Second Card */}
                <div className="flex bg-white drop-shadow-lg py-16 px-10 mb-7 rounded-2xl flex-col lg:min-w-3/5 md:w-4/5 sm:w-3/5 mt-4">
                  <div className=" text-customGreen border-customGreen mb-4 border-2 rounded-full w-12 h-12 flex items-center justify-center">
                    <h6 className="border-solid font-semibold text-3xl w-7 text-center ">
                      2
                    </h6>
                  </div>
                  <p className="text-sm text-left">
                    Go look for letterbox clues online.{" "}
                  </p>
                </div>

                {/* Third Card */}
                <div className="flex bg-white drop-shadow-lg py-16 px-10 mb-7 rounded-2xl flex-col lg:min-w-3/5 md:w-4/5 sm:w-3/5 mt-4">
                  <div className=" text-customGreen border-customGreen mb-4 border-2 rounded-full w-12 h-12 flex items-center justify-center">
                    <h6 className="border-solid font-semibold text-3xl w-7 text-center ">
                      3
                    </h6>
                  </div>
                  <p className="text-sm text-left">
                    Go actually find that letterbox.{" "}
                  </p>
                </div>

                {/* Fourth Card */}
                <div className="flex bg-white drop-shadow-lg py-16 px-10 mb-7 rounded-2xl flex-col lg:min-w-3/5 md:w-4/5 sm:w-3/5 mt-4">
                  <div className=" text-customGreen border-customGreen mb-4 border-2 rounded-full w-12 h-12 flex items-center justify-center">
                    <h6 className="border-solid font-semibold text-3xl w-7 text-center ">
                      4
                    </h6>
                  </div>
                  <p className="text-sm text-left">
                    Collect the impression of the letterbox stamp on your
                    notepad and leave your stamp mark in the letterbox log book.{" "}
                  </p>
                </div>

                {/* Fifth Card */}
                <div className="flex bg-white drop-shadow-lg py-16 px-10 mb-7 rounded-2xl flex-col lg:min-w-3/5 md:w-4/5 sm:w-3/5 mt-4">
                  <div className=" text-customGreen border-customGreen mb-4 border-2 rounded-full w-12 h-12 flex items-center justify-center">
                    <h6 className="border-solid font-semibold text-3xl w-7 text-center ">
                      5
                    </h6>
                  </div>
                  <p className="text-sm text-left">
                    Re-hide letterbox in the same place where you found it.{" "}
                  </p>
                </div>

                {/* Sixth Card */}
                <div className="flex bg-white drop-shadow-lg py-16 px-10 mb-7 rounded-2xl flex-col lg:min-w-3/5 md:w-4/5 sm:w-3/5 mt-4">
                  <div className=" text-customGreen border-customGreen mb-4 border-2 rounded-full w-12 h-12 flex items-center justify-center">
                    <h6 className="border-solid font-semibold text-3xl w-7 text-center ">
                      6
                    </h6>
                  </div>
                  <p className="text-sm text-left">
                    Keep on adventuring and collecting stamps in new places.{" "}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Section 3 */}
          <div className="py-32 flex align-center justify-center w-screen">
            <div className="flex w-4/6  flex-col items-center justify-center">
              <div className="ew-full">
                <h5 className="text-center mb-10 text-3xl md:text-4xl">
                  Discover new places, be part of our community and enjoy
                  timeless access on-chain!
                </h5>
              </div>
              <div className="flex w-5/6 sm:w-4/6 md:w-3/5 lg:w-2/5 xl:w-2/6 justify-evenly">
                <button className="bg-green-500 w-32 hover:bg-[#355176] text-white font-bold py-2 px-4 rounded">
                  Learn More
                </button>
                <button
                  onClick={handleClick}
                  className="bg-green-500  w-32 hover:bg-[#355176] text-white font-bold py-2 px-4 rounded"
                >
                  {"Let's Go"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
}

export default HowTo;
