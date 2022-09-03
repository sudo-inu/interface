import axios from 'axios'

const floorPrices: { [slug: string]: string } = {}
const lastSearches: { [slug: string]: Number } = {}

export async function getOpenseaPrice(slug: string): Promise<string> {
  const lastSearch = lastSearches[slug]
  const cutoffTime = new Date().getTime() - 15 * 60 * 1000

  if (!lastSearch || lastSearch < cutoffTime) {
    lastSearches[slug] = new Date().getTime()

    const url = `https://api.opensea.io/api/v1/collection/${slug}/stats`
    const response = await axios.get(url)

    floorPrices[slug] = response.data.stats.floor_price
  }

  return floorPrices[slug]
}

export default getOpenseaPrice
