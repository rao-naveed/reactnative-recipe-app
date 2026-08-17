import { API_URL } from "../constants/api";
console.log("API_URL", API_URL);
const fetchJson = async (path, data) => {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Request failed");
  }
  return result;
};
console.log("API_URL", API_URL);
export const AuthAPI = {
  signUp: async ({ name, email, password }) => {
    return fetchJson("/api/auth/signup", { name, email, password });
  },

  signIn: async ({ email, password }) => {
    return fetchJson("/api/auth/signin", { email, password });
  },

  verifyEmail: async ({ email, code }) => {
    return fetchJson("/api/auth/verify-email", { email, code });
  },
};
