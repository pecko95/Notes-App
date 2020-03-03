import jwt from "jsonwebtoken";
import env from "../config/index";

function validateJWT(req, res, next) {
  const authorizationHeader = req.headers.authorization;
  let result = {};

  // Check if authorization exists
  if (authorizationHeader) {
    // Get the token - in this case Bearer Token
    const token = req.headers.authorization.split(' ')[1]; // -> "Authorization": `Bearer ${token} = get the 'token' value
    
    // Options to verify the reiceved token with - must match the options we provide
    const options = {
      expiresIn: "1h", 
      issuer: "http://notes-app:heroku"
    }

    try {
      // jwt.verify() - ensures the token is provided by us and not expired
      result = jwt.verify(token, env.JWT_SECRET, options);

      // Pass the DECODED token back to the request object
      req.decoded = result;

      next();
    } catch (err) {
      // throw new Error(err); // Generic error..

      // Custom error
      result.status = 401;
      result.error = "Invalid JWT. Be sure to login with existing username / password first.";

      res.status(result.status).send(result);
    }
  } else {
    // Authorization fails if there is no authorization header passed.
    result.status = 401;
    result.error  = "Authentication failed. Invalid token credentials.";
 
    res.status(401).send(result);
  }
  
}

export default validateJWT;