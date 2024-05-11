// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GasOptimizedNewsDelivery {

    address public immutable provider;
    address public immutable recipient;
    uint public deliveryCount;
    uint public immutable deliveryDelay;
    uint public immutable compensation;
    
    mapping(uint => bytes32) public newsHashes;

    event NewsDelivered(uint indexed deliveryIndex, bytes32 contentHash);

    constructor(address _recipient, uint _deliveryDelay, uint _compensation) {
        provider = msg.sender;
        recipient = _recipient;
        deliveryDelay = _deliveryDelay;
        compensation = _compensation;
    }

    function deliverNews(bytes32 _contentHash) external {
        require(msg.sender == provider, "Only provider can deliver news");
        require(block.timestamp >= deliveryDelay, "Delivery delay not passed");
        
        newsHashes[deliveryCount] = _contentHash;
        deliveryCount++;
        emit NewsDelivered(deliveryCount, _contentHash);
    }

    function getNews(uint _deliveryIndex) external view returns (bytes32) {
        require(_deliveryIndex < deliveryCount, "News not delivered yet");
        return newsHashes[_deliveryIndex];
    }

    function withdraw() external {
        require(msg.sender == recipient, "Only recipient can withdraw");
        (bool success, ) = recipient.call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }
}
