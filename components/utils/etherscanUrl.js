export const etherscanUrl = (chainId, transactionHash) => {
  switch (chainId) {
    case 3:
      return `https://ropsten.etherscan.io/tx/${transactionHash}`;
    case 4:
      return `https://rinkeby.etherscan.io/tx/${transactionHash}`;
    case 137:
      return `https://polygonscan.com/tx/${transactionHash}`;
    default:
      return null;
  }
};
