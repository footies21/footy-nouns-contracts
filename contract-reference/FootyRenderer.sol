// SPDX-License-Identifier: GPL-3.0

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

import "./Base64.sol";

pragma solidity ^0.8.0;

interface IFootyDescriptor {
    function palette(uint256 colorIndex) external view returns (string memory);

    function backgrounds(uint256 index) external view returns (string memory);

    function kits(uint256 index) external view returns (bytes memory);

    function heads(uint256 index) external view returns (bytes memory);

    function glasses(uint256 index) external view returns (bytes memory);

    function colorCount() external view returns (uint256);

    function backgroundCount() external view returns (uint256);

    function kitCount() external view returns (uint256);

    function headCount() external view returns (uint256);

    function glassesCount() external view returns (uint256);

    function addManyColorsToPalette(string[] calldata manyColors) external;

    function addManyBackgrounds(string[] calldata manyBackgrounds) external;

    function addManyKits(bytes[] calldata manyKits) external;

    function addManyHeads(bytes[] calldata manyHeads) external;

    function addManyGlasses(bytes[] calldata manyGlasses) external;
}

contract FootyRenderer {
    using Strings for uint256;
    struct NounData {
        uint256 head;
        uint256 kit;
        uint256 glasses;
    }

    // mapping(uint256 => uint256) public seeds;

    // function _saveSeed(uint256 tokenId) internal {
    //     seeds[tokenId] = uint256(
    //         keccak256(abi.encodePacked(blockhash(block.number - 1), tokenId))
    //     );
    // }

    function _render(uint256 tokenId, IFootyDescriptor descriptor)
        internal
        view
        returns (string memory)
    {
        NounData memory data = _generateNounData(tokenId, descriptor);

        string memory image = string(
            abi.encodePacked(
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges" width="256" height="256">'
                '<rect width="100%" height="100%" fill="',
                descriptor.backgrounds(tokenId % descriptor.backgroundCount()),
                '" />',
                _renderRects(descriptor.heads(data.head), descriptor),
                _renderRects(descriptor.kits(data.kit), descriptor),
                _renderRects(descriptor.glasses(data.glasses), descriptor),
                "</svg>"
            )
        );

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"image": "data:image/svg+xml;base64,',
                                Base64.encode(bytes(image)),
                                '", "name": "Footy Noun #',
                                tokenId.toString(),
                                '", "kit":"',
                                data.kit.toString(),
                                '", "head":"',
                                data.head.toString(),
                                '", "glasses":"',
                                data.glasses.toString(),
                                '"}'
                            )
                        )
                    )
                )
            );
    }

    function _renderRects(bytes memory data, IFootyDescriptor descriptor)
        private
        view
        returns (string memory)
    {
        string[32] memory lookup = [
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
            "17",
            "18",
            "19",
            "20",
            "21",
            "22",
            "23",
            "24",
            "25",
            "26",
            "27",
            "28",
            "29",
            "30",
            "31"
        ];

        string memory rects;
        uint256 drawIndex = 0;
        for (uint256 i = 0; i < data.length; i = i + 2) {
            uint8 runLength = uint8(data[i]); // we assume runLength of any non-transparent segment cannot exceed image width (32px)
            uint8 colorIndex = uint8(data[i + 1]);
            if (colorIndex != 0 && colorIndex != 1) {
                // transparent
                uint8 x = uint8(drawIndex % 32);
                uint8 y = uint8(drawIndex / 32);
                string memory color = "#000000";
                if (colorIndex > 1) {
                    color = descriptor.palette(colorIndex - 1);
                }
                rects = string(
                    abi.encodePacked(
                        rects,
                        '<rect width="',
                        lookup[runLength],
                        '" height="1" x="',
                        lookup[x],
                        '" y="',
                        lookup[y],
                        '" fill="',
                        color,
                        '" />'
                    )
                );
            }
            drawIndex += runLength;
        }

        return rects;
    }

    function _generateNounData(uint256 tokenId, IFootyDescriptor descriptor)
        private
        view
        returns (NounData memory)
    {
        uint256 seed = seeds[tokenId];
        return
            NounData({
                kit: tokenId % descriptor.kitCount(),
                head: (seed / 2) % descriptor.headCount(),
                glasses: (seed / 3) % descriptor.glassesCount()
            });
    }
}
