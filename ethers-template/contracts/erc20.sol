// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NewsReportingSystem {
    struct Reporter {
        string name;
        string email;
        string phone;
        uint[] newsIds;
    }
    struct News {
        string title;
        string content;
        address reporterAddress;
    }
    mapping(address => Reporter) reporters;
    mapping(address => mapping(address => bool)) followingReporters;
    mapping(address => bool) private isReporter;
    News[] public newsList;
    function isReporters(address _address) external view returns (bool) {
        return isReporter[_address];
    }
    function becomeReporter(string memory _name, string memory _email, string memory _phone) external {
        require(!isReporter[msg.sender], "!reporter");
        isReporter[msg.sender] = true;
        reporters[msg.sender] = Reporter(_name, _email, _phone, new uint[](0));
    }
    function followReporter(address _reporterAddress) external {
        require(isReporter[_reporterAddress], "reporter !exists");
        followingReporters[msg.sender][_reporterAddress] = true;
    }
    function addNews(string memory _title, string memory _content) external {
        require(isReporter[msg.sender], "!reporter");
        newsList.push(News(_title, _content, msg.sender));
        reporters[msg.sender].newsIds.push(newsList.length - 1);
    }
    function getFollowingReporters(address _userAddress) external view returns(address[] memory) {
        address[] memory following = new address[](0);
        for (uint i = 0; i < newsList.length; i++) {
            address reporterAddress = newsList[i].reporterAddress;
            if (followingReporters[_userAddress][reporterAddress]) {
                following = push(following, reporterAddress);
            }
        }
        return following;
    }
    function push(address[] memory array, address item) internal pure returns (address[] memory) {
        address[] memory newArray = new address[](array.length + 1);
        for (uint i = 0; i < array.length; i++) {
            newArray[i] = array[i];
        }
         newArray[array.length] = item;
        return newArray;
    }
}