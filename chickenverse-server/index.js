import { Server } from "socket.io";
import PolySchema, { PolyTypes } from "the-poly-schema";

// create new io server
const io = new Server(3001, {
    cors: {
        origin: "*",
    },
});

// store chickens in memory
const chickens = {};

// chicken schema
const chickenSchema = new PolySchema({
    id: PolyTypes.number,
    traits: PolyTypes.arrayOf(PolyTypes.string),
    pos: {
        x: PolyTypes.number,
        y: PolyTypes.number,
    },
    isFlipped: PolyTypes.boolean,
    emoji: PolyTypes.number,
});

// socket connection
io.on("connection", (socket) => {
    // save chicken id
    let chickenId = null;

    // on new chicken/chicken update
    socket.on("chicken", (data) => {
        if (chickenSchema.validate(data, true)) {
            chickens[data.id] = data;
            chickenId = data.id;
        }
    });

    // send chicken with id
    socket.on("request_chicken", (id) => {
        socket.emit(
            "respond_chicken",
            chickens[id] || {
                id,
                traits: [],
                pos: {
                    x: 100,
                    y: 100,
                },
                emoji: 0,
            }
        );
    });

    // "game loop"
    const interval = setInterval(() => {
        socket.emit("chickens", chickens);
    }, 1000 / 60);

    // cleanup on disconnect
    socket.on("disconnect", () => {
        clearInterval(interval);
    });
});
