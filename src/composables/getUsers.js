import { getNewToken } from "@/composables/Authentication/getNewToken"
const API_ROOT = import.meta.env.VITE_API_ROOT;

const getUsers = async () => {
  try {
    const res = await fetch(`${API_ROOT}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': "Bearer " + localStorage.getItem('token')
      }
    });

    if (res.ok) {
      const data = await res.json();
      return data.length > 0 ? data : []; 
    } else {
      if (res.status === 401) {
        try {
          await getNewToken();
          const newRes = await fetch(API_ROOT + "/api/users", {
            headers: {
              "Content-Type": "application/json",
              'Authorization': "Bearer " + localStorage.getItem('token')
            }
          });

          if (newRes.ok) {
            const data = await newRes.json();
            return data.length > 0 ? data : []; 
          } 
        } catch (error) {
          console.error('Failed to get new token:', error);
        }
      } 
    }
  } catch (error) {
    console.error('error ', error);
  }
};
export { getUsers, userData };
