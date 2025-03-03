import { ref } from "vue";
import { getNewToken } from "@/composables/Authentication/getNewToken"

const API_ROOT = import.meta.env.VITE_API_ROOT;
const userData = ref([]);

const getUsers = async () => {
  try {
    let token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    const res = await fetch(API_ROOT + "/users", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    if (res.ok) {
      userData.value = await res.json();
    } else if (res.status === 401) {
      try {
        await getNewToken();
        token = localStorage.getItem("token"); // อัปเดต token ใหม่

        if (!token) {
          console.error("Failed to retrieve new token");
          return;
        }

        const newRes = await fetch(API_ROOT + "/users", {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });

        if (newRes.ok) {
          userData.value = await newRes.json();
        }
      } catch (error) {
        console.error("Failed to get new token:", error);
      }
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

export { getUsers, userData };
