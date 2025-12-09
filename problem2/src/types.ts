export interface Token {
  symbol: string;
  name: string;
  price: number;
  iconUrl: string;
}

export interface SwapFormData {
  fromAmount: string;
  toAmount: string;
}
