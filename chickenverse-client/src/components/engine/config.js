import worldMap from "./simplifiedMap.json";

const map = [];
const loadedMap = worldMap.layers[0].data;

const size = 50;
for (let i = 0; i < loadedMap.length; i += size) {
    map.push(loadedMap.slice(i, i + size));
}

export { map };

export const assets = [
    "/game/layers/Breed/Maran.png",
    "/game/layers/Breed/Orpington.png",
    "/game/layers/Breed/Sussex.png",
    "/game/layers/Breed/WhiteLeghorn.png",
    "/game/layers/Eyes/Cry.png",
    "/game/layers/Eyes/FlightGoggles.png",
    "/game/layers/Eyes/Lasers.png",
    "/game/layers/Eyes/Line.png",
    "/game/layers/Eyes/Nerd.png",
    "/game/layers/Eyes/Nothing.png",
    "/game/layers/Eyes/Scuba.png",
    "/game/layers/Eyes/Sunglasses.png",
    "/game/layers/Eyes/Thor.png",
    "/game/layers/Eyes/Visor.png",
    "/game/layers/Feet/Beam.png",
    "/game/layers/Feet/Boots.png",
    "/game/layers/Feet/Midget.png",
    "/game/layers/Feet/Nest.png",
    "/game/layers/Feet/Stilts.png",
    "/game/layers/Feet/Tall.png",
    "/game/layers/Hats/Apple.png",
    "/game/layers/Hats/Banana.png",
    "/game/layers/Hats/Burger.png",
    "/game/layers/Hats/Cap1.png",
    "/game/layers/Hats/Cap2.png",
    "/game/layers/Hats/Chimney.png",
    "/game/layers/Hats/Cross.png",
    "/game/layers/Hats/Crown.png",
    "/game/layers/Hats/Flight Gear.png",
    "/game/layers/Hats/Flower1.png",
    "/game/layers/Hats/Flower2.png",
    "/game/layers/Hats/Graduate.png",
    "/game/layers/Hats/King.png",
    "/game/layers/Hats/Nothing.png",
    "/game/layers/Hats/Pot.png",
    "/game/layers/Hats/Quail.png",
    "/game/layers/Hats/Santa.png",
    "/game/layers/Hats/Sprout.png",
    "/game/layers/Hats/TopHat.png",
    "/game/layers/Hats/Viking.png",
    "/game/layers/Hats/Witch.png",
    "/game/layers/Wearables/Chain.png",
    "/game/layers/Wearables/Nothing.png",
    "/game/layers/Wearables/Pipe.png",
    "/game/layers/Wearables/Tie.png",
];
