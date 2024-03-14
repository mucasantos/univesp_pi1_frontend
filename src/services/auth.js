import api from './api';  

export const TOKEN_KEY = "@frexco-token";

export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null;

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const login = (name,password) => {

  api.post('/login',{
    name: name,
    password: password
  })
  .then(response => {
    localStorage.setItem(TOKEN_KEY, response.data.token);
  })
  .catch(err => {
    console.log(err);
  });

};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
};
