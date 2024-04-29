// COOKIES, LOCAL STORAGE

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
  if (sessionStorage.getItem("user")) {
    sessionStorage.removeItem("user");
  }

  // Clear user cookie
  document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};



