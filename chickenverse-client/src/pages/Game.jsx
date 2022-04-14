import { useEffect, useRef, useState } from "react";
import kaboom from "kaboom";

import useWallet from "@/hooks/useWallet";
import useContract from "@/hooks/useContract";

import { baseImageURI, baseMetadataURI } from "@/utils/gateway";

import NoNFT from "@/components/NoNFT";

import PageTransition from "@/components/PageTransition";

import WorldMap from "@/components/WorldMap";

const MOVEMENT_SPEED = 50;

// don't look at this
// it's really bad

const Game = () => {
    const canvasRef = useRef(null);

    const { wallet } = useWallet();
    const { contract } = useContract(wallet);

    const [metadata, setMetadata] = useState({});
    const [nft, setNft] = useState(null);

    const [kaboomed, setKaboomed] = useState(false);

    useEffect(async () => {
        if (wallet && contract) {
            try {
                const nft = (await contract.getNFT(wallet)).toNumber();

                if (nft) {
                    // prettier-ignore
                    const metadata = await fetch(`${baseMetadataURI}/${nft}.json`).then(res => res.json())
                    setMetadata(metadata);
                    setNft(nft);
                }
            } catch (e) {}
        }
    }, [wallet, contract]);

    useEffect(async () => {
        if (nft && metadata && !kaboomed) {
            setKaboomed(true);

            kaboom({
                canvas: canvasRef.current,
                fullscreen: true,
                width: 480 * 2,
                height: 360 * 2,
                background: [255, 255, 255],
            });

            canvasRef.current.focus();

            debug.inspect = true;

            // load sprites
            metadata.attributes.forEach(({ trait_type, value }) => {
                const name = `${trait_type}-${value}`.toString().toLowerCase();
                const path = `/game/layers/${trait_type}/${value}.png`;
                console.log(name);
                loadSprite(name, path);
            });

            loadSprite("tiles", "/game/grass.png", {
                sliceX: 25,
                sliceY: 14,
            });

            const tile = () => {};

            for (let y = 0; y < WorldMap.length; y++) {
                for (let x = 0; x < WorldMap[y].length; x++) {
                    const tile = WorldMap[y][x];
                    const tileSize = 64;

                    const realX = x * tileSize;
                    const realY = y * tileSize;

                    if (realX < width() && realY < height()) {
                        add([
                            sprite("tiles", { frame: 0 }),
                            pos(realX, realY),
                            scale(tileSize / 16),
                        ]);

                        if (tile !== 1) {
                            add([
                                sprite("tiles", { frame: tile - 1 }),
                                pos(realX, realY),
                                scale(tileSize / 16),
                                area(),
                                solid(),
                                "decoration",
                            ]);
                        }
                    }
                }
            }

            // load music
            loadSound("music", "/game/music.wav");

            // add player
            const player = add([
                sprite("breed-orpington"),
                pos(100, 100),
                scale(5),
                z(1),
                area({ width: 10, height: 10, offset: [26, 22] }),
                solid(),
                {
                    hat: add([sprite("hats-chimney"), scale(5)]),
                    feet: add([sprite("feet-midget"), scale(5)]),
                    eyes: add([sprite("eyes-sunglasses"), scale(5), z(10)]),

                    isFlipped: false,
                    vel: vec2(0, 0),
                },
            ]);

            player.onUpdate(() => {
                const accessories = ["hat", "feet", "eyes"];

                player.move(player.vel.x, player.vel.y);

                accessories.forEach((accessory) => {
                    if (player.hasOwnProperty(accessory)) {
                        const component = player[accessory];
                        component.pos = player.pos;
                        component.flipX(player.isFlipped);
                    }
                });

                player.hat.pos = player.pos;
                player.feet.pos = player.pos;
                player.eyes.pos = player.pos;

                player.vel = player.vel.scale(0.9);
            });

            player.onCollide("decoration", () => {
                player.vel = player.vel.scale(0);
            });

            onKeyDown("right", () => {
                player.vel = player.vel.add(MOVEMENT_SPEED, 0);
                player.flipX(false);
                player.isFlipped = false;
            });

            onKeyDown("left", () => {
                player.vel = player.vel.add(-MOVEMENT_SPEED, 0);
                player.flipX(true);
                player.isFlipped = true;
            });

            onKeyDown("up", () => {
                player.vel = player.vel.add(0, -MOVEMENT_SPEED);
            });

            onKeyDown("down", () => {
                player.vel = player.vel.add(0, MOVEMENT_SPEED);
            });
        }
    }, [nft, metadata, wallet, contract]);

    return (
        <PageTransition>
            {nft && metadata ? (
                <canvas
                    // className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-xl overflow-hidden border"
                    ref={canvasRef}
                ></canvas>
            ) : (
                <NoNFT />
            )}
        </PageTransition>
    );
};

export default Game;
