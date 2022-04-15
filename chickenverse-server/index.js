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
});

io.on("connection", (socket) => {
    socket.on("chicken", (data) => {
        if (chickenSchema.validate(data, true)) {
            chickens[data.id] = data;
        }
    });

    socket.on("request_chicken", (id) => {
        socket.emit(
            "respond_chicken",
            chickens[id] || {
                id: 0,
                traits: [],
                pos: {
                    x: 100,
                    y: 100,
                },
            }
        );
    });

    const interval = setInterval(() => {
        socket.emit("chickens", chickens);
    }, 1000 / 60);

    socket.on("disconnect", () => {
        clearInterval(interval);
    });
});
