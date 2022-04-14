const hre = require("hardhat");

const main = async () => {
    const contractFatory = await hre.ethers.getContractFactory("ChickenNFT");
    const contract = await contractFatory.deploy();
    await contract.deployed();

    const [deployer] = await ethers.getSigners();
    console.log(`deployed to: ${contract.address}`);
    console.log(`deployed by: ${deployer.address}`);
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
