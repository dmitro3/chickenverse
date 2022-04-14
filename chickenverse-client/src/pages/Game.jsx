import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";

import useWallet from "@/hooks/useWallet";
import useContract from "@/hooks/useContract";

import Button from "@/components/atoms/Button";
import Footer from "@/components/atoms/Footer";
import A from "@/components/atoms/A";

import Engine from "@/game/Engine";
import { baseImageURI } from "../utils/gateway";

import Preview from "../components/Preview";

const Game = () => {
    const randomChicken = useRef(Math.floor(Math.random() * 36) + 1);

    const { wallet } = useWallet();
    // const { nft } = useContract(wallet);
    let nft = null;

    // const canvasRef = useRef(null);

    // useEffect(() => {

    // }, [])

    // useEffect(() => {

    // }, [])

    return nft ? (
        <div>
            <img src={`${baseImageURI}/${nft}.png`} />
        </div>
    ) : (
        <main className="max-w-5xl p-6 mx-auto">
            <div className="flex gap-4">
                <img
                    src={`/assets/${randomChicken.current}.png`}
                    className="rounded-lg h-64"
                />
                <div className="flex flex-col">
                    <h1 className="text-5xl font-bold">Oh no!</h1>
                    <p className="text-lg mt-4">
                        Looks like you don't have a registered NFT. If you think
                        this is an error, please contact me at{" "}
                        <A href="mailto:nathanpham.me@gmail.com">
                            nathanpham.me@gmail.com
                        </A>{" "}
                        so I can look into it.
                    </p>

                    <Link to="/">
                        <Button className="mt-2">Go Back Home</Button>
                    </Link>
                    <Footer className="flex-end mt-auto py-0" />
                </div>
            </div>
        </main>
    );
};

export default Game;
