import type { AuthProvider } from "ra-core";

import { jwtDecode } from "jwt-decode";

const API_URL = import.meta.env.VITE_API_URL;

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

    const responseBody = await loginResponse.json();
    if (!loginResponse.ok) {
      throw new Error("Login failed: " + responseBody.message);
    }

    // Local storage keeps only the payload.
    // The token itself is set in a cookie with httpOnly.
    console.log(jwtDecode(responseBody.token));
    localStorage.setItem(
      "token-payload",
      JSON.stringify(jwtDecode(responseBody.token)),
    );
  },
  checkError: async (error) => {
    if (error.status === 401) {
      throw new Error("Session expired.");
    }
  },
  checkAuth: async () => {
    const payload = localStorage.getItem("token-payload");

    if (payload) {
      const expiration = JSON.parse(payload).exp;
      if (expiration > Date.now() / 1000) {
        return;
      }
    }

    throw new Error("Session expired.");
  },
  logout: async () => {
    localStorage.removeItem("token-payload");
    await fetch(`${API_URL}/user/logout`, {
      method: "POST",
    });
  },
  getIdentity: async () => {
    const tokenPayloadJson = localStorage.getItem("token-payload");

    if (tokenPayloadJson) {
      const tokenPayload = JSON.parse(tokenPayloadJson);
      return {
        id: tokenPayload.id,
        fullName: tokenPayload.displayName,
      };
    }
    throw new Error("Not logged in.");
  },
};
