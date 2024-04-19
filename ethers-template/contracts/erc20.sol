// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract News {
    struct Reporter {
        string name;
        string email;
        string phone;
        uint256[] newsIds;
    }
    
    struct NewsItem {
        string title;
        string content;
        address reporterAddress;
    }
    
    mapping(address => Reporter) public reporters;
    NewsItem[] public newsList;
    
    // Function to add a new reporter
    function addReporter(string memory _name, string memory _email, string memory _phone) external {
        require(bytes(reporters[msg.sender].name).length == 0, "Reporter already exists");
        reporters[msg.sender] = Reporter(_name, _email, _phone, new uint256[](0));
    }
    
    // Function to add news linked to a reporter
    function addNews(string memory _title, string memory _content) external {
        Reporter storage reporter = reporters[msg.sender];
        require(bytes(reporter.name).length != 0, "Reporter not registered");
        newsList.push(NewsItem(_title, _content, msg.sender));
        reporter.newsIds.push(newsList.length - 1);
    }
    
    // Function to get the list of reporters
    function getReporters() external view returns (Reporter[] memory) {
        Reporter[] memory result = new Reporter[](newsList.length);
        for (uint256 i = 0; i < newsList.length; i++) {
            address reporterAddress = newsList[i].reporterAddress;
            result[i] = reporters[reporterAddress];
        }
        return result;
    }
    
    // Function to get the list of latest news
    function getLatestNews() external view returns (NewsItem[] memory) {
        return newsList;
    }
    
    // Function to get information about a specific reporter
    function getReporterInfo(address _reporterAddress) external view returns (Reporter memory) {
        return reporters[_reporterAddress];
    }
}
