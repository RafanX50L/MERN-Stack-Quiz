import axios from "axios";
import { HOST } from "@/constants/routes";
import type { AppDispatch } from "@/store/store";
import { setCredentials } from "@/store/slice/authSlice";
import type { AxiosInstance } from "axios";
import type { UserInterface } from "@/types/user";

interface TokenData {
  token: string;
}


export const secureTokenStorage = {
  get: (): TokenData | null => {
    try {

      const {  accessToken } = JSON.parse(localStorage.getItem("accessTokenData") || "{}");
      if (!accessToken) {
        console.log('No token found in local storage');
        return null;
      }

      return { token: accessToken };
    } catch (error) {
      console.error('Failed to retrieve token:', error);
      return null;
    }
  },

  set: (user: UserInterface, token: string, dispatch: AppDispatch) => {
    try {
      dispatch(setCredentials({ user, accessToken: token }));
    } catch (error) {
      console.error('Failed to store token:', error);
    }
  },

  remove: () => {
    localStorage.removeItem('accessTokenData');
    localStorage.removeItem('sessionActive');
    console.log('Token removed from storage');
  }
};


const api: AxiosInstance = axios.create({
  baseURL: `${HOST}/api`,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});
console.log('api',HOST)

// api .__instanceId = "main-api-instance";

export default api;