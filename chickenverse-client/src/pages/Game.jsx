import { useEffect, useRef, useState } from "react";
import kaboom from "kaboom";

import useWallet from "@/hooks/useWallet";
import useContract from "@/hooks/useContract";
import useSocket from "@/hooks/useSocket";

import { baseImageURI, baseMetadataURI } from "@/utils/gateway";

import NoNFT from "@/components/NoNFT";

import PageTransition from "@/components/PageTransition";

import * as components from "@/components/engine/components";
import { map, assets } from "@/components/engine/config";
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
    const { socket, initialChicken } = useSocket(nft);

    // get NFT & metadata
    useEffect(async () => {
        if (wallet && contract) {
            try {
                const nft = parseInt(location.hash.slice(1)) || 1;

                // const nft = (await contract.getNFT(wallet)).toNumber();

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
        if (socket && nft && metadata && initialChicken && !kaboomed) {
            // initialize the game
            setKaboomed(true);
            kaboom({
                canvas: canvasRef.current,
                fullscreen: true,
                width: 480 * 2,
                height: 360 * 2,
                background: [103, 171, 57],
            });

            // globals
            let offset = vec2(40, 40);
            let currentEmoji = initialChicken.emoji;
            let track;

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
                        existing.emoji.frame = chicken.emoji;
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

                            emoji: add([
                                sprite("emoji", {
                                    frame: chicken.emoji,
                                }),
                                scale(3),
                                z(100),
                            ]),
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

                        multiplayerChicken.emoji.pos =
                            multiplayerChicken.pos.add(vec2(24, -50));
                    });
                });
            });

            // current chicken traits
            const traits = ["breed", "eyes", "hats", "feet"];
            metadata.attributes.map(({ trait_type }) =>
                trait_type.toLowerCase()
            );

            // emojis

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

            loadSprite("emoji", "/game/emoji.png", {
                sliceX: 8,
                sliceY: 8,
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

            // add emoji options
            [1, 9, 23, 13].forEach((emojiType, i) => {
                add([
                    ...components.emoji(emojiType, 7 + i * 50),
                    "emoji",
                    `emoji-${emojiType}`,
                ]);

                onClick(`emoji-${emojiType}`, () => {
                    currentEmoji = emojiType == 13 ? 0 : emojiType;
                });
            });

            // add player
            const player = add([
                sprite("wearables-nothing"),
                pos(initialChicken.pos.x, initialChicken.pos.y),
                scale(5),
                z(1),
                area({
                    width: 10,
                    height: 10,
                    offset: [26 - offset.x, 22 - offset.y],
                }),
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

                    emoji: add([
                        sprite("emoji", {
                            frame: currentEmoji,
                        }),
                        scale(3),
                        z(100),
                    ]),

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
                    emoji: player.emoji.frame,
                });

                player.move(player.vel.x, player.vel.y);
                camPos(
                    vec2(Math.floor(player.pos.x), Math.floor(player.pos.y))
                );

                traits.forEach((accessory) => {
                    if (player.hasOwnProperty(accessory)) {
                        const component = player[accessory];

                        component.pos = player.pos.clone().sub(offset);
                        component.flipX(player.isFlipped);
                    }
                });

                player.emoji.pos = player.pos.sub(offset).add(vec2(24, -50));
                player.emoji.frame = currentEmoji;

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
    }, [nft, metadata, socket, initialChicken]);

    return (
        <PageTransition>
            {nft && metadata ? (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none">
                    <div className="flex gap-3 items-center absolute bottom-3 left-3">
                        <img
                            className="rounded-full w-10 h-10"
                            src={`${baseImageURI}/${nft}.png`}
                        />
                        <h1 className="text-white text-lg font-semibold">
                            Chickenverse NFT #{nft}
                        </h1>
                    </div>

                    <canvas
                        className="rounded-lg shadow-xl overflow-hidden border"
                        ref={canvasRef}
                    ></canvas>
                </div>
            ) : (
                <NoNFT />
            )}
        </PageTransition>
    );
};

export default Game;
