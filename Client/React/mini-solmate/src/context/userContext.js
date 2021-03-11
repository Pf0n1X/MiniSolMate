import React, { useReducer } from "react";

const userContext = React.createContext({ }); // Create a context object

const {Provider} = userContext; 

const StateProvider = ({children}) => {
    const [state,dispatch] = useReducer((state,action) => {
        const currentState = { ...state };
        switch (action.type) {
            case "SET_USER":
                currentState.user = action.payload
                return currentState;
            case "LOGOUT":
                currentState.user = null;
                return currentState;
            default:
                throw new Error();

        }

},  {});
return  <Provider value={{state,dispatch}}>{children}</Provider>
}

    

export {
  userContext,
  StateProvider,
};