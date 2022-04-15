import { useState } from "react";

import Preview from "@/components/Preview";

import ConnectMetamask from "@/components/ConnectMetamask";

import useWallet from "@/hooks/useWallet";
import useContract from "@/hooks/useContract";

import Modal from "@/components/Modal";

import Button from "@/components/atoms/Button";
import Footer from "@/components/atoms/Footer";

import PageTransition from "@/components/PageTransition";

import A from "@/components/atoms/A";
import { Link } from "react-router-dom";

const Home = () => {
    const { wallet, connectWallet } = useWallet();
    const { count } = useContract(wallet);

    const [open, setOpen] = useState(false);

    return (
        <PageTransition>
            <div className="flex items-center flex-col mt-10 lg:mt-0 lg:flex-row max-w-7xl mx-auto px-6 gap-8 min-h-screen">
                <main className="lg:max-w-[50%]">
                    <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold gradient-fix text-transparent bg-clip-text bg-gradient-to-r from-green-400  to-blue-500">
                        The Chickenverse
                    </h1>
                    <p className="mt-4 md:mt-8 leading-snug md:text-lg">
                        The Chickenverse is a collection of NFTs clucking around
                        on the test Ethereum network. We've programmatically
                        generated 1,000 chickens from a variety of rare traits
                        and characteristics. By adopting a chicken, you'll be
                        able to enter the{" "}
                        <Link to="/app">
                            <A $as="span">Chickenverse</A>
                        </Link>{" "}
                        and play with friends.{" "}
                        <b className="font-semibold">
                            {wallet && count
                                ? `Only ${1000 - count + 1} chickens left.`
                                : "Connect your wallet to get started."}
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
                        <ConnectMetamask
                            className="mt-4"
                            onClick={connectWallet}
                        />
                    )}

                    <Footer />
                </main>

                <Preview />

                <Modal {...{ open, setOpen }} />
            </div>
        </PageTransition>
    );
};

export default Home;
