import { ethers } from 'hardhat';

const _metadataUri = 'https://gateway.pinata.cloud/ipfs/QmX2ubhtBPtYw75Wrpv6HLb1fhbJqxrnbhDo1RViW3oVoi';

async function deploy(name: string, ...params: string[]) {
    const contractFactory = await ethers.getContractFactory(name);
    const contract = await contractFactory.deploy(...params);
    return await contract.deployed();
}

async function main() {
    const [admin] = await ethers.getSigners();

    console.log(`Deploying a smart contract...`);

    const AVAXGods = (await deploy('AVAXGods', _metadataUri)).connect(admin);

    console.log({ AVAXGods: AVAXGods.address });
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
