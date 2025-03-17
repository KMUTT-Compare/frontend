const clearToken = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole")
    localStorage.removeItem("username")
    window.location.reload();
  };
  
  export { clearToken };