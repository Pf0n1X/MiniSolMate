import { useState } from 'react';
import axios from 'axios';

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
    axios.defaults.headers.post['Authorization'] = 'Bearer ' + userToken;
    axios.defaults.headers.get['Authorization'] = 'Bearer ' + userToken;
    axios.defaults.headers.put['Authorization'] = 'Bearer ' + userToken;
  };

  return {
    setToken: saveToken,
    token: getToken(),
    isTokenSet,
  }
}