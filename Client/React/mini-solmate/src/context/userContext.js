import React, { useReducer, useEffect } from "react";

const STORAGE_KEY = "userInfo";

const persistState = (storageKey, state) => {
  localStorage.setItem(storageKey, JSON.stringify(state));
};

const getIntialState = (storageKey) => {
  const savedState = localStorage.getItem(storageKey);
  try {
    if (!savedState) {
      return undefined;
    }
    return JSON.parse(savedState ?? {});
  } catch (e) {
    return undefined;
  }
};

const initialState = getIntialState(STORAGE_KEY) ?? {};

const providerValue = {
  state: initialState,
  dispatch: (action) => {}, // << This will be overwritten
};

const userContext = React.createContext(providerValue); // Create a context object

const { Provider } = userContext;

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    const currentState = { ...state };

    switch (action.type) {
      case "SET_USER":
        currentState.user = {email: action.payload.email, _id: action.payload._id};
        return currentState;
      case "LOGOUT":
        currentState.user = null;
        return currentState;
      default:
        throw new Error();
    }
  }, initialState);

  useEffect(() => persistState(STORAGE_KEY, state), [state]);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { userContext, StateProvider };
