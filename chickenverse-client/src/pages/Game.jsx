import useWallet from "@/hooks/useWallet";
import useContract from "@/hooks/useContract";

const Game = () => {
    const { wallet } = useWallet();
    const { nft } = useContract(wallet);

    return <p>{nft}</p>;
};

export default Game;
