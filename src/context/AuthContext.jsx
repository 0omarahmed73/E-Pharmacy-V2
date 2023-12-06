import { createContext, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import CryptoJS from "crypto-js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const secret = import.meta.env.VITE_SECRET;
  if (Cookies.get("user")) {
    if (
      CryptoJS.AES.decrypt(Cookies.get("user"), secret).toString(
        CryptoJS.enc.Utf8
      ) === ""
    ) {
      Cookies.remove("user");
    }
  }
  const [user, setUser] = useState(
    Cookies.get("user")
      ? JSON.parse(
          CryptoJS.AES.decrypt(Cookies.get("user"), secret).toString(
            CryptoJS.enc.Utf8
          )
        )
      : null
  );
  const login = async (values) => {
    setError(null);
    setLoading(true);
    const username = values.email;
    const password = values.password;
    const user = await fetch("http://localhost:3000/users/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (user.ok) {
      const data = await user.json();
      setUser(data);
      setError(null);
      Cookies.set(
        "user",
        CryptoJS.AES.encrypt(JSON.stringify(data), secret).toString(),
        {
          expires: 1,
          secure: true,
        }
      );
      setSuccess(true);
    } else {
      setUser(null);
      const data = await user.json();
      console.log(data.message);
      setError(data.message);
      Cookies.remove("user");
      toast.error(data.message);
    }
    setLoading(false);
  };

  const registerUser = async (newUser) => {
    const response = await fetch("http://localhost:3000/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken: crypto.randomUUID(),
        id: new Date().getTime(),
        name: newUser.name,
        username: newUser.email,
        password: newUser.password,
        role: newUser.type,
        phone: newUser.phone,
        nationalId: newUser.national,
      }),
    });

    if (!response.ok) {
      throw new Error("Error registering user");
    }

    const data = await response.json();
    return data;
  };
  console.log(user);
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        error,
        loading,
        success,
        setSuccess,
        registerUser,
        setLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
