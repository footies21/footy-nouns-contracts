// SPDX-License-Identifier: GPL-3.0

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IFootyNouns is IERC721 {}

pragma solidity ^0.8.0;

contract FootySquads is Ownable {
    IFootyNouns public tokenContract;

    mapping(address => uint256[]) public squads;

    uint256 public SQUAD_SIZE = 3;
    bool public VALIDATE_POSITIONS = true;

    constructor(IFootyNouns _tokenContract) {
        tokenContract = _tokenContract;
    }

    function toggleValidatePosition() external onlyOwner {
        VALIDATE_POSITIONS = !VALIDATE_POSITIONS;
    }

    function setSquadSize(uint256 newSquadSize) external onlyOwner {
        SQUAD_SIZE = newSquadSize;
    }

    function setSquad(uint256[] memory tokenIds) external {
        // receive an array of footies, captain first
        require(tokenIds.length == SQUAD_SIZE, "squad is incorrect size");
        // require each owned by msg.sender
        // require the right positions

        // bool hasDefender = false;
        // bool hasMidfielder = false;
        // bool hasAttacker = false;

        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(
                tokenContract.ownerOf(tokenIds[i]) == msg.sender,
                "not owner of token"
            );
            // tokenSeed = sdlfsdfs
            // if tokenSeed.position = defender position
            // set hasDefender = true
            // if tokenSeed.position = mid position
            // set hasMidfielder= true
            // if tokenSeed.position = attacker position
            // set hasAttacker = true
        }

        // require(hasDefender == true, "no defender included");
        // require(hasMidfielder == true, "no midfielder included");
        // require(hasAttacker == true, "no attacked included");

        squads[msg.sender] = tokenIds;
    }

    function getSquad(address _address)
        external
        view
        returns (uint256[] memory tokenIds)
    {
        return squads[_address];
    }
}
