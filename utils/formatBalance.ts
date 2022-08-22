import BigNumber from 'bignumber.js'

export const getBalanceNumber = (balance: BigNumber, decimals = 18) => {
  const displayBalance = balance.dividedBy(new BigNumber(10).pow(decimals))

  if (
    displayBalance.gte(new BigNumber(10).pow(50)) ||
    displayBalance.lte(new BigNumber(10).div(new BigNumber(10).pow(50)))
  ) {
    return 0
  }

  return displayBalance.toNumber()
}

export const getDisplayBalance = (balance: BigNumber, decimals = 18) => {
  const displayBalance = balance.dividedBy(new BigNumber(10).pow(decimals))
  if (displayBalance.lt(1)) {
    return displayBalance.toPrecision(4)
  } else {
    return displayBalance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
}

export const getFullDisplayBalance = (balance: BigNumber, decimals = 18) => {
  const display = balance.dividedBy(new BigNumber(10).pow(decimals)).toFixed()

  return display.length > 14
    ? display.substring(0, display.length - 5) + '0000'
    : display
}
