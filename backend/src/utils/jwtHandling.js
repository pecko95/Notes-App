import jwt from "jsonwebtoken";
import env from "../config/index";

export const validateJWT = async(req, res, next) => {
  // Check if token exists in request header
  const authorizationHeader = req.headers['authorization'];
  const token = authorizationHeader && authorizationHeader.split(" ")[1]; // Bearer token - get token value
  let status = 200;
  let result = {};

  if (!token) {
    status = 401;
    result.status = status;
    result.error = "No token provided."
  }

  // Verify the token and check for expiration
  jwt.verify(token, env.JWT_SECRET, (err, user) => {
    if (err) {
      status = 403;
      result.status = status;
      result.error = "Token is not valid. Forbidden access";

      res.status(status).send(result);
    } else {
      // Send the decoded token in the requests to any other route
      req.decoded = user;

      // Call next middleware / route functionality
      next();
    }

  })
}

export default validateJWT;