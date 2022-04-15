import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { ethers } from "ethers";

import LoadingButton from "./LoadingButton";
import A from "./atoms/A";

import useWallet from "@/hooks/useWallet";
import useContract from "@/hooks/useContract";

import { baseMetadataURI, baseImageURI } from "@/utils/gateway";

const Modal = ({ open, setOpen }) => {
    const { wallet, forceFetchWallet } = useWallet();
    const { contract, count } = useContract(wallet);

    const modalRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(<></>);

    const [img, setImg] = useState("/egg.png");
    const [egg, setEgg] = useState(true);

    useEffect(() => {
        if (!wallet) {
            forceFetchWallet();
        }
    }, [open]);

    const mintNFT = async () => {
        const metadataURI = `${baseMetadataURI}/${count}.json`;

        if (wallet && contract) {
            setLoading(true);
            setEgg(false);

            const isOwned = await contract.isContentOwned(metadataURI);

            if (!isOwned) {
                try {
                    const txn = await contract.payMint(wallet, metadataURI, {
                        value: ethers.utils.parseEther("0.001"),
                    });

                    await txn.wait();

                    setImg(`${baseImageURI}/${count + 1}.png`);

                    setMessage(
                        <span>
                            View your transaction on{" "}
                            <A
                                href={`https://rinkeby.etherscan.io/tx/${txn.hash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Etherscan
                            </A>
                        </span>
                    );
                } catch (e) {
                    setMessage(
                        "You can only keep one bird! Are you sure you haven't already minted one?"
                    );
                }

                setEgg(true);
            }

            setLoading(false);
        }
    };

    const onClick = (e) => {
        e.stopPropagation();

        if (e.target === modalRef.current) {
            setOpen(false);
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed w-screen h-screen left-0 top-0 p-6 overflow-hidden grid place-items-center bg-black bg-opacity-40"
                    variants={{
                        hidden: { opacity: 0 },
                        show: { opacity: 1 },
                    }}
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                    ref={modalRef}
                    onClick={onClick}
                >
                    <motion.div
                        className="p-6 bg-white rounded-xl shadow-2xl border"
                        variants={{
                            hidden: { opacity: 0, scale: 0 },
                            show: {
                                opacity: 1,
                                scale: 1,
                                transition: { delay: 0.5 },
                            },
                        }}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                    >
                        <div className="w-96">
                            {count + 1 > 1000 ? (
                                <p className="text-lg">
                                    Sorry, we don't have any chickens left!
                                    Consider buying one on OpenSea.
                                </p>
                            ) : (
                                <>
                                    <motion.img
                                        className="rounded-xl w-full h-96 crisp-fix"
                                        src={img}
                                        variants={{
                                            hidden: { scale: 0 },
                                            show: { scale: 1 },
                                        }}
                                        initial="show"
                                        animate={egg ? "show" : "hidden"}
                                    />
                                    <h2 className="mt-4 font-semibold text-2xl">
                                        Mint your Chicken
                                    </h2>
                                    <p className="text-lg max-w-full">
                                        This will cost you 0.001 fake ETH. And
                                        some gas. {message}
                                    </p>

                                    <LoadingButton
                                        className="mt-4 float-right"
                                        loading={loading}
                                        onClick={mintNFT}
                                    >
                                        Mint
                                    </LoadingButton>
                                </>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Modal;
