const PRICES_API_URL = 'https://interview.switcheo.com/prices.json'

export const pricesService = {
  /**
   * Fetch all cryptocurrency prices
   * @returns {Promise<Array<{currency: string, date: string, price: number}>>}
   */
  getPrices: async () => {
    const response = await fetch(PRICES_API_URL)

    if (!response.ok) {
      throw new Error(`Failed to fetch prices: ${response.status}`)
    }

    return await response.json()
  },
}
