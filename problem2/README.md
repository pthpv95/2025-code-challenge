# Token Swap Application ⚡

A modern, feature-rich token swap interface built with React, featuring real-time price updates, comprehensive form validation, fully mobile-responsive and a **blazing fast** user experience.

![Swap Form](https://img.shields.io/badge/React-19.2.0-blue)
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-Latest-red)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-Latest-orange)
![Performance](https://img.shields.io/badge/Performance-Blazing_Fast-brightgreen)

## 🚀 Live Demo

**[Try it now →](https://mono-swap.hp95.workers.dev/)**

Experience the blazing fast swap interface with real-time price updates and instant feedback!

## Features - Built for Exceptional UX

### 🌟 **Standout UX Features**

#### URL State Persistence
**Never lose your swap configuration again!** Every field is automatically saved to the URL:
- 🔗 **Bookmarkable**: Save your favorite swap pairs as browser bookmarks
- 🔄 **Refresh-Proof**: Reload the page without losing any data
- 📤 **Shareable**: Send exact swap configurations to others via URL
- ⬅️ **Navigation Support**: Browser back/forward buttons work perfectly

**Example URL:**
```
https://mono-swap.hp95.workers.dev/?from=USDT&to=ETH&fromAmount=100&toAmount=0.0608
```

#### Swap Direction Reversal
**Compare rates instantly in both directions!** The swap arrow button provides:
- ⚡ **One-Click Flip**: Reverse buy/sell positions instantly
- 🔢 **Auto-Recalculation**: Amounts adjust correctly for new direction
- 🎯 **Perfect for Comparison**: See if you get better rates going the other way
- ✨ **Smooth Animation**: Satisfying 180° rotation feedback

## Core Features

### 🎨 **Modern UI/UX** - Designed for Excellence
- **Blazing Fast Interactions**: Instant response to user actions
- **Intuitive Swap Direction Control**: Flip between buy/sell with one click
- **URL State Persistence**: Bookmark and share exact swap configurations
- Clean, gradient-based design with smooth animations
- Glass-morphism effects with backdrop blur
- Responsive layout that works on all devices
- Interactive hover states and transitions
- Loading spinners and success notifications

### 💱 **Smart Token Swapping** - Best-in-Class UX
- **Bidirectional Conversion**: Enter amount in either field, the other calculates automatically
- **Instant Swap Direction Reversal**: One-click button to flip buy/sell positions
- **Live Price Updates**: Prices refresh every 10 seconds from API
- **Rate Display**: Toggle between direct and inverse exchange rates
- **Token Selection Modal**: Beautiful modal with search functionality
- **URL Persistence**: Every swap configuration is stored in the URL for easy bookmarking

### 📊 **Real-Time Data**
- Integration with Switcheo API for live cryptocurrency prices
- TanStack Query for efficient data fetching and caching
- Support for 30+ cryptocurrencies
- Automatic cache invalidation and refetching

### ✅ **Comprehensive Validation**
- **Required Fields**: All amounts must be entered
- **Numeric Validation**: Only valid numbers accepted
- **Positive Values**: Amounts must be greater than 0
- **Token Selection**: Must select a token before entering buy amount
- **Real-time Feedback**: Errors appear instantly as you type
- **Form-level Validation**: Submit button validates entire form

### 🎯 **Smart Auto-Calculations**

#### When entering "Sell" amount:
- If buy token is selected → Automatically calculates buy amount
- If no token selected → Shows error on buy field

#### When entering "Buy" amount:
- Must select token first (enforced by validation)
- Automatically calculates sell amount based on selected token price

#### When selecting a token:
- If sell amount exists → Calculates buy amount
- If buy amount exists → Recalculates sell amount
- Clears all related errors automatically

### 🔄 **Swap Direction Switching** (Excellent UX!)
One of the standout UX features - users can instantly reverse the swap direction:
- **One-Click Reversal**: Click the swap arrow to flip from/to positions
- **Maintains Context**: All amounts and tokens swap positions
- **Smooth Animation**: Satisfying 180° rotation animation
- **Recalculates Instantly**: Amounts automatically adjust to new direction
- **No Data Loss**: Perfect for comparing rates in both directions

**Example:**
```
Before: 100 USDT → 0.0608 ETH
[Click ↕ arrow]
After:  0.0608 ETH → 100 USDT
```

### 📝 **Reusable Components**

#### **TokenInput**
- Standalone, reusable input component
- Props: label, value, onChange, error, selectedToken, onTokenClick
- Built-in error display with animations
- Support for disabled/readonly states

#### **TokenSelectModal**
- Full-featured token selection modal
- Real-time search/filter functionality
- Visual feedback for selected token
- Keyboard navigation (ESC to close)
- Click outside to dismiss

### 🚀 **Loading & Success States**
- **2-second simulated processing** on swap submission
- Loading spinner with "Processing..." text
- Button disabled during processing
- **Success notification** with checkmark icon
- Auto-clears form after successful swap
- Success message auto-dismisses after 3 seconds

### 🎨 **Visual Feedback**
- Input fields glow on focus
- Error states show red borders and messages
- Success states show green notification
- Hover effects on all interactive elements
- Smooth transitions between states

## Architecture

### API Layer (`src/apis/`)
```
apis/
├── client.js           # Base HTTP client
├── queryClient.js      # TanStack Query configuration
├── services/
│   └── prices.service.js
└── hooks/
    └── usePrices.js    # React Query hooks
```

### Components (`src/components/`)
```
components/
├── SwapForm.jsx        # Main swap form component
├── SwapForm.css        # Swap form styles
├── TokenInput.jsx      # Reusable input component
├── TokenInput.css      # Input component styles
├── TokenSelectModal.jsx # Token selection modal
└── TokenSelectModal.css # Modal styles
```

### Utilities (`src/utils.js`)
- `formatCurrency()` - Format numbers to fixed decimals
- `getTokenIconUrl()` - Generate token icon URLs

## Validation Rules

### From Amount (Sell)
```javascript
✓ Required field
✓ Must be a valid number
✓ Must be greater than 0
✓ If no token selected → Error on buy field
```

### To Amount (Buy)
```javascript
✓ Required field
✓ Must be a valid number
✓ Must be greater than 0
✓ Token must be selected first
✓ Real-time validation on input
```

## User Flows

### Flow 1: Standard Swap
1. User enters amount in "Sell" field
2. User clicks "Select token" button
3. User searches/selects token from modal
4. "Buy" amount calculates automatically
5. User reviews rate and clicks "Confirm swap"
6. Loading spinner shows for 2 seconds
7. Success message appears
8. Form clears automatically

### Flow 2: Buy-First Flow
1. User tries to type in "Buy" field
2. Error appears: "Please select a token first"
3. User selects token from modal
4. Error clears, user can now enter amount
5. "Sell" amount calculates automatically
6. Continue as Flow 1

### Flow 3: Token Change
1. User has amounts entered and token selected
2. User changes the buy token
3. Amounts recalculate automatically based on new token price
4. Rate display updates

### Flow 4: Swap Direction Reversal (Key UX Feature!)
1. User has: 100 USDT → 0.0608 ETH
2. User clicks the swap arrow (↕) button
3. **Instantly becomes**: 0.0608 ETH → 100 USDT
4. All calculations remain accurate
5. URL updates to reflect new direction
6. Perfect for comparing rates both ways

### Flow 5: URL Sharing
1. User configures swap: 500 USDT → 0.3046 ETH
2. URL becomes: `/?from=USDT&to=ETH&fromAmount=500&toAmount=0.3046`
3. User copies and shares URL with friend
4. Friend opens link and sees exact same swap configuration
5. No manual re-entry needed!

## Technical Highlights

### UX Innovations
- **URL State Persistence**: All swap parameters stored in URL query strings
  - Bookmark exact swap configurations
  - Share links with friends
  - Refresh-proof - no data loss
  - Browser back/forward navigation support
- **Swap Direction Control**: Intelligent token/amount swapping with recalculation
- **Real-time Feedback**: Instant validation and error messages

### Form Management
- **React Hook Form** for performant form handling
- **Controller API** for custom component integration
- **Real-time validation** with onChange mode
- **Manual error handling** for custom validations

### State Management
- **URL-based persistence** for shareable swap configurations
- Local state for UI interactions
- React Hook Form for form state
- TanStack Query for server state
- Derived state using useMemo for calculations

### Performance Optimizations ⚡
- **Blazing Fast Rendering**: Optimized with React Hook Form for minimal re-renders
- **Memoized Calculations**: useMemo for expensive computations
- **Smart Caching**: TanStack Query with 5-minute stale time
- **Efficient API Calls**: 10-second refetch interval prevents unnecessary requests
- **Instant Feedback**: Real-time validation without debouncing
- **Optimized Bundle**: Vite for lightning-fast builds
- **Component-level Code Splitting**: Ready for production optimization

### Error Handling
- Form validation errors
- API error handling
- User-friendly error messages
- Visual error indicators

## Supported Tokens

30+ cryptocurrencies including: USDC, ETH, WBTC, BLUR, bNEO, BUSD, USD, LUNA, UST, and more...

_Note: Token list updates automatically from the live API_

## Getting Started

### Quick Start
Visit the live demo: **[https://mono-swap.hp95.workers.dev/](https://mono-swap.hp95.workers.dev/)**

### Local Development
```bash
# Install dependencies
npm install

# Start development server (blazing fast with Vite!)
npm run dev

# Build for production
npm run build
```

## Environment Variables

Create a `.env` file (optional):
```env
VITE_API_BASE_URL=https://api.example.com
```

Default API endpoint: `https://interview.switcheo.com/prices.json`

## Future Enhancements

- [ ] Wallet integration (MetaMask, WalletConnect)
- [ ] Transaction history
- [ ] Multi-chain support
- [ ] Slippage tolerance settings
- [ ] Price impact warnings
- [ ] Gas fee estimation
- [ ] Favorite tokens
- [ ] Recent transactions
- [ ] Advanced trading view

---

## React + Vite Setup

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## License

MIT

---

Built with ❤️ using React, TanStack Query, and React Hook Form
