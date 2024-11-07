// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    Candidate[] private candidates;
    address owner;  //person who in charge of the ballot
    mapping(address => bool) public voters;//check wether or not the voter voted

    uint256 public votingStart;
    uint256 public votingEnd;
    uint256 public timeRemaining;
    uint256 public lastUpdateTimestamp;
  //construct a new ballot
  constructor(string[] memory _candidateNames, uint256 _durationInMinutes) {
    for (uint256 i = 0; i < _candidateNames.length; i++) {
        candidates.push(Candidate({
            name: _candidateNames[i],
            voteCount: 0
        }));
    }
    owner = msg.sender;
    votingStart = block.timestamp;
    votingEnd = block.timestamp + (_durationInMinutes * 1 minutes);
    timeRemaining = votingEnd - votingStart;
  }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    // for editing the candaidate list, and only the owner can do it
    function addCandidate(string memory _name) public onlyOwner {
        candidates.push(Candidate({
                name: _name,
                voteCount: 0
        }));
    }

    function getCandidates() public view returns (string[] memory){
      string[] memory candidateList = new string[](candidates.length);
      for(uint i = 0; i < candidates.length; i++) {
        candidateList[i] = candidates[i].name;
      }
      return candidateList;
    }

   function updateTimestamp() public {
        lastUpdateTimestamp = block.timestamp;
    }

    function vote(uint256 _candidateIndex) public {
        require(!voters[msg.sender], "You have already voted.");
        require(_candidateIndex < candidates.length, "Invalid candidate.");

        candidates[_candidateIndex].voteCount++;
        voters[msg.sender] = true;
    }

    function getAllVotesOfCandiates() public view returns (Candidate[] memory) {
        Candidate[] memory result = new Candidate[](candidates.length);
        bool votingEnded = (block.timestamp >= votingEnd);

        for (uint i = 0; i < candidates.length; i++) {
            result[i].name = candidates[i].name;
            if (votingEnded) {
                result[i].voteCount = candidates[i].voteCount;
            } else {
                result[i].voteCount = 0;
            }
        }

        return result;
    }

    function getVotingStatus() public view returns (bool) {
        return (block.timestamp >= votingStart && block.timestamp < votingEnd);
    }

    function getRemainingTime() public returns (uint256) {
        require(block.timestamp >= votingStart, "Voting has not started yet.");
        if (block.timestamp >= votingEnd) {
            return 0;
        }
        timeRemaining = votingEnd - block.timestamp;
        return timeRemaining;
    }
}
