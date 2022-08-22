export const ZERO_X_BASE_URL = 'https://api.0x.org/swap/v1'

export const get0xPrice = async (tokenAddress: string, amount: string) => {
  const response = await fetch(
    `${ZERO_X_BASE_URL}/price?buyToken=WETH&sellToken=${tokenAddress}&sellAmount=${amount}`
  )
  const json = await response.json()

  return json
}

export default get0xPrice
