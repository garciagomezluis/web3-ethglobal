/* eslint-disable import/no-extraneous-dependencies */
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat');

async function main() {
    // Hardhat always runs the compile task when running scripts with its command
    // line interface.
    //
    // If this script is run directly using `node` you may want to call compile
    // manually to make sure everything is compiled
    // await hre.run('compile');

    const [deployer] = await hre.ethers.getSigners();

    // We get the contract to deploy
    const LayeralizeNFTContract = await hre.ethers.getContractFactory('LayeralizeNFTContract');
    const layeralizeNFTContract = await LayeralizeNFTContract.deploy(
        'QmNa9Kcu2rHNCWTpD9sraLhHbxTEC6xjRRiqusDhwUwxtA',
        2,
    );

    await layeralizeNFTContract.deployed();

    console.log('LayeralizeNFTContract deployed to:', layeralizeNFTContract.address);

    const myBalance = await layeralizeNFTContract.balanceOf(deployer.address, 0);

    console.log(myBalance);

    const tokenUri = await layeralizeNFTContract.uri(0);

    console.log(tokenUri);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
