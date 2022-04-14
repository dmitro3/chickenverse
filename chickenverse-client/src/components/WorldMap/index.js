import worldMap from "./worldMap.json";

const map = [];
const loadedMap = worldMap.layers[0].data;

const size = 100;
for (let i = 0; i < loadedMap.length; i += size) {
    map.push(loadedMap.slice(i, i + size));
}

export default map;
