const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ChickenNFT", () => {
    it("Should mint and transfer an NFT to someone", async () => {
        const contractFactory = await ethers.getContractFactory("ChickenNFT");
        const contract = await contractFactory.deploy();
        await contract.deployed();

        const [deployer, randomPerson] = await ethers.getSigners();

        const NFT_PATH = "test.png";

        // balance before minting
        expect(await contract.balanceOf(randomPerson.address)).to.equal(0);

        // mint an NFT
        await contract
            .payMint(randomPerson.address, NFT_PATH, {
                value: ethers.utils.parseEther("0.001"),
            })
            .then((txn) => txn.wait());

        // balance after minting
        expect(await contract.balanceOf(randomPerson.address)).to.equal(1);

        // should own NFT
        expect(await contract.isContentOwned(NFT_PATH)).to.equal(true);
    });
});
