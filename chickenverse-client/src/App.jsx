import Preview from "./components/Preview";
import Button from "./components/atoms/Button";

import ConnectMetamask from "./components/ConnectMetamask";

const App = () => {
    return (
        <div className="flex items-center flex-col-reverse xl:flex-row max-w-7xl mx-auto px-6 gap-8 min-h-screen">
            <main>
                <h1 className="whitespace-nowrap text-7xl font-bold gradient-fix text-transparent bg-clip-text bg-gradient-to-r from-green-400  to-blue-500">
                    The Chickenverse
                </h1>
                <p className="mt-6 leading-snug text-lg">
                    Chickenverse is a collection of NFTs clucking around on the
                    test Ethereum network. We've programmatically generated
                    1,000 chickens from a variety of rare traits and
                    characteristics. Consider adopting a chicken and entering
                    the Chickenverse!
                </p>

                <ConnectMetamask className="mt-4" />
            </main>

            <Preview />
        </div>
    );
};

export default App;
