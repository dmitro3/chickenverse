import { ethers } from "ethers";
import { useEffect, useState } from "react";

import contractABI from "@/contracts/ChickenNFT.json";
const contractAddress = "0x0295F6F70646A05C3Fc4765d6566608937FB1A8f";

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
            setCount(parseInt(await wavePortalContract.count()));

            try {
                setNft((await wavePortalContract.getNFT(wallet)).toNumber());
            } catch (e) {
                // means we probably don't have one yet
            }
        }
    }, [wallet]);

    return { contract, count, nft };
};

export default useContract;
