import jwt from "jsonwebtoken";
import env from "../config/index";

const generateJWT = (res, user) => {
  const expiration = 360 // Seconds
  const payload = { user };
  const secret = env.JWT_SECRET;
  const options = {
    expiresIn: "10m",
    issuer: "http://notes-app:heroku"
  };

  // Generate the token
  const token = jwt.sign(payload, secret, options);

  return res.cookie("notes-app_token", token, {
    expires: new Date(Date.now() + expiration),
    secure: false, // turn to true if using HTTPS - when hosting on heroku
    httpOnly: true
  });
}

export default generateJWT;
