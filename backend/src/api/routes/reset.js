import { Router } from "express";
import crypto from "crypto";
import bcrypt from "bcrypt";
import User from "../../models/user";
import RefreshToken from "../../models/refreshTokens";
import { sendMail } from "../../utils/sendMail";

const route = Router();

const resetRoute = app => {
  app.use("/resetpassword", route);

  route.post("/:email", (req, res, next) => {
    const email = req.params.email;
    let result = {};
    let status = 200;

    if (!email) {
      status = 400;
      result.status = status;
      result.error = "Please provide an email address";

      res.status(status).send(result);
    } else {
      // Generate a new random temporary password
      const tempPassword = crypto.randomBytes(48).toString("hex").slice(0, 8);

      // Encrypt the password befor saving it in database
      bcrypt.hash(tempPassword, 10, (err, hashedPassword) => {
        if (err) {
          status = 500;
          result.status = status;
          result.error = err;

          res.status(status).send(result);
        } else {
          // Find the user in the database based on provided email/username and update the password
          User.findOneAndUpdate(
            { 
              username: email 
            }, 
            {
              $set: {
                password: hashedPassword
              }
            }, async(err, user) => {
              if (err) {
                status = 500;
                result.status = status;
                result.error = err;

                res.status(status).send(result);
              } else if (!user) {
                status = 404;
                result.status = status;
                result.error = "User does not exist!";

                res.status(status).send(result);
              } else {
                /*
                  TODO: Change logged-in user invalidation to use a function for code readability and reuseability
                */
                const refreshToken = req.cookies['notesapp-token'];

                // Remove the refresh token from the database
                RefreshToken.findOneAndRemove({ refreshToken }, err => {
                  if (err) {
                    status = 500;
                    result.status = status;
                    result.error = err;

                    res.status(status).send(result);
                  }
                })

                // Mail options
                const mailOptions = {
                  from: "notesapp@notes.com",
                  to: email,
                  subject: "Your password has been reset!",
                  html: `
                    <h1>Password has been successfully reset!</h1>
                      
                    <p>Here is your new password: <strong>${tempPassword}</strong></p> 
                    
                    <p>Be sure to change it after you login into your account next time!</p>
                  `
                }

                // Send the mail
                await sendMail(mailOptions);

                status = 200;
                result.status = status;
                result.message = "Password has been reset!";

                return res.status(status).send(result);
            }

          })
        }

      })
    }

  })
}

export default resetRoute;