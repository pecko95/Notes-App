import User from "../models/user";
import { Service } from "typedi";

Service();
export default class AccountService {
  constructor() {
    this.status = 200;
    this.error = "";
    this.message = "";
  }

  // Signup - creating new users
  async Signup(userData) {
    const user = await User.create(userData);

    return user;
  }

  // Login - with existing users
  async Login() {
    console.log('login');
  }

  // Refresh tokens - check for refresh tokens and generate new access tokens if conditions are met
  async Token() {
    console.log('token');
  }

}