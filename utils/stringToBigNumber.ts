import { BigNumber } from 'ethers'

export function removeLeadingZeros(number: String) {
  return number.replace(/^0+/, '')
}

export function toFixed(x: any) {
  if (Math.abs(x) < 1.0) {
    const e = parseInt(x.toString().split('e-')[1])
    if (e) {
      x *= Math.pow(10, e - 1)
      x = '0.' + new Array(e).join('0') + x.toString().substring(2)
    }
  } else {
    let e = parseInt(x.toString().split('+')[1])
    if (e > 20) {
      e -= 20
      x /= Math.pow(10, e)
      x += new Array(e + 1).join('0')
    }
  }
  return x
}

export function stringToBigNumber(float: string, decimals: number): BigNumber {
  let [left, right] = String(toFixed(float)).split('.')

  if (decimals < 0) {
    return BigNumber.from(left.substring(0, left.length + decimals))
  }

  right = (right ? right.substring(0, decimals) : '').padEnd(decimals, '0')

  return BigNumber.from(removeLeadingZeros(`${left}${right}`) || '0')
}

export default stringToBigNumber
