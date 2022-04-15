import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const useSocket = (id) => {
    const [socket, setSocket] = useState(null);
    const [initialPos, setInitialPos] = useState();

    useEffect(() => {
        if (id) {
            const newSocket = io("http://localhost:3001");

            setSocket(newSocket);

            newSocket
                .emit("request_chicken", id)
                .on("respond_chicken", (chicken) => {
                    setInitialPos(chicken.pos);
                });

            return () => {
                newSocket.close();
            };
        }
    }, [id]);

    return { socket, initialPos };
};

export default useSocket;
