import { ethers } from "ethers";
import { useEffect, useState } from "react";

import contractABI from "@/contracts/ChickenNFT.json";
const contractAddress = "0x4Ff2ecF6a9e8A297Aa48209E85945F10704a7745";

const useContract = (wallet) => {
    const [contract, setContract] = useState(null);
    const [count, setCount] = useState(0);
    const [nft, setNft] = useState(null);

    useEffect(async () => {
        if (wallet) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();

            const wavePortalContract = new ethers.Contract(
                contractAddress,
                contractABI.abi,
                signer
            );

            setContract(wavePortalContract);
            setCount(parseInt(await wavePortalContract.count()) + 1);

            console.log((await wavePortalContract.getNFT(wallet)).toNumber());

            // setContract(await wavePortalContract.getNFT(wallet));
            // console.log((await wavePortalContract.getNFT(wallet)).toNumber());
        }
    }, [wallet]);

    return { contract, count, nft };
};

export default useContract;
