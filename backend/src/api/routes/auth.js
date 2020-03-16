import { Router } from "express";
import User from "../../models/user";
import { generateAccessToken, generateRefreshToken } from "../../utils/tokens";
import jwt from "jsonwebtoken";
import env from "../../config/index";
import RefreshToken from "../../models/refreshTokens";

const route = Router();

const authRoutes = app => {
  app.use("/auth", route);
  let result = {};
  let status = 200;
  
  // Login route
  route.post("/login", (req, res) => {
    // Get login details
    const { username, password } = req.body;
    status = 200;
    result = {};

    if (!username || !password) {
      status = 400;
      result.status = status;
      result.error = "Please fill all required fields.";

      res.status(status).send(result);
    } else {
      // Check if user exists in database and get his details
      User.authenticate(username, password, async(err, user) => {
        if (err) {
          status = 400;
          result.status = status;
          result.error = "Provide credentials for existing user!";

          res.status(status).send(result);
        } else if (!user) {
          status = 404;
          result.status = status;
          result.error = "User does not exist and/or password does not match!";
          
          res.status(status).send(result);
        } else {
          // User details for token creation
          const userDetails = {
            username: user.username,
            id: user.id,
            role: user.role,
            first_name: user.first_name,
            last_name: user.last_name
          }

          // User exists and logs in successfully
          const accessToken  = await generateAccessToken(userDetails);
          const refreshToken = await generateRefreshToken(userDetails);

          // Save the created token in data base
          RefreshToken.create({ refreshToken: refreshToken }, (err, token) => {
            if (err) {
              status = 500;
              result.status = status;
              result.error = "Something went wrong!";
            } else {
              status = 200;
              result.status = status;
              result.message = "Refresh token saved to database!";
            }
          })
          
          // Save the refresh token as an HTTP ONLY cookie
          res.cookie('notesapp-token', refreshToken, {
            expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 7)), // 7 days
            httpOnly: true,
            secure: false
          })

          status = 200;
          result.status = status;
          result.data = {
            ...userDetails,
            token: accessToken
          }

          res.status(status).send(result);
        }

      })
    }
  })

  // Logout - delete a specific refresh token from the database
  route.delete("/logout", (req, res) => {
    const refreshToken = req.cookies['notesapp-token'];
    status = 200;
    result = {};

    // Remove the refresh token from DATABASE instead of memory
    RefreshToken.findOneAndRemove({ refreshToken }, (err, deletedToken) => {
      if (err) {
        status = 500;
        result.status = status;
        result.error = "Something went wrong!";
      } else {
        status = 204;
        result.status = status;
        result.message = "Successfully deleted refresh token.";
      }
    })

    // Destroy the cookie
    res.cookie('notesapp-token', '', {  
      expires: new Date(0),
      domain: 'localhost',
      path: '/'
    })

    status = 204;
    result.status = status;
    result.message = "User logged out!";

    res.status(status).send(result);
  })

  // Token refresh route
  route.post("/token", (req, res) => {
    const authorization = req.headers['authorization'];
    const token = authorization && authorization.split(" ")[1];
    const refreshToken = req.cookies['notesapp-token'];
    status = 200;
    result = {};

    // If no access token is passed
    if (!token) {
      status = 401;
      result.status = status;
      result.error = "Not authorized!";

      return res.status(status).send(result);
    }

    /* 
      Search trough the data base and check if refresh token exists.
      If refresh token does not exist in database, return 403.
      If refresh token exists in database, proceed to verify it and check if it has expired
    */

    RefreshToken.findOne({ refreshToken }, (err, token) => {
      if (err) {
        status = 500;
        result.status = status;
        result.error = "Something went wrong!";

        return res.status(status).send(result);
      } else if (!token || !refreshToken) {
        // If the token does not exists
        status = 403;
        result.status = status;
        result.error = "Access forbidden!";

        return res.status(status).send(result);
      } else {
        // If access token is expired but timed out, and there is refresh token, issue new access token
        jwt.verify(refreshToken, env.JWT_REFRESH_SECRET, async(err, user) => {
          if (err) {
            // Remove the refresh token from database if refresh token is expired
            RefreshToken.findOneAndRemove({ refreshToken });

            status = 403;
            result.status = status;
            result.error = "Access forbidden.";

            return res.status(status).send(result);
          } else {
            const userDetails = {
              username: user.username,
              id: user.id,
              role: user.role,
              first_name: user.first_name,
              last_name: user.last_name
            }
            const newAccessToken = await generateAccessToken(userDetails);

            status = 200;
            result.status = status;
            result.data = {
              ...userDetails,
              accessToken: newAccessToken
            };

            res.status(status).send(result);
          }
          
        })
      }
    });

  })
}

export default authRoutes;