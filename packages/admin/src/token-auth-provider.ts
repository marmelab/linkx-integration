import type { AuthProvider } from "ra-core";

import b64DecodeMultibytes from "./lib/b64-decode-multibytes";
import getCookie from "./lib/get-cookie";

const API_URL = import.meta.env.VITE_API_URL;
const PAYLOAD_KEY = "token-payload";

export const ROLE_ADMIN = "ROLE_ADMIN";
export const ROLE_USER = "ROLE_USER";
export const ROLE_USER_MANAGER = "ROLE_USER_MANAGER";
export type Role =
  | typeof ROLE_ADMIN
  | typeof ROLE_USER
  | typeof ROLE_USER_MANAGER;

export const ROLES: Record<Role, string> = {
  ROLE_ADMIN: "Administrator",
  ROLE_USER: "Player",
  ROLE_USER_MANAGER: "Player manager",
};

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
      const payloadJson = b64DecodeMultibytes(encodedPayload);
      const roles = JSON.parse(payloadJson).roles;

      if (!(roles.includes(ROLE_ADMIN) || roles.includes(ROLE_USER_MANAGER))) {
        throw new Error("You cannot access this page.");
      }

      localStorage.setItem(PAYLOAD_KEY, payloadJson);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  checkError: async (error) => {
    if (error.status === 401) {
      throw new Error("Session expired.");
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
  canAccess: async ({ resource }) => {
    const tokenPayloadJson = localStorage.getItem(PAYLOAD_KEY);

    if (tokenPayloadJson) {
      const roles = JSON.parse(tokenPayloadJson).roles;

      if (resource === "users") {
        return true;
      } else {
        return roles.includes(ROLE_ADMIN);
      }
    }

    throw new Error("Authentication information is missing.");
  },
};

export function getTokenPayload() {
  try {
    const json = localStorage.getItem(PAYLOAD_KEY);
    return json ? JSON.parse(json) : null;
  } catch (error: any) {
    console.error("Invalid payload saved. " + error.message);
    localStorage.removeItem(PAYLOAD_KEY);
    return null;
  }
}
