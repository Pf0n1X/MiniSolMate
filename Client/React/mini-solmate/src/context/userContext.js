import React, { useReducer, useEffect, useState } from "react";
import axios from "axios";
import useToken from "../hooks/useToken";

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
  const [data, setData] = useState(null);
  const {token} = useToken();
  
  const fetch = (id) => {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      axios.get('http://localhost:3001/user?UserEmail=' + id)
          .then((response) => {
              if (response.data === null || response.data === undefined)
                  return;

              setData(response.data[0]);
          });
  }

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

  return <Provider value={{ state, dispatch, data, fetch }}>{children}</Provider>;
};

export { userContext, StateProvider };
