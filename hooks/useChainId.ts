import { useProvider } from 'wagmi'

export const useChainId = () => {
  const provider = useProvider()
  return provider.network.chainId
}

export default useChainId
