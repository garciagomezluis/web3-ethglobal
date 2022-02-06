//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

/*
Contract metadata, https://jsonkeeper.com/b/AI9L

{
  "name": "LayeralizeNFTContract",
  "description": "Layeralize lets you build your ERC1155 NFT collection by overlapping layers. Images and metadata is stored on IPFS. Contract metadata is stored on centralized service. Project to illustrate a proof of concept for the ETHGLOBAL hackathon.",
  "image": "https://web3.ethglobal.com/assets/images/ethglobal.svg",
  "external_link": "https://github.com/garciagomezluis/web3-ethglobal"
}
*/

contract LayeralizeNFTContract is ERC1155 {

    string private constant _IPFS = "ipfs://";
    string private constant _METADATA = "/metadata/{id}.json";

    constructor(string memory ipfsCID, uint256 amount) ERC1155(string(abi.encodePacked(_IPFS, ipfsCID, _METADATA))) {

        uint256[] memory ids = new uint256[](amount);
        uint256[] memory amounts = new uint256[](amount);

        for(uint256 i = 0; i < amount; i++) {
            ids[i] = i;
            amounts[i] = 1;
        }

        _mintBatch(msg.sender, ids, amounts, "");
    }

    function contractURI() public pure returns (string memory) {
        return "https://jsonkeeper.com/b/AI9L";
    }

}
