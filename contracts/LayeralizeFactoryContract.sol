//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./LayeralizeNFTContract.sol";

contract LayeralizeFactoryContract  {

    LayeralizeNFTContract[] public collections;

    function createCollection(string memory ipfsCID, uint256 amount) public {
        LayeralizeNFTContract collection = new LayeralizeNFTContract(ipfsCID, amount, msg.sender);

        collections.push(collection);
    }

}
