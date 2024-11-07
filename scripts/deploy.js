const hre = require("hardhat");

async function main() {
    const Voting = await hre.ethers.getContractFactory("Voting");
    const candidates = ['Larry', 'Curly', 'Moe'];
    const duration = 1;
    const token = await Voting.deploy(candidates, duration);

    console.log("Token deployed to:", token.target); // ethers v6.x uses 'target'
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
