//import detectEthereumProvider from "@metamask/detect-provider" as detect

// Connect to the local Hardhat blockchain
const web3 = new Web3('http://127.0.0.1:8545');

// Replace this ABI with the ABI from the compiled contract (artifacts)
const abi = [
    {
      "inputs": [
        {
          "internalType": "string[]",
          "name": "_candidateNames",
          "type": "string[]"
        },
        {
          "internalType": "uint256",
          "name": "_durationInMinutes",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        }
      ],
      "name": "addCandidate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllVotesOfCandiates",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "voteCount",
              "type": "uint256"
            }
          ],
          "internalType": "struct Voting.Candidate[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getCandidates",
      "outputs": [
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getRemainingTime",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getVotingStatus",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "lastUpdateTimestamp",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "timeRemaining",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "updateTimestamp",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_candidateIndex",
          "type": "uint256"
        }
      ],
      "name": "vote",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "voters",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "votingEnd",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "votingStart",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }

];

// Replace with your deployed contract address
const contractAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3';
const contract = new web3.eth.Contract(abi, contractAddress);


window.onload = loadCandidates();

async function loadCandidates() {
  const votingEnd = await contract.methods.votingEnd().call();
  const currentTime = Math.floor(Date.now() / 1000);
  let timeLeft = parseInt(votingEnd) - currentTime;
  console.log(timeLeft);
  if(timeLeft > 0) {
    const candidates = await contract.methods.getCandidates().call();
    for (let i = 0; i < candidates.length; i++) {
      const candidateDiv = document.createElement("div");
      candidateDiv.className = "candidate";
      candidateDiv.innerHTML = `
        <span>${candidates[i]}</span>
        <button onclick="vote(${i})">Vote</button>
      `;
      candidateList.appendChild(candidateDiv);
    }
    updateTime(timeLeft);
  } else {
    const accounts = await web3.eth.getAccounts();
    await contract.methods.updateTimestamp().send({ from: accounts[0] });
    const candidates = await contract.methods.getAllVotesOfCandiates().call();
    for (let i = 0; i < candidates.length; i++) {
      const candidateDiv = document.createElement("div");
      candidateDiv.className = "candidate";
      candidateDiv.innerHTML = `
        <span>${candidates[i].name}</span>
        <span>${candidates[i].voteCount}</span>
      `;
      candidateList.appendChild(candidateDiv);
    }
    document.getElementById("time").innerHTML = `Voting has ended`;
  }
}

async function updateTime(timeLeft) {
  setInterval( async function() {
      document.getElementById("time").innerHTML = `Remaining Time: ${timeLeft}`;
      timeLeft -= 1;
      if(timeLeft < 0) {
        location.reload();
        clearInterval(this);
        console.log("work?");
      }
    }
  , 1000);
}

async function showAdminTools() {
     const accounts = await web3.eth.getAccounts();
     const admin = accounts[0];
     const addCandidateDiv = document.createElement("div");
       addCandidateDiv.className = "addCandidate";
       addCandidateDiv.innerHTML = `
        <input type="text" id="newCandidate" placeholder="Enter New Candidate">
        <button onclick="addNewCandidate()">Add Candidate</button>
      `;
     adminTools.appendChild(addCandidateDiv);
     const reloadDiv = document.createElement("div");
       reloadDiv.className = "reload";
       reloadDiv.innerHTML = `
        <button onclick="refreshPage()">Reload</button>
      `;
     adminTools.appendChild(reloadDiv);
}

async function refreshPage() {
  location.reload();
}

async function addNewCandidate() {
     const candidate = document.getElementById("newCandidate").value;
     const accounts = await web3.eth.getAccounts();
     await contract.methods.addCandidate(candidate).send({ from: accounts[0] });
}

async function vote(candidateIndex) {
  const accounts = await web3.eth.getAccounts();
  const voter = accounts[0];

  try {
     await contract.methods.vote(candidateIndex).send({ from: voter });
     document.getElementById("message").innerHTML = "Vote successful!";
  } catch (error) {
     const errorMessage = error.data ? error.data.message : error.message;
     document.getElementById("message").innerHTML = "Error voting: " + error;
  }
}


async function getResults() {
  if(getTimeRemaining() > 0) {
    return;
  } else {
     const candidates = await contract.methods.getAllVotesOfCandiates().call();
     for (let i = 0; i < candidates.length; i++) {
       //const candidate = await contract.methods.candidates(i).call();
       const candidateDiv = document.createElement("div");
       candidateDiv.className = "candidate";
       candidateDiv.innerHTML = `
         <span>${candidates[i].name}</span>
         <span>${candidates[i].voteCount}</span>
      `;
       candidateList.appendChild(candidateDiv);
    }
  }

}
//////////////////////////////////

//Connect to metamask

async function connectMetamask() {
  if (typeof window.ethereum !== "undefined") {
    console.log("MetaMask is installed!");

    // Request Metamask to connect
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    // Get current Ethereum account address
    const account = await web3.eth.getAccounts();
    const currentAccount = account[0];
    document.getElementById("connection").innerHTML = "Connected with: " + currentAccount;

  } else {
    document.getElementById("connection").innerHTML ="MetaMask is NOT installed!";
  }
}

