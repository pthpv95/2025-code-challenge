import { Token } from "../types";
import "./TokenInput.css";

interface TokenInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  selectedToken?: Token | null;
  showSelectToken?: boolean;
  onTokenClick?: () => void;
  error?: string;
  disabled?: boolean;
  readOnly?: boolean;
}

const TokenInput = ({
  label,
  value,
  onChange,
  placeholder = "0.0",
  selectedToken,
  showSelectToken,
  onTokenClick,
  error,
  disabled = false,
  readOnly = false,
}: TokenInputProps) => {
  return (
    <div className="input-container">
      <div className="input-header">
        <span className="label">{label}</span>
        {error && <span className="error-message">{error}</span>}
      </div>
      <div className="input-wrapper">
        <input
          type="text"
          className={`amount-input ${error ? "has-error" : ""}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          readOnly={readOnly}
        />
        {showSelectToken && (
          <button
            type="button"
            className="token-select"
            onClick={onTokenClick}
            disabled={disabled}
          >
            {selectedToken && (
              <>
                <img
                  src={selectedToken.iconUrl}
                  alt={selectedToken.symbol}
                  className="token-icon"
                />
                <span className="token-dropdown">{selectedToken.symbol}</span>
              </>
            )}
            {!selectedToken && (
              <span className="token-dropdown">Select token</span>
            )}
            <span className="dropdown-arrow">▼</span>
          </button>
        )}
        {!showSelectToken && selectedToken && (
          <div className="token-select token-display">
            <img
              src={selectedToken.iconUrl}
              alt={selectedToken.symbol}
              className="token-icon"
            />
            <span className="token-dropdown">{selectedToken.symbol}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenInput;
