import { Router } from "express";
import { Container } from "typedi"
import AccountService from "../../services/AccountService";
import handleResponse from "../../utils/handleResponse";

const route = Router();

const signupRoute = app => {
  app.use("/signup", route);

  // Create new user
  route.post("/", async(req, res, next) => {
    // Destructure payload
    const { username, first_name, last_name, password, role } = req.body;
    let result;

    // Validate input
    if (!username || !first_name || !last_name || !password || !role) {
      status = 400;
      result.status = status;
      result.error = "Please enter all required fields!";

      return res.status(status).send(result);
    }

    const userData = {
      username,
      first_name,
      last_name,
      password,
      role
    };

    try {
      const accountService = Container.get(AccountService);
      const newUser = await accountService.Signup(userData);

      result = await handleResponse(201, "", "Successfully created new user!", newUser);
    } catch(err) {
      let error = "";

      // Check if error is related to existing user in the database
      if (err.code === 11000) {
        error = "User already exists!";
      } else {
        error = err;
      }
      
      result = await handleResponse(500, error);
    }
    
    return res.status(result.status).send(result);
  })
}

export default signupRoute;