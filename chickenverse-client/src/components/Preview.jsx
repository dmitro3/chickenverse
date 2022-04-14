import { useRef } from "react";
import * as random from "@/utils/random";

const Preview = () => {
    const randomChickens = useRef(
        random.shuffle(new Array(37).fill(0).map((_, i) => i)).slice(0, 9)
    );

    return (
        <aside className="grid grid-cols-3 gap-6 select-none py-6">
            {randomChickens.current.map((key) => (
                <img
                    className="rounded-2xl"
                    key={key}
                    src={`/assets/${key + 1}.png`}
                />
            ))}
        </aside>
    );
};

export default Preview;
