import React, { createContext, useReducer } from 'react';

const initialContext = {
  cTokenBalance: '--',
  setCTokenBalance: () => {},
  exchangeRate: 0,
  setExchangeRate: () => {},
};

const appReducer = (state, { type, payload }) => {
  switch (type) {
    case 'SET_C_TOKEN_BALANCE':
      return {
        ...state,
        cTokenBalance: payload,
      };

    case 'SET_EXCHANGE_RATE':
      return {
        ...state,
        exchangeRate: payload,
      };

    default:
      return state;
  }
};

const AppContext = createContext(initialContext);
export const useAppContext = () => React.useContext(AppContext);
export const AppContextProvider = ({ children }) => {
  const [store, dispatch] = useReducer(appReducer, initialContext);

  const contextValue = {
    cTokenBalance: store.cTokenBalance,
    setCTokenBalance: (balance) => {
      dispatch({ type: 'SET_C_TOKEN_BALANCE', payload: balance });
    },
    exchangeRate: store.exchangeRate,
    setExchangeRate: (rate) => {
      dispatch({ type: 'SET_EXCHANGE_RATE', payload: rate });
    },
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};
