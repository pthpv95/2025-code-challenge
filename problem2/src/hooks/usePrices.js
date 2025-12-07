import { useQuery } from '@tanstack/react-query'
import { pricesService } from '../apis/services/prices.service'

const QUERY_KEYS = {
  prices: ['prices'],
  pricesByCurrency: ['prices', 'by-currency'],
  currencyPrice: (currency) => ['prices', 'currency', currency],
}

/**
 * Hook to fetch all cryptocurrency prices
 */
export const usePrices = () => {
  return useQuery({
    queryKey: QUERY_KEYS.prices,
    queryFn: pricesService.getPrices,
    refetchInterval: 10 * 1000, // 10 seconds
  })
}
