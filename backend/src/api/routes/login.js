import { Router } from "express";
import User from "../../models/user";
import jwt from "jsonwebtoken";
import env from "../../config/index";
import generateJWT from "../../utils/generateJWT";

const route = Router();

const loginRoute = app => {
  app.use("/login", route);

  route.post("/", (req, res, next) => {
    // Get the username and password that were provided
    const { username, password } = req.body;
    let result = {};
    let status = 200;

    if (!username || !password) {
      status = 403;
      result.status = status;
      result.error = "Please enter username and/or password."
      res.status(status).send(result);
    } else {
      // Check if the user exists and is authenticated
      User.authenticate(username, password, async(err, user) => {
        if(err) {
          status = 500;
          result.status = status;
          result.error = `${err}`
        } else if (!user) {
          status = 401;
          result.status = status;
          result.error = "Authentication failed. Please provide matching username and password!"
        } else {
          // If login passes
          status = 200;

          // Create the JWT
          await generateJWT(res, user);
          console.log("GENERATED COOKIE");
          // const payload = { user };

          // // Options - exipiry date, issued by etc.
          // const options = { expiresIn: "1h", issuer: "http://notes-app:heroku"};
          
          // // JWT Secret from ENV
          // const secret = env.JWT_SECRET;

          // // Sign the token
          // const token = jwt.sign(payload, secret, options);

          // Return the token details as a response
          // result.token = token;
          result.status = status;
          result.result = user;
        }

        res.status(status).send(result);
      })
    }
  })
}

export default loginRoute;