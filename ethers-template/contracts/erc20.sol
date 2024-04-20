// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingSystem {
    // Structure to represent a candidate
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    // Mapping to store candidates
    mapping(uint256 => Candidate) public candidates;

    // Mapping to track whether an address has voted
    mapping(address => bool) public hasVoted;

    // Event to log each vote
    event Voted(address indexed voter, uint256 candidateId);

    // Constructor to initialize candidates
    constructor(string[] memory _candidateNames) {
        for (uint256 i = 0; i < _candidateNames.length; i++) {
            candidates[i] = Candidate({name: _candidateNames[i], voteCount: 0});
        }
    }

    // Function to vote for a candidate
    function vote(uint256 _candidateId) external {
        require(!hasVoted[msg.sender], "You have already voted.");
        require(_candidateId < getCandidateCount(), "Invalid candidate ID.");

        candidates[_candidateId].voteCount++;
        hasVoted[msg.sender] = true;

        emit Voted(msg.sender, _candidateId);
    }

    // Function to get the total number of candidates
    function getCandidateCount() public view returns (uint256) {
        return candidates.length;
    }

    // Function to get the name and vote count of a candidate
    function getCandidate(uint256 _candidateId)
        public
        view
        returns (string memory, uint256)
    {
        require(_candidateId < getCandidateCount(), "Invalid candidate ID.");

        Candidate memory candidate = candidates[_candidateId];
        return (candidate.name, candidate.voteCount);
    }
}
