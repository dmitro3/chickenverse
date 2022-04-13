import Button from "./atoms/Button";

const ConnectMetamask = ({ className, ...props }) => {
    return window.ethereum ? (
        <Button className={className}>Connect with Metamask</Button>
    ) : (
        <Button
            className={className}
            $as="a"
            href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
            rel="noreferer"
            target="_blank"
        >
            Install Metamask
        </Button>
    );
};

// as="a"

export default ConnectMetamask;
