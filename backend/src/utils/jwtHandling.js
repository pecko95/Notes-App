import jwt from "jsonwebtoken";
import env from "../config/index";

const validateJWT = async(req, res, next) => {
  // Check if token exists in the request
  const token = req.cookies.jwt || '';
  let status = 200;
  const result = {};

  try {
    if (!token) {
      status = 401;
      result.status = status;
      result.error = "Not authorized. You need to log in.";

      res.status(status).send(result);
    }
    const decryptedToken = await jwt.verify(token, env.JWT_SECRET);
    req.decoded = decryptedToken;

    next();
  } catch(err) {
    console.log(`ERROR: ${err}`);
    // status = 400;
    // result.status = status;
    // result.error = `${err.message}`;

    // res.status(status).send(result);
  }
}

export default validateJWT;