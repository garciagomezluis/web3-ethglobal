/* eslint-disable import/no-extraneous-dependencies */
const hre = require('hardhat');

const main = async () => {
    const LayeralizeNFTContract = await hre.ethers.getContractFactory('LayeralizeNFTContract');
    const layeralizeNFTContract = await LayeralizeNFTContract.deploy(
        'QmcgbiEDANTcSxyS27wtoFybuJXRcaMWxsTJV7SBQ4a6JG',
        21,
    );

    await layeralizeNFTContract.deployed();

    console.log('LayeralizeNFTContract deployed to:', layeralizeNFTContract.address);
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();
