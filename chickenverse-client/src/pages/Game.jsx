import useWallet from "@/hooks/useWallet";
import useContract from "@/hooks/useContract";

import Engine from "@/game/Engine";

const Game = () => {
    const { wallet } = useWallet();
    const { nft } = useContract(wallet);

    // const canvasRef = useRef(null);

    // useEffect(() => {

    // }, [])

    return (
        <div>
            <canvas ref={canvasRef} />
        </div>
    );
};

export default Game;
