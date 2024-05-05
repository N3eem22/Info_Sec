// COOKIES, LOCAL STORAGE
import Cookies from 'js-cookie';

export const setAuthUser = (data) => {
  // save object to the local storage
  // Stringify OBJECT TO TEXT
  localStorage.setItem("user", JSON.stringify(data));
};

export const getAuthUser = (data) => {
  if (localStorage.getItem("user")) {
    return JSON.parse(localStorage.getItem("user"));
  }
};

export const removeAuthUser = () => {
  // Remove user data from local storage
  if (localStorage.getItem("user")) {
    localStorage.removeItem("user");
  }
  // Remove user data from session storage
  sessionStorage.clear();
  Cookies.remove('jwt');
  };



