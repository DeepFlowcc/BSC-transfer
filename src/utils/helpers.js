export const formatBalance = (balance, decimals = 18) => {
  if (!balance) return '0';
  return parseFloat(balance) / Math.pow(10, decimals);
};

export const shortenAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatAmount = (amount) => {
  if (!amount) return '0';
  const num = parseFloat(amount);
  if (num < 0.001) return '<0.001';
  return num.toFixed(3);
};
