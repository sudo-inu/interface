import { useBlockNumber } from 'wagmi'

export const useBlock = () => {
  const { data: block } = useBlockNumber({ watch: true })
  return block
}

export default useBlock
