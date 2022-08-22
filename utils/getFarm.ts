import pools, { Pool } from 'constants/pools'

const getFarm = (pid: number | string): Pool | undefined => {
  const farm = pools.find((farm) => farm.pid === Number(pid))
  return farm
}

export default getFarm
