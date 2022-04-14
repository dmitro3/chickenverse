import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Game from "./pages/Game";
import { AnimatePresence } from "framer-motion";

const App = () => {
    return (
        <AnimatePresence exitBeforeEnter>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/app" element={<Game />} />
                </Routes>
            </BrowserRouter>
        </AnimatePresence>
    );
};

export default App;
