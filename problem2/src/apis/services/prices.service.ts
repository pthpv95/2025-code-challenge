const PRICES_API_URL = 'https://interview.switcheo.com/prices.json'

export interface Price {
  currency: string
  date: string
  price: number
}

export const pricesService = {
  /**
   * Fetch all cryptocurrency prices
   */
  getPrices: async (): Promise<Price[]> => {
    const response = await fetch(PRICES_API_URL)

    if (!response.ok) {
      throw new Error(`Failed to fetch prices: ${response.status}`)
    }

    return await response.json()
  },
}
