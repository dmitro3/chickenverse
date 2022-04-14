import { useState } from "react";
import { ethers } from "ethers";

import Preview from "./components/Preview";

import ConnectMetamask from "./components/ConnectMetamask";

import useWallet from "./components/hooks/useWallet";
import useContract from "./components/hooks/useContract";
import Button from "./components/atoms/Button";
import LoadingButton from "./components/LoadingButton";

const App = () => {
    const { wallet, connectWallet } = useWallet();
    const { contract, count } = useContract(wallet);

    const [loading, setLoading] = useState(false);

    const mintNFT = async () => {
        const metadataURI = `https://gateway.pinata.cloud/ipfs/QmWNtTnZAeMxkoHPTZhc7hxYaWzxFCJB4YrCN2S6MJavYc/${count}.json`;
        const imageURI = `https://gateway.pinata.cloud/ipfs/QmPC44Yzpd3XPkutEankvjSippdhRnrcQPRPqurqCGiJd4/${count}.png`;

        if (wallet && contract) {
            setLoading(true);

            const isOwned = await contract.isContentOwned(metadataURI);

            if (!isOwned) {
                const txn = await contract.payMint(wallet, metadataURI, {
                    value: ethers.utils.parseEther("0.001"),
                });

                await txn.wait();

                console.log(txn.hash);
                console.log(imageURI);
            }

            setLoading(false);
        }
    };

    return (
        <div className="flex items-center flex-col-reverse xl:flex-row max-w-7xl mx-auto px-6 gap-8 min-h-screen">
            <main className="xl:max-w-[50%]">
                <h1 className="text-7xl font-bold gradient-fix text-transparent bg-clip-text bg-gradient-to-r from-green-400  to-blue-500">
                    The Chickenverse
                </h1>
                <p className="mt-8 leading-snug text-lg">
                    Chickenverse is a collection of NFTs clucking around on the
                    test Ethereum network. We've programmatically generated
                    1,000 chickens from a variety of rare traits and
                    characteristics. Consider adopting a chicken for the small
                    price of 0.001 ETH and entering the Chickenverse!
                </p>

                {wallet ? (
                    <LoadingButton
                        className="mt-4"
                        loading={loading}
                        onClick={mintNFT}
                    >
                        Mint a Chicken
                    </LoadingButton>
                ) : (
                    <ConnectMetamask className="mt-4" onClick={connectWallet} />
                )}

                <footer className="py-8 text-slate-400 text-sm">
                    Made by Nathan Pham
                </footer>
            </main>

            <Preview />
        </div>
    );
};

export default App;
