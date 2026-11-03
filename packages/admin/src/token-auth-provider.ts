import type { AuthProvider } from "ra-core";

import b64DecodeMultibytes from "./lib/b64-decode-multibytes";
import getCookie from "./lib/get-cookie";

const API_URL = import.meta.env.VITE_API_URL;
const PAYLOAD_KEY = "token-payload";

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    const loginResponse = await fetch(`${API_URL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: email, password }),
      credentials: "include", // Allows fetch to save the cookie
    });

    if (!loginResponse.ok) {
      const responseBody = await loginResponse.json();
      throw new Error("Login failed: " + responseBody.message);
    }

    try {
      const headerPayloadCookie = getCookie("jwt_hp");
      const encodedPayload = headerPayloadCookie?.substring(
        headerPayloadCookie?.indexOf(".") + 1,
      );
      if (!encodedPayload) {
        throw new Error("Error met while parsing server response.");
      }

      localStorage.setItem(PAYLOAD_KEY, b64DecodeMultibytes(encodedPayload));
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  checkError: async (error) => {
    if (error.status === 401) {
      throw new Error("Session expired.");
    }
    if (error.status === 403) {
      throw new Error("You cannot access this page.");
    }
  },
  checkAuth: async () => {
    const payload = localStorage.getItem(PAYLOAD_KEY);

    if (payload) {
      const expiration = JSON.parse(payload).exp;
      if (expiration > Date.now() / 1000) {
        return;
      }
    }

    throw new Error("Session expired.");
  },
  logout: async () => {
    localStorage.removeItem(PAYLOAD_KEY);
    await fetch(`${API_URL}/user/logout`, {
      method: "POST",
      credentials: "include",
    });
  },
  getIdentity: async () => {
    const tokenPayloadJson = localStorage.getItem(PAYLOAD_KEY);

    if (tokenPayloadJson) {
      const tokenPayload = JSON.parse(tokenPayloadJson);
      return {
        id: tokenPayload.id,
        fullName: tokenPayload.fullName,
      };
    }
    throw new Error("Not logged in.");
  },
};
