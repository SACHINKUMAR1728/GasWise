// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// News Contract: Allows users to publish news articles with optimized gas usage.
contract News{
    struct Article {
        address author;
        string title;
        string content;
        uint256 timestamp;
    }

    // Use a more efficient array-based storage for articles
    Article[] private articles;


    event ArticlePublished(uint256 indexed id, address indexed author, string title);

    // Optimized publishArticle function
    function publishArticle(string memory _title, string memory _content) external {
        require(bytes(_title).length > 0, "Title required");
        require(bytes(_content).length > 0, "Content required");

        articles.push(Article(msg.sender, _title, _content, block.timestamp));
        emit ArticlePublished(articles.length - 1, msg.sender, _title);
    }

    // Optimized getArticle function using memory for struct
    function getArticle(uint256 _id) external view returns (address, string memory, string memory, uint256) {
        require(_id < articles.length, "Article does not exist");
        Article memory article = articles[_id];
        return (article.author, article.title, article.content, article.timestamp);
    }

    // Optimized getTotalArticles function
    function getTotalArticles() external view returns (uint256) {
        return articles.length;
    }
}