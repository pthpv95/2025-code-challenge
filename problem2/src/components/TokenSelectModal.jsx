import { useCallback, useEffect, useMemo, useState } from "react";
import "./TokenSelectModal.css";
import { getTokenIconUrl } from "../utils";

const TokenSelectModal = ({
  isOpen,
  onClose,
  onSelectToken,
  selectedToken,
  tokens,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTokens = useMemo(() => {
    if (!tokens) return [];

    if (!searchQuery) return tokens;

    const query = searchQuery.toLowerCase();
    return tokens.filter(
      (token) =>
        token.symbol.toLowerCase().includes(query) ||
        token.name?.toLowerCase().includes(query)
    );
  }, [tokens, searchQuery]);

  const handleClose = useCallback(() => {
    setSearchQuery("");
    onClose();
  }, [onClose, setSearchQuery]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const handleSelectToken = (token) => {
    onSelectToken(token);
    handleClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container">
        <div className="modal-header">
          <h3>Select a token</h3>
          <button className="modal-close" onClick={handleClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="modal-search">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="search-icon"
          >
            <path
              d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            type="text"
            placeholder="Search name or paste address"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            autoFocus
          />
        </div>

        <div className="token-list">
          {filteredTokens.length === 0 ? (
            <div className="no-results">
              <p>No tokens found</p>
            </div>
          ) : (
            filteredTokens.map((token) => (
              <div
                key={token.symbol}
                className={`token-item ${
                  selectedToken === token.symbol ? "selected" : ""
                }`}
                onClick={() => handleSelectToken(token)}
              >
                <div className="token-info">
                  <img
                    src={getTokenIconUrl(token.symbol)}
                    alt={token.symbol}
                    className="token-icon"
                  />
                  <div className="token-details">
                    <div className="token-symbol">{token.symbol}</div>
                  </div>
                </div>
                {selectedToken === token.symbol && (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="check-icon"
                  >
                    <path
                      d="M16.25 5L7.5 13.75L3.75 10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenSelectModal;
