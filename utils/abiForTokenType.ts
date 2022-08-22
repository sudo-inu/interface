import { erc20ABI, erc721ABI } from 'wagmi'

import { WETHAbi } from 'constants/abi'
import { TokenType } from 'constants/pools'

export const abiForTokenType = (tokenType: TokenType | undefined) => {
  if (tokenType == TokenType.ERC20) {
    return erc20ABI
  } else if (tokenType == TokenType.ERC721) {
    return erc721ABI
  }
  return WETHAbi
}

export default abiForTokenType
