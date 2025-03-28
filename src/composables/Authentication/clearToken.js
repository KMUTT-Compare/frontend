const API_ROOT = import.meta.env.VITE_API_ROOT;
  const clearToken = async () => {
    try {
        const response = await fetch(`${API_ROOT}/auth/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (response.ok) {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("userRole")
          localStorage.removeItem("username")
          console.log("Logout successful");
        } else {
            console.error("Logout failed");
        }
    } catch (error) {
        console.error("Error logging out:", error);
    }
};

export { clearToken };
