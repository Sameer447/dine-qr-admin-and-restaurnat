// @ts-nocheck
// ** JWT import
import axios from "axios";
import jwt from "jsonwebtoken";

// ** Mock Adapter
import mock from "src/@fake-db/mock";

// ** Default AuthConfig
import defaultAuthConfig from "src/configs/auth";

const usersData = [
  {
    id: 1,
    role: "admin",
    password: "admin",
    fullName: "John Doe",
    username: "johndoe",
    email: "admin@vuexy.com",
  },
  {
    id: 2,
    role: "client",
    password: "client",
    fullName: "Jane Doe",
    username: "janedoe",
    email: "client@vuexy.com",
  },
];

// ! These two secrets should be in .env file and not in any other file
const jwtConfig = {
  secret: process.env.NEXT_PUBLIC_JWT_SECRET,
  expirationTime: process.env.NEXT_PUBLIC_JWT_EXPIRATION,
  refreshTokenSecret: process.env.NEXT_PUBLIC_JWT_REFRESH_TOKEN_SECRET,
};


mock.onPost("/jwt/login").reply(async (request) => {
  const { email, password } = JSON.parse(request.data);

  // Validate email and password input
  if (!email || !password) {
    return [400, { error: { email: ["Email and password are required"] } }];
  }

  try {
    // Verify credentials via the actual API
    const responseData = await axios.post(
      `/api/Login/verify-login`,
      { email, password },
      { headers: { "Content-Type": "application/json" } },
    );

    // If the user is found
    if (responseData.status === 200 && responseData.data?.user) {
      const user = responseData.data.user;

      // Generate JWT token
      const accessToken = jwt.sign({ id: user._id }, jwtConfig.secret, {
        expiresIn: jwtConfig.expirationTime,
      });

      // Send back token and userData in response
      return [200, { accessToken, userData: { ...user, password: undefined } }];
    } else {
      // If credentials are invalid, return an error
      return [400, { error: { email: ["Email or password is incorrect"] } }];
    }
  } catch (error) {
    console.error("Error verifying login: ", error.message);

    // Server error handling
    if (error.response?.status === 500) {
      return [500, { error: { general: ["Server error, please try again later"] } }];
    }

    // Handle other unexpected errors
    return [400, { error: { general: ["An unexpected error occurred"] } }];
  }
});


mock.onPost("/jwt/register").reply((request) => {
  if (request.data.length > 0) {
    const { email, password, username } = JSON.parse(request.data);
    const isEmailAlreadyInUse = usersData.find((user) => user.email === email);
    const isUsernameAlreadyInUse = usersData.find(
      (user) => user.username === username,
    );

    const error = {
      email: isEmailAlreadyInUse ? "This email is already in use." : null,
      username: isUsernameAlreadyInUse
        ? "This username is already in use."
        : null,
    };
    if (!error.username && !error.email) {
      const { length } = usersData;
      let lastIndex = 0;
      if (length) {
        lastIndex = usersData[length - 1].id;
      }

      const userData = {
        id: lastIndex + 1,
        email,
        password,
        username,
        avatar: null,
        fullName: "",
        role: "admin",
      };
      usersData.push(userData);
      const accessToken = jwt.sign({ id: userData.id }, jwtConfig.secret);
      const user = { ...userData };
      delete user.password;
      const response = { accessToken };

      return [200, response];
    }

    return [200, { error }];
  } else {
    return [401, { error: "Invalid Data" }];
  }
});


mock.onGet("/auth/me").reply((config) => {
  return new Promise((resolve) => {
    const token = config.headers.Authorization?.split(" ")[1];
    if (!token) {
      resolve([401, { error: "Unauthorized access, token is missing" }]);
      return;
    }

    jwt.verify(token, jwtConfig.secret, async (err, decoded) => {
      if (err) {
        // Handle token expiration or invalid token
        if (err.name === "TokenExpiredError") {
          // Token expired, check config for refresh or logout
          if (defaultAuthConfig.onTokenExpiration === "logout") {
            resolve([401, { error: "Session expired, please login again" }]);
          } else if (defaultAuthConfig.onTokenExpiration === "refreshToken") {
            const oldTokenDecoded = jwt.decode(token, { complete: true });
            const { id: userId } = oldTokenDecoded.payload;

            try {
              const responseData = await axios.get(`/api/getuser`, {
                params: { _id: userId },
              });

              if (responseData.status === 200) {
                const user = responseData.data.user;
                const newToken = jwt.sign({ id: user._id }, jwtConfig.secret, {
                  expiresIn: jwtConfig.expirationTime,
                });

                window.localStorage.setItem(
                  defaultAuthConfig.storageTokenKeyName,
                  newToken,
                );

                resolve([200, { userData: { ...user, password: undefined } }]);
              }
            } catch (error) {
              resolve([500, { error: "Server error while refreshing token" }]);
            }
          }
        } else {
          resolve([401, { error: "Invalid token, please login again" }]);
        }
      } else {
        // Token is valid, get the user information
        const userId = decoded.id;

        try {
          const responseData = await axios.get(`/api/getuser`, {
            params: { _id: userId },
          });

          if (responseData.status === 200) {
            const userData = responseData.data.user;
            delete userData.password;
            resolve([200, { userData }]);
          }
        } catch (error) {
          resolve([500, { error: "Error fetching user data" }]);
        }
      }
    });
  });
});