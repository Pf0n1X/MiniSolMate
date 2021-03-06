import { useState } from 'react';

export default function useToken() {
  const initialTokenState = () => {
    const tokenString = localStorage.getItem('token');
    if (tokenString) {
      return true;
    } else {
      return false
    }
  }
  const [isTokenSet,setIsTokenSet] = useState(initialTokenState);

  
  const getToken = () => {
    const tokenString = localStorage.getItem('token');
    if (!tokenString) {
    const userToken = JSON.parse(tokenString);
    return userToken?.token
    }
  };

  const saveToken = userToken => {
    localStorage.setItem('token', JSON.stringify(userToken));
    setIsTokenSet(true);
  };

  return {
    setToken: saveToken,
    token: getToken(),
    isTokenSet,
  }
}