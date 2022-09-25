import React from "react";
import { useRouter } from "next/router";

function HomeContent() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/HowTo");
  };

  return (
    <>
      <div className="min-h-[calc(100vh_-_80px_-_40px)]">
        {/* Section 1 */}
        <div className="flex flex-col relative h-72 py-64 w-screen justify-center bg-hero-pattern">
          <div className="flex items-center justify-center">
            <h1 className="text-white text-center text-2xl lg:text-5xl">
              Join our global hunt for hidden <br></br> art <br></br> off
              and on-chain
            </h1>
          </div>
          <div className=" bg-black opacity-70 flex items-center h-1/6 py-3 absolute bottom-0">
            <div className="flex justify-center items-center flex-col w-screen bottom-0">
              <h1 className="text-white text-center text-base sm:text-xl lg:text-2xl">
                We add an NFT layer to the fun experience of letter-boxing!
              </h1>
            </div>
          </div>
        </div>
        {/* Section 2 */}
        <div className="py-32 flex align-center justify-center w-screen">
          <div className="flex w-4/6  flex-col items-center justify-center">
            <div className="ew-full">
              <h5 className="text-center mb-10 text-3xl md:text-4xl">
                Ready to go on an adventure, explore <br></br> the world and
                start <br></br> your art collection?
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
  );
}

export default HomeContent;
