import './TokenInput.css'

const TokenInput = ({
  label,
  value,
  onChange,
  placeholder = '0.0',
  selectedToken,
  onTokenClick,
  error,
  disabled = false,
  readOnly = false,
}) => {
  return (
    <div className="input-container">
      <div className="input-header">
        <span className="label">{label}</span>
        {error && <span className="error-message">{error}</span>}
      </div>
      <div className="input-wrapper">
        <input
          type="text"
          className={`amount-input ${error ? 'has-error' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          readOnly={readOnly}
        />
        {onTokenClick && (
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
        {!onTokenClick && selectedToken && (
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
  )
}

export default TokenInput
