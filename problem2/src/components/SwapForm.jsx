import { useMemo, useState, useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { usePrices } from "../hooks";
import { formatCurrency, getTokenIconUrl } from "../utils";
import "./SwapForm.css";
import TokenInput from "./TokenInput";
import TokenSelectModal from "./TokenSelectModal";

// Assume the swap pair is USDT/XXX or XXX/USDT, so the base token is USDT
const BASE_TOKEN = "USDT";

const SwapForm = () => {
  // Read initial values from URL
  const getInitialValuesFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      fromToken: params.get("from") || BASE_TOKEN,
      toToken: params.get("to") || "",
      fromAmount: params.get("fromAmount") || "",
      toAmount: params.get("toAmount") || "",
    };
  };

  const initialValues = getInitialValuesFromURL();

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      fromAmount: initialValues.fromAmount,
      toAmount: initialValues.toAmount,
    },
  });

  const [fromToken, setFromToken] = useState(initialValues.fromToken);
  const [toToken, setToToken] = useState(initialValues.toToken);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: prices } = usePrices();
  const [selectingToken, setSelectingToken] = useState(fromToken);
  const [isRateReversed, setIsRateReversed] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const fromAmount = useWatch({ control, name: "fromAmount" });
  const toAmount = useWatch({ control, name: "toAmount" });

  const tokens = useMemo(() => {
    if (!prices) return [];

    // Create a map to get unique tokens with their latest prices
    const tokenMap = new Map();

    prices.forEach((price) => {
      const existing = tokenMap.get(price.currency);
      if (!existing || new Date(price.date) > new Date(existing.date)) {
        tokenMap.set(price.currency, price);
      }
    });

    tokenMap.set(BASE_TOKEN, {
      currency: BASE_TOKEN,
      price: 1,
    });

    return Array.from(tokenMap.values()).map((price) => ({
      symbol: price.currency,
      name: price.currency,
      price: price.price,
    }));
  }, [prices]);

  // compute the tokens selection list for the modal
  const tokensSelection = useMemo(() => {
    return tokens.filter((token) => token.symbol !== BASE_TOKEN);
  }, [tokens]);

  const rate = useMemo(() => {
    if (!toToken) return null;
    if (prices?.length === 0 || !prices) return null;
    const tokenPrice = prices.find((price) => {
      const compareToken =
        price.currency === BASE_TOKEN ? fromToken : price.currency;
      return price.currency === compareToken;
    });
    return {
      price: tokenPrice?.price ? formatCurrency(tokenPrice.price) : 0,
      currency: tokenPrice?.currency,
    };
  }, [toToken, prices, fromToken]);

  // Calculate 1% fee in USD
  const fee = useMemo(() => {
    if (!fromAmount || !fromAmount.trim()) return null;
    const amount = Number(fromAmount);
    if (isNaN(amount) || amount <= 0) return null;

    const feeAmount = amount * 0.01; // 1% fee
    return formatCurrency(feeAmount);
  }, [fromAmount]);

  // Update URL when tokens or amounts change
  useEffect(() => {
    const params = new URLSearchParams();

    if (fromToken) params.set("from", fromToken);
    if (toToken) params.set("to", toToken);
    if (fromAmount) params.set("fromAmount", fromAmount);
    if (toAmount) params.set("toAmount", toAmount);

    const newURL = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;

    if (!toToken) {
      return;
    }
    window.history.replaceState({}, "", newURL);
  }, [fromToken, toToken, fromAmount, toAmount]);

  const handleSwapTokens = () => {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
    const tempAmount = fromAmount;
    setValue("fromAmount", toAmount);
    setValue("toAmount", tempAmount);
  };

  const handleSwap = async (data) => {
    console.log("Swapping", data.fromAmount, fromToken, "to", toToken);

    // Set loading state
    setIsLoading(true);

    // Simulate API call with 2 second delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Set loading to false and show success
    setIsLoading(false);
    setShowSuccess(true);

    // Clear form
    setValue("fromAmount", "");
    setValue("toAmount", "");
    setToToken("");
    clearErrors();

    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const selectedTokenData = useMemo(
    () => tokens.find((token) => token.symbol === toToken),
    [tokens, toToken]
  );

  const fromTokenData = useMemo(() => {
    return tokens.find((token) => token.symbol === fromToken);
  }, [tokens, fromToken]);

  const handleOpenModal = ({ currentToken }) => {
    setSelectingToken(currentToken);
    setIsModalOpen(true);
  };

  const handleSelectToken = (token) => {
    setToToken(token.symbol);
    // Clear errors when token is selected
    clearErrors("toAmount");

    // Find the price for the newly selected token
    const tokenPrice = prices?.find((price) => price.currency === token.symbol);

    if (tokenPrice?.price) {
      const currentFromAmount = getValues("fromAmount");
      const currentToAmount = getValues("toAmount");

      // If user already entered fromAmount, recalculate toAmount based on new token
      if (currentFromAmount && !currentToAmount) {
        const calculatedToAmount =
          Number(currentFromAmount) * Number(tokenPrice.price);
        setValue(
          "toAmount",
          calculatedToAmount > 0 ? formatCurrency(calculatedToAmount) : ""
        );
      }
      // If user already entered toAmount, recalculate fromAmount based on new token
      else if (currentToAmount) {
        const calculatedFromAmount =
          Number(currentToAmount) / Number(tokenPrice.price);
        setValue(
          "fromAmount",
          calculatedFromAmount > 0 ? formatCurrency(calculatedFromAmount) : ""
        );
      }
    }
  };

  const handleChangeFromAmount = (value, onChange) => {
    // Call react-hook-form's onChange to update form state
    onChange(value);

    // Check if user is entering amount in sell field without selecting buy token
    if (!toToken && value) {
      setError("toAmount", {
        type: "manual",
        message: "Please select a token first",
      });
      return;
    }

    // Clear any manual errors on toAmount if token is selected
    if (toToken && errors.toAmount?.type === "manual") {
      clearErrors("toAmount");
    }

    // calculate the to amount
    if (!toToken || !rate?.price) return;
    const calculatedToAmount = Number(value) / Number(rate?.price);
    setValue(
      "toAmount",
      calculatedToAmount > 0 ? formatCurrency(calculatedToAmount) : ""
    );
  };

  const handleChangeToAmount = (value, onChange) => {
    // Call react-hook-form's onChange to update form state
    onChange(value);

    // Check if token is selected
    if (!toToken && value) {
      setError("toAmount", {
        type: "manual",
        message: "Please select a token first",
      });
      return;
    }

    // Clear any manual errors if token is selected
    if (toToken && errors.toAmount?.type === "manual") {
      clearErrors("toAmount");
    }

    // calculate the from amount
    if (!rate?.price) return;
    const calculatedFromAmount = Number(value) * Number(rate?.price);
    setValue(
      "fromAmount",
      calculatedFromAmount > 0 ? formatCurrency(calculatedFromAmount) : ""
    );
  };

  // Validation function for amount inputs
  const validateAmount = (value) => {
    if (!value || value === "") {
      return "Amount is required";
    }
    const numValue = Number(value);
    if (isNaN(numValue)) {
      return "Please enter a valid number";
    }
    if (numValue <= 0) {
      return "Amount must be greater than 0";
    }
    return true;
  };

  // Validation function for toAmount - requires token selection
  const validateToAmount = (value) => {
    if (!toToken) {
      return "Please select a token first";
    }
    return validateAmount(value);
  };

  const handleRateClick = () => {
    setIsRateReversed(!isRateReversed);
  };

  return (
    <div className="swap-container">
      <div className="swap-header">
        <h2>Swap</h2>
      </div>

      <form onSubmit={handleSubmit(handleSwap)} className="swap-form">
        <Controller
          name="fromAmount"
          control={control}
          rules={{ validate: validateAmount }}
          render={({ field: { onChange, value } }) => (
            <TokenInput
              label="Sell"
              placeholder="0.0"
              value={value}
              onChange={(e) => handleChangeFromAmount(e.target.value, onChange)}
              error={errors.fromAmount?.message}
              selectedToken={
                fromTokenData
                  ? {
                      symbol: fromTokenData.symbol,
                      iconUrl: getTokenIconUrl(fromTokenData.symbol),
                    }
                  : null
              }
              onTokenClick={
                fromTokenData?.symbol !== BASE_TOKEN
                  ? () =>
                      handleOpenModal({ currentToken: fromTokenData?.symbol })
                  : undefined
              }
            />
          )}
        />

        <button
          type="button"
          className="swap-arrow-button"
          onClick={handleSwapTokens}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 3V13M8 13L12 9M8 13L4 9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <Controller
          name="toAmount"
          control={control}
          rules={{ validate: validateToAmount }}
          render={({ field: { onChange, value } }) => (
            <TokenInput
              label="Buy"
              placeholder="0.0"
              value={value}
              onChange={(e) => handleChangeToAmount(e.target.value, onChange)}
              error={errors.toAmount?.message}
              selectedToken={
                selectedTokenData
                  ? {
                      symbol: selectedTokenData.symbol,
                      iconUrl: getTokenIconUrl(selectedTokenData.symbol),
                    }
                  : null
              }
              onTokenClick={
                selectedTokenData?.symbol !== BASE_TOKEN
                  ? () =>
                      handleOpenModal({
                        currentToken: selectedTokenData?.symbol,
                      })
                  : undefined
              }
            />
          )}
        />

        {fromAmount && rate?.price && (
          <div className="swap-info">
            <div className="info-row">
              <span>Rate</span>
              <span className="rate-display" onClick={handleRateClick}>
                {isRateReversed
                  ? `1 ${toToken} = ${
                      rate?.price ? formatCurrency(Number(rate.price)) : 0
                    } ${fromToken}`
                  : `1 ${fromToken} = ${
                      formatCurrency(1 / Number(rate?.price)) || 0
                    } ${toToken}`}

                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="rate-switch-icon"
                >
                  <path
                    d="M4 6L8 2L12 6M12 10L8 14L4 10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
            {fee && (
              <div className="info-row">
                <span>Fee (1%)</span>
                <span>${fee}</span>
              </div>
            )}
          </div>
        )}

        <button type="submit" className="swap-button" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="button-spinner"></span>
              Processing...
            </>
          ) : (
            "Confirm swap"
          )}
        </button>

        {showSuccess && (
          <div className="success-message">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M16.25 5L7.5 13.75L3.75 10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Swap successful!</span>
          </div>
        )}
      </form>

      <TokenSelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectToken={handleSelectToken}
        selectedToken={selectingToken}
        tokens={tokensSelection}
      />
    </div>
  );
};

export default SwapForm;
