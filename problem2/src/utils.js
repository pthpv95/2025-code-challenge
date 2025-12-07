const formatCurrency = (amount, decimals = 4) => {
  const formatted = amount.toFixed(decimals);
  // Remove trailing zeros and decimal point if all zeros are removed
  // Matches: .0000 or .5000 (removes trailing zeros after last non-zero digit)
  return parseFloat(formatted).toString();
};

const getTokenIconUrl = (token) => {
  return `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${token}.svg`;
};

export { formatCurrency, getTokenIconUrl };