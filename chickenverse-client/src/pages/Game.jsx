import { useEffect, useRef, useState } from "react";
import kaboom from "kaboom";

import useWallet from "@/hooks/useWallet";
import useContract from "@/hooks/useContract";
import useSocket from "@/hooks/useSocket";

import { baseImageURI, baseMetadataURI } from "@/utils/gateway";

import NoNFT from "@/components/NoNFT";

import PageTransition from "@/components/PageTransition";

import { map, assets } from "@/components/engine";

// don't look at this
// it's really bad

const MOVEMENT_SPEED = 50;

const Game = () => {
    const canvasRef = useRef(null);

    const { wallet } = useWallet();
    const { contract } = useContract(wallet);

    const [metadata, setMetadata] = useState({});
    const [nft, setNft] = useState(null);

    const [kaboomed, setKaboomed] = useState(false);
    const { socket, initialPos } = useSocket(nft);

    // get NFT & metadata
    useEffect(async () => {
        if (wallet && contract) {
            try {
                const nft = parseInt(location.hash.slice(1)) || 1;

                //(await contract.getNFT(wallet)).toNumber();

                if (nft) {
                    // prettier-ignore
                    const metadata = await fetch(`${baseMetadataURI}/${nft}.json`).then(res => res.json())
                    setMetadata(metadata);
                    setNft(nft);
                }
            } catch (e) {}
        }
    }, [wallet, contract]);

    // actual game
    useEffect(async () => {
        if (socket && nft && metadata && initialPos && !kaboomed) {
            // initialize the game
            setKaboomed(true);
            kaboom({
                canvas: canvasRef.current,
                fullscreen: true,
                width: 480 * 2,
                height: 360 * 2,
                background: [103, 171, 57],
            });

            canvasRef.current.focus();

            // update chickens (multiplayer)
            socket.on("chickens", (data) => {
                Object.keys(data).map((key) => {
                    const chicken = data[key];

                    if (chicken.id === nft) {
                        return;
                    }

                    const existing = get(`chicken-${key}`)[0];
                    if (existing) {
                        existing.pos = vec2(chicken.pos.x, chicken.pos.y);
                        existing.isFlipped = chicken.isFlipped;
                        return;
                    }

                    const multiplayerChicken = add([
                        sprite("wearables-nothing"),
                        pos(chicken.pos.x, chicken.pos.y),
                        scale(5),
                        z(20),
                        area({ width: 10, height: 10, offset: [26, 22] }),
                        solid(),
                        outview({ hide: true }),
                        `chicken-${key}`,
                        {
                            ...chicken.traits.reduce((acc, curr) => {
                                const trait_type = curr.split("-").shift();

                                return {
                                    ...acc,
                                    [trait_type]: add([
                                        sprite(curr),
                                        scale(5),
                                        trait_type == "eyes" ? z(20) : z(10),
                                    ]),
                                };
                            }, {}),

                            isFlipped: chicken.isFlipped,
                        },
                    ]);

                    multiplayerChicken.onUpdate(() => {
                        traits.forEach((accessory) => {
                            if (multiplayerChicken.hasOwnProperty(accessory)) {
                                const component = multiplayerChicken[accessory];

                                component.pos = vec2(
                                    multiplayerChicken.pos.x,
                                    multiplayerChicken.pos.y
                                );

                                component.flipX(multiplayerChicken.isFlipped);
                            }
                        });
                    });
                });
            });

            // current chicken traits
            const traits = ["breed", "eyes", "hats", "feet"];
            metadata.attributes.map(({ trait_type }) =>
                trait_type.toLowerCase()
            );

            const spriteNames = metadata.attributes.map(
                ({ trait_type, value }) => {
                    return `${trait_type}-${value}`.toLowerCase();
                }
            );

            // load sprites
            assets.forEach((path) => {
                const [value, trait_type] = path.split("/").reverse();
                const name = `${trait_type}-${value
                    .split(".")
                    .shift()}`.toLowerCase();

                loadSprite(name, path);
            });

            loadSprite("tiles", "/game/grass.png", {
                sliceX: 25,
                sliceY: 14,
            });

            for (let y = 0; y < map.length; y++) {
                for (let x = 0; x < map[y].length; x++) {
                    const tile = map[y][x];
                    const tileSize = 64;

                    const worldOffset = camPos()
                        .clone()
                        .sub(vec2(width() / 2, height() / 2));

                    const realX = x * tileSize + worldOffset.x;
                    const realY = y * tileSize + worldOffset.y;

                    add([
                        sprite("tiles", { frame: 0 }),
                        pos(realX, realY),
                        scale(tileSize / 16),
                        area(),
                        outview({ hide: true }),
                        "tile",
                    ]);

                    if (tile !== 1) {
                        add([
                            sprite("tiles", { frame: tile - 1 }),
                            pos(realX, realY),
                            scale(tileSize / 16),
                            area(),
                            solid(),
                            outview({ hide: true }),
                            "tile",
                            "decoration",
                        ]);
                    }
                }
            }

            // load music
            loadSound("music", "/game/music.wav");
            // track = play("music", { loop: true });

            // add player
            const player = add([
                sprite("wearables-nothing"),
                pos(initialPos.x, initialPos.y),
                scale(5),
                z(1),
                area({ width: 10, height: 10, offset: [26 - 20, 22 - 20] }),
                solid(),
                {
                    ...metadata.attributes.reduce(
                        (acc, { trait_type, value }, i) => {
                            trait_type = trait_type.toLowerCase();

                            return {
                                ...acc,
                                [trait_type]: add([
                                    sprite(spriteNames[i]),
                                    scale(5),
                                    trait_type === "eyes" ? z(5) : z(1),
                                ]),
                            };
                        },
                        {}
                    ),

                    isFlipped: false,
                    vel: vec2(0, 0),
                },
            ]);

            player.onUpdate(() => {
                socket.emit("chicken", {
                    id: nft,
                    traits: spriteNames,
                    pos: { x: player.pos.x, y: player.pos.y },
                    isFlipped: player.isFlipped,
                });

                player.move(player.vel.x, player.vel.y);
                camPos(
                    vec2(Math.floor(player.pos.x), Math.floor(player.pos.y))
                );

                traits.forEach((accessory) => {
                    if (player.hasOwnProperty(accessory)) {
                        const component = player[accessory];

                        component.pos = player.pos.clone().sub(vec2(20, 20));
                        component.flipX(player.isFlipped);
                    }
                });

                player.vel = player.vel.scale(0.9);
            });

            player.onCollide("decoration", () => {
                player.vel = player.vel.scale(0);
            });

            // event listeners
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
    }, [nft, metadata, socket, initialPos]);

    return (
        <PageTransition>
            {nft && metadata ? (
                <canvas
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-xl overflow-hidden border"
                    ref={canvasRef}
                ></canvas>
            ) : (
                <NoNFT />
            )}
        </PageTransition>
    );
};

export default Game;
