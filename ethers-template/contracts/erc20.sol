// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

struct Reporter {
    string name;
    string email;
    string phone;
}

struct NewsItem {
    string title;
    string content;
    address reporter;
}

contract News {
    mapping(address => Reporter) public reporters;
    NewsItem[] public news;

    event ReporterAdded(address indexed reporterAddress, string name, string email, string phone);
    event NewsAdded(address indexed reporter, string title, string content);
    event ReporterDeleted(address indexed reporterAddress);
    event NewsDeleted(uint256 indexed newsId);
    event ReporterUpdated(address indexed reporterAddress, string name, string email, string phone);

    function addReporter(string memory _name, string memory _email, string memory _phone) external {
        require(bytes(reporters[msg.sender].name).length == 0, "Reporter exists");
        reporters[msg.sender] = Reporter(_name, _email, _phone);
        emit ReporterAdded(msg.sender, _name, _email, _phone);
    }

    function addNews(string memory _title, string memory _content) external {
        Reporter storage reporter = reporters[msg.sender];
        require(bytes(reporter.name).length != 0, "Register first");
        news.push(NewsItem(_title, _content, msg.sender));
        emit NewsAdded(msg.sender, _title, _content);
    }

    function getReporters() external view returns (Reporter[] memory) {
        Reporter[] memory result = new Reporter[](news.length);
        for (uint256 i = 0; i < news.length; i++) {
            result[i] = reporters[news[i].reporter];
        }
        return result;
    }

    function getLatestNews() external view returns (NewsItem[] memory) {
        return news;
    }

    function getReporterInfo(address _reporter) external view returns (Reporter memory) {
        return reporters[_reporter];
    }

    function deleteReporter() external {
        delete reporters[msg.sender];
        emit ReporterDeleted(msg.sender);
    }

    function deleteNews(uint256 _newsId) external {
        require(_newsId < news.length, "Invalid news ID");
        require(news[_newsId].reporter == msg.sender, "Not authorized to delete news");

        delete news[_newsId];
        emit NewsDeleted(_newsId);
    }

    function updateReporterInfo(string memory _name, string memory _email, string memory _phone) external {
        require(bytes(reporters[msg.sender].name).length != 0, "Reporter does not exist");
        reporters[msg.sender].name = _name;
        reporters[msg.sender].email = _email;
        reporters[msg.sender].phone = _phone;
        emit ReporterUpdated(msg.sender, _name, _email, _phone);
    }
}