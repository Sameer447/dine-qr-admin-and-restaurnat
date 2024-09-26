// ** React Imports
import { createContext, useEffect, useState } from "react";

// ** Next Import
import { useRouter } from "next/router";

// ** Axios
import axios from "axios";

// ** Config
import authConfig from "src/configs/auth";

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
};
const AuthContext = createContext(defaultProvider);

const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user);
  const [loading, setLoading] = useState(defaultProvider.loading);

  // ** Hooks
  const router = useRouter();
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = window.localStorage.getItem(
        authConfig.storageTokenKeyName,
      );
      if (storedToken) {
        setLoading(true);
        await axios
          .get(authConfig.meEndpoint, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          })
          .then(async (response) => {
            setLoading(false);
            setUser({ ...response.data.userData });
          })
          .catch(() => {
            localStorage.removeItem("userData");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("accessToken");
            setUser(null);
            setLoading(false);
            if (
              authConfig.onTokenExpiration === "logout" &&
              !router.pathname.includes("login")
            ) {
              router.replace("/login");
            }
          });
      } else {
        setLoading(false);
      }
    };
    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

// handleLogin Function with Error Handling and Callback
const handleLogin = async (params, errorCallback) => {

  try {
    // Call the mock login endpoint
    const response = await axios.post(authConfig.loginEndpoint, params);

    const { accessToken, userData } = response.data;

    // Store the accessToken and userData in localStorage
    if (userData) {
      window.localStorage.setItem(authConfig.storageTokenKeyName, accessToken);
      window.localStorage.setItem("userData", JSON.stringify(userData));
    }
  
      if (userData.role === "superAdmin") {
        window.localStorage.setItem(authConfig.isSuperAdmin, true);
      } else if (userData.role === "Resturant") {
        window.localStorage.setItem(authConfig.isSuperAdmin, false);
      }

      const returnUrl = router.query.returnUrl;
      setUser({ ...userData });
    
      const redirectURL = returnUrl && returnUrl !== "/" ? returnUrl : "/";

      router.replace(redirectURL);
   
     } catch (error) {
    // Get the error message based on response status
    const errorMessage = error?.response?.data?.error || "Login failed, please try again";
    
    // Pass the error message back to the calling function via callback
    if (errorCallback) errorCallback(errorMessage);
  }
};

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem("userData");
    window.localStorage.removeItem(authConfig.storageTokenKeyName);
    router.push("/login");
  };

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
