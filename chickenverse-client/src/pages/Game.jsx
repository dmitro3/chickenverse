import { useEffect, useRef, useState } from "react";
import kaboom from "kaboom";

import useWallet from "@/hooks/useWallet";
import useContract from "@/hooks/useContract";

import { baseImageURI, baseMetadataURI } from "@/utils/gateway";

import NoNFT from "@/components/NoNFT";

import PageTransition from "@/components/PageTransition";

const Game = () => {
    const canvasRef = useRef(null);

    const { wallet } = useWallet();
    const { contract } = useContract(wallet);

    const [loading, setLoading] = useState(true);

    const [metadata, setMetadata] = useState({});
    const [nft, setNft] = useState(null);

    useEffect(async () => {
        if (wallet && contract) {
            try {
                const nft = (await contract.getNFT(wallet)).toNumber();

                if (nft) {
                    // prettier-ignore
                    const metadata = await fetch(`${baseMetadataURI}/${nft}.json`).then(res => res.json())
                    setMetadata(metadata);
                    setNft(nft);
                }
            } catch (e) {}

            setLoading(false);
        }
    }, [contract]);

    return (
        <PageTransition>
            {loading ? (
                <></>
            ) : nft ? (
                <canvas
                    className="absolute left-0 top-0 w-screen h-screen"
                    ref={canvasRef}
                ></canvas>
            ) : (
                <NoNFT />
            )}
        </PageTransition>
    );

    // setNft((await wavePortalContract.getNFT(wallet)).toNumber());
};

// {nft ? (
//     <div>{/* <img src={`${baseImageURI}/${nft}.png`} /> */}</div>
// ) : (
//     <NoNFT />
// )}

export default Game;
