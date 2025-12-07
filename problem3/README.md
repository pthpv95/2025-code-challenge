# Problem 3: WalletPage Component Refactoring

This document outlines the issues found in the original `WalletPage.tsx` pseudocode and explains the improvements made in `RefactorWalletPage.tsx`.

---

## Issues Found

### 1. Undefined Variable `lhsPriority` (Critical Bug)

**Location:** Line 38 in filter function

The code references `lhsPriority` which is never defined. It should be `balancePriority`.

```tsx
// ❌ Original (broken)
const balancePriority = getPriority(balance.blockchain);
if (lhsPriority > -99) { // lhsPriority doesn't exist!

// ✅ Fixed
const priority = getPriority(balance.blockchain);
if (priority > DEFAULT_PRIORITY) {
```

---

### 2. Inverted Filter Logic (Critical Bug)

The filter keeps balances where `amount <= 0`, which is backwards. You typically want balances with positive amounts.

```tsx
// ❌ Original (inverted logic)
if (balance.amount <= 0) {
  return true;
}

// ✅ Fixed
return priority > DEFAULT_PRIORITY && balance.amount > 0;
```

---

### 3. Missing `blockchain` Property in Interface

`WalletBalance` interface lacks `blockchain` property but it's accessed via `balance.blockchain`.

```tsx
// ❌ Original
interface WalletBalance {
  currency: string;
  amount: number;
}

// ✅ Fixed
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain;
}
```

---

### 4. `FormattedWalletBalance` Doesn't Extend `WalletBalance`

Redundant property declarations instead of proper inheritance.

```tsx
// ❌ Original (duplicated properties)
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

// ✅ Fixed (proper extension)
interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}
```

---

### 5. Sort Function Missing Return for Equal Case

The sort comparator doesn't return `0` when priorities are equal, leading to undefined behavior.

```tsx
// ❌ Original (missing return 0)
.sort((lhs, rhs) => {
  if (leftPriority > rightPriority) {
    return -1;
  } else if (rightPriority > leftPriority) {
    return 1;
  }
  // Missing: return 0;
});

// ✅ Fixed (simplified and complete)
.sort((lhs, rhs) => {
  return rightPriority - leftPriority; // Descending order
});
```

---

### 6. `formattedBalances` Created But Not Used

Line 56-61 creates `formattedBalances`, but `rows` maps over `sortedBalances` instead.

```tsx
// ❌ Original
const formattedBalances = sortedBalances.map(...); // Created but unused
const rows = sortedBalances.map(...); // Uses wrong variable

// ✅ Fixed
// Combined into single memoized computation
const formattedBalances = useMemo(() => {
  return balances.filter(...).sort(...).map(...);
}, [balances]);

const rows = useMemo(() => {
  return formattedBalances.map(...);
}, [formattedBalances, prices]);
```

---

### 7. Incorrect `useMemo` Dependencies

- `prices` is in the dependency array but not used in the computation
- `getPriority` is recreated every render but used inside `useMemo`

```tsx
// ❌ Original
const sortedBalances = useMemo(() => {
  // ... doesn't use prices
}, [balances, prices]); // prices is unnecessary here

// ✅ Fixed
// getPriority moved outside component (stable reference)
// Dependencies correctly reflect actual usage
const formattedBalances = useMemo(() => {...}, [balances]);
const rows = useMemo(() => {...}, [formattedBalances, prices]);
```

---

### 8. Using Array Index as React Key

Using `index` as key is problematic when lists can be reordered or filtered.

```tsx
// ❌ Original
key={index}

// ✅ Fixed (stable unique identifier)
key={`${balance.blockchain}-${balance.currency}`}
```

---

### 9. `getPriority` Uses `any` Type

Defeats TypeScript's purpose. Should use a proper blockchain type.

```tsx
// ❌ Original
const getPriority = (blockchain: any): number => {...}

// ✅ Fixed
type Blockchain = "Osmosis" | "Ethereum" | "Arbitrum" | "Zilliqa" | "Neo";
const getPriority = (blockchain: Blockchain): number => {...}
```

---

### 10. `children` Destructured But Never Used

Extracted from props but never rendered.

```tsx
// ❌ Original
const { children, ...rest } = props;
return <div {...rest}>{rows}</div>; // children not rendered

// ✅ Fixed
return (
  <div {...rest}>
    {children}
    {rows}
  </div>
);
```

---

## Summary Table

| Issue | Original | Fixed |
|-------|----------|-------|
| Undefined variable | `lhsPriority` | `priority` (correctly defined) |
| Filter logic | Kept `amount <= 0` | Keep `amount > 0` |
| Missing interface property | No `blockchain` | Added `blockchain: Blockchain` |
| Interface inheritance | Duplicated properties | `extends WalletBalance` |
| Sort return | Missing `return 0` | `return rightPriority - leftPriority` |
| Unused variable | `formattedBalances` created but unused | Combined into single memo |
| useMemo dependencies | Included unused `prices` | Removed `prices`, split concerns |
| React key | `index` | `${blockchain}-${currency}` |
| Type safety | `any` | `Blockchain` union type |
| `getPriority` location | Inside component (recreated) | Outside component (stable) |
| `children` | Destructured but not rendered | Now rendered |

---

## Files

- `WalletPage.tsx` - Original pseudocode with issues
- `RefactorWalletPage.tsx` - Refactored version with all fixes applied

