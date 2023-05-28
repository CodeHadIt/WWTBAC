const { network, run } = require("hardhat");
const { verify } = require("../Utils/verify");

async function main() {
  const managerContractFactory = await ethers.getContractFactory("ManagerContract");
  const managerContract = await managerContractFactory.deploy();
  await managerContract.deployed();
  console.log(`our manager contract has been deployed to: ${managerContract.address}`);

  const cryptonaireContractFactory = await ethers.getContractFactory("WWTBAC")
  const cryptonaireContract = await cryptonaireContractFactory.deploy(managerContract.address);
  await cryptonaireContract.deployed();
  console.log(`Gaming contract has been deployed to: ${cryptonaireContract.address}`);

  const settingTokenAddress = await managerContract.setMyTokenAddress(cryptonaireContract.address);
  
  console.log(`setting token address ... ${settingTokenAddress.hash}`);

  if(network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY){
    console.log("... waiting for block confirmations to verify manager")
    await managerContract.deployTransaction.wait(5);
    await verify(managerContract.address, []);

    console.log("Waiting for blockConfirmations to verify Token contract")
    await cryptonaireContract.deployTransaction.wait(5);
    await verify(cryptonaireContract.address, []);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});