import { useRef } from "react";
import * as random from "@/utils/random";

const Preview = () => {
    const randomChickens = useRef(
        random.shuffle(new Array(37).fill(0).map((_, i) => i)).slice(0, 9)
    );

    return (
        <aside className="grid grid-cols-3 gap-6 select-none py-6 relative group">
            {randomChickens.current.map((key) => (
                <img
                    className="rounded-2xl"
                    key={key}
                    src={`/assets/${key + 1}.png`}
                />
            ))}

            <p className="absolute text-3xl font-bold whitespace-nowrap text-red-500 opacity-0 group-hover:opacity-100 transition-opacity top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                PREVIEW ONLY
            </p>
        </aside>
    );
};

export default Preview;
