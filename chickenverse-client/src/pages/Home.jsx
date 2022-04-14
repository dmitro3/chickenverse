import { useState } from "react";

import Preview from "@/components/Preview";

import ConnectMetamask from "@/components/ConnectMetamask";

import useWallet from "@/hooks/useWallet";
import useContract from "@/hooks/useContract";

import Modal from "@/components/Modal";

import Button from "@/components/atoms/Button";

const Home = () => {
    const { wallet, connectWallet } = useWallet();
    const { count } = useContract(wallet);

    const [open, setOpen] = useState(false);

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
                    characteristics. Consider adopting a chicken and entering
                    the Chickenverse!{" "}
                    <b className="font-semibold">
                        Only {1000 - count} chickens left.
                    </b>
                </p>

                {wallet ? (
                    <Button
                        className="mt-4"
                        onClick={() => {
                            setOpen(true);
                        }}
                    >
                        Mint a Chicken
                    </Button>
                ) : (
                    <ConnectMetamask className="mt-4" onClick={connectWallet} />
                )}

                <footer className="py-8 text-slate-400 text-sm">
                    Made by Nathan Pham
                </footer>
            </main>

            <Preview />

            <Modal {...{ open, setOpen, count }} />
        </div>
    );
};

export default Home;
