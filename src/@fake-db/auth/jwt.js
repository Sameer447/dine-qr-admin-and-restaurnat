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
  let user = null;

  let error = {
    email: ["Something went wrong"],
  };
  // const user = users.find(u => u.email === email && u.password === password)
  const responseData = await axios.post(
    `/api/Login/verify-login`,
    {
      email,
      password,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (responseData.status === 200) {
    user = responseData.data.user;
    console.log("find in user :>> ", user);
  }

  if (user) {
    const accessToken = jwt.sign({ id: user._id }, jwtConfig.secret, {
      expiresIn: jwtConfig.expirationTime,
    });

    const response = {
      accessToken,
      userData: { ...user, password: undefined },
    };

    return [200, response];
  } else {
    error = {
      email: ["email or Password is Invalid"],
    };

    return [400, { error }];
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
    // ** Get token from header and remove 'Bearer' prefix
    const token = config.headers.Authorization?.split(" ")[1];
    console.log("token without Bearer :>> ", token);

    // ** Default response
    let response = [200, {}];

    // ** Checks if the token is valid or expired
    jwt.verify(token, jwtConfig.secret, async (err, decoded) => {
      // ** If token is expired
      if (err) {
        // ** If onTokenExpiration === 'logout' then send 401 error
        if (defaultAuthConfig.onTokenExpiration === "logout") {
          // ** 401 response will logout user from AuthContext file
          response = [401, { error: { error: "Invalid User" } }];
          resolve(response); // Resolve here to return 401 immediately
        } else {
          // ** If onTokenExpiration === 'refreshToken' then generate the new token
          const oldTokenDecoded = jwt.decode(token, { complete: true });
          console.log("oldTokenDecoded", oldTokenDecoded);

          // ** Get user id from old token
          // @ts-ignore
          const { id: userId } = oldTokenDecoded?.payload;

          // ** Get user that matches id in token
          // const user = usersData.find(u => u.id === userId)
          try {
            const responseData = await axios.get(`/api/getuser`, {
              headers: {
                "Content-Type": "application/json",
              },
              params: {
                _id: userId, // Pass userId as a query parameter
              },
            });
            if (responseData.status === 200) {
              const user = responseData.data.user;

              // Create new access token and store it
              const accessToken = jwt.sign({ id: user._id }, jwtConfig.secret, {
                expiresIn: jwtConfig.expirationTime,
              });

              window.localStorage.setItem(
                defaultAuthConfig.storageTokenKeyName,
                accessToken,
              );

              console.log("user in me endpoint :>> ", user);

              response = [200, { userData: { ...user, password: undefined } }];
              resolve(response); // Return the final userData response
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
            resolve([500, { error: "Server error" }]); // Resolve with error
          }

          // ** Sign a new token
          // const accessToken = jwt.sign({ id: userId }, jwtConfig.secret, {
          //   expiresIn: jwtConfig.expirationTime
          // })

          // // ** Set new token in localStorage
          // window.localStorage.setItem(defaultAuthConfig.storageTokenKeyName, accessToken)
          // const obj = { userData: { ...user, password: undefined } }

          // // ** return 200 with user data
          // response = [200, obj]
        }
      } else {
        // ** If token is valid do nothing
        // @ts-ignore
        const userId = decoded.id;

        try {
          const responseData = await axios.get(`/api/getuser`, {
            headers: {
              "Content-Type": "application/json",
            },
            params: {
              _id: userId,
            },
          });

          if (responseData.status === 200) {
            const userData = responseData.data.user;
            delete userData.password; // Remove password from the response
            console.log("userData :>> ", userData);

            response = [200, { userData }];
            resolve(response); // Return the final response
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          resolve([500, { error: "Server error" }]); // Resolve with error
        }
      }
    });
  });
});
