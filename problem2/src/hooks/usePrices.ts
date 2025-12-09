import { useQuery } from '@tanstack/react-query'
import { pricesService } from '../apis/services/prices.service'

const QUERY_KEYS = {
  prices: ['prices'] as const,
  pricesByCurrency: ['prices', 'by-currency'] as const,
  currencyPrice: (currency: string) => ['prices', 'currency', currency] as const,
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
