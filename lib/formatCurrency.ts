export const formatCurrency = (amount: number, currencyCode = 'USD') => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode.toUpperCase(),
    }).format(amount);
  } catch (e) {
    console.error('Invalid currency code: ', currencyCode, e)
    return `${currencyCode.toUpperCase()} ${amount.toFixed(2)}`
  }
}
