// Define blockchain type for type safety
type Blockchain = "Osmosis" | "Ethereum" | "Arbitrum" | "Zilliqa" | "Neo";

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain; // Added missing property
}

// Properly extend WalletBalance
interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

// Priority map outside component - no recreation on each render
const BLOCKCHAIN_PRIORITIES: Record<Blockchain, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

const DEFAULT_PRIORITY = -99;

// Move getPriority function outside component to avoid re-creation on each render
const getPriority = (blockchain: Blockchain): number => {
  return BLOCKCHAIN_PRIORITIES[blockchain] ?? DEFAULT_PRIORITY;
};

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // Memoize sorted and formatted balances together
  const formattedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const priority = getPriority(balance.blockchain);
        // Fixed: Check priority AND keep positive amounts
        return priority > DEFAULT_PRIORITY && balance.amount > 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        // Fixed: Proper comparator with all return cases
        return rightPriority - leftPriority; // Descending order
      })
      .map(
        (balance: WalletBalance): FormattedWalletBalance => ({
          ...balance,
          formatted: balance.amount.toFixed(2), // Added decimal places for currency
        })
      );
  }, [balances]); // Removed unused `prices` dependency

  // Separate rows computation - uses prices so it's separate
  const rows = useMemo(() => {
    return formattedBalances.map((balance: FormattedWalletBalance) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={`${balance.blockchain}-${balance.currency}`} // Stable unique key
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    });
  }, [formattedBalances, prices]);

  return (
    <div {...rest}>
      {children}
      {rows}
    </div>
  );
};

export default WalletPage;
