import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const useSocket = (id) => {
    const [socket, setSocket] = useState(null);
    const [initialChicken, setInitialChicken] = useState();

    useEffect(() => {
        if (id) {
            const newSocket = io("http://localhost:3001");

            setSocket(newSocket);

            newSocket
                .emit("request_chicken", id)
                .on("respond_chicken", (chicken) => {
                    setInitialChicken(chicken);
                });

            return () => {
                newSocket.close();
            };
        }
    }, [id]);

    return { socket, initialChicken };
};

export default useSocket;
