import { useState } from "react";

export default function useToken() {
  const initialTokenState = () => {
    const tokenString = localStorage.getItem("token");
    if (tokenString) {
      return true;
    } else {
      return false;
    }
  };
  const [isTokenSet, setIsTokenSet] = useState(initialTokenState);

  const getToken = () => {
    const tokenString = localStorage.getItem("token");
    if (tokenString) {
      const userToken = JSON.parse(tokenString);
      return userToken;
    }
  };

  const saveToken = (userToken) => {
    localStorage.setItem("token", JSON.stringify(userToken));
    setIsTokenSet(true);
  };

  const clearToken = () => {
    localStorage.removeItem("token");
    setIsTokenSet(false);
  };

  return {
    setToken: saveToken,
    token: getToken(),
    isTokenSet,
    clearToken,
  };
}
