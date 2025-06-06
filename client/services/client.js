import axios from "axios";
import { SIGN_UP_API_KEY, LOGIN_API_KEY } from "./constants";
import { getItemAsync } from "expo-secure-store";
import { ACCESS_TOKEN_KEY } from "@/constants/auth";

// Endpoints to be excluded
const EXCLUDED_ENDPOINTS = [LOGIN_API_KEY, SIGN_UP_API_KEY];

export const client = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

client.interceptors.request.use(async (config) => {
  if (config.url && !EXCLUDED_ENDPOINTS.includes(config.url)) {
    const token = await getItemAsync(ACCESS_TOKEN_KEY);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
