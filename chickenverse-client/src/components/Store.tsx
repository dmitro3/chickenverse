import { createContext } from "react";

const Store = createContext({
    store: {},
    dispatch: () => {},
});

export default Store;
