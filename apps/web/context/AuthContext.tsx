"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

export interface AuthContextProps {
  children: React.ReactNode
}

const AuthContext = createContext()

const AuthProvider = ({ children }: AuthContextProps) => {
  // State to hold the authentication token
  const [token, setToken_] = useState<string | null>(localStorage.getItem("hanko"))

  // Function to set the authentication token
  const setToken = (newToken: string) => {
    setToken_(newToken)
  };

  useEffect(() => {
    if (token) {
      //axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      localStorage.setItem("hanko", token);
    } else {
      //delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("hanko");
    }
  }, [token])

  // Memoized value of the authentication context
  const contextValue = useMemo(
    () => ({
      token,
      setToken,
    }),
    [token]
  )

  // Provide the authentication context to the children components
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}

export default AuthProvider