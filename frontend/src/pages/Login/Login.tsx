import React, { useState, useEffect, useContext } from "react";
import { Formik, Form, Field } from "formik";
import { RouteComponentProps, withRouter } from "react-router";
import { useHistory } from "react-router-dom";

import InputField from "../../components/Inputs/InputField";
import Button from "../../components/Button/Button";
import { toast } from "react-toastify";
import URL from "../../utils/url";
import { getCookie, setCookie } from "../../utils/cookieHandling";
import { UserContext } from "../../utils/UserContext";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    setCookie("test", "123sad", 1)
  })

  const handleLogin = async(values: { username: string, password: string}) => {
    const { username, password } = values;

    setCookie("test", "asdasdasd1231s", 1)

    setIsLoading(true);
    try {
      const response = await fetch(`${URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      const { result: user, token, status, error } = data;

      console.log("WTF", data.token);

      if (status === 200) {
        setCookie("test", token, 10);

        handleUserContext(user);
        setIsLoading(false);
      } else {
        toast.error(error);
      }

      console.log("USER DATA", data);
    } catch (err) {
      toast.error(err.message);
        setIsLoading(false);
    }
  }

  const userContext = useContext(UserContext);
  const handleUserContext = (user: any) => {
    const { id, first_name, last_name, username, role } = user;
    const updateContext = userContext!.updateContext;

    // Get token from cookie
    const savedToken = getCookie("notes-app_token");

    updateContext({
      id,
      first_name,
      last_name,
      username,
      role,
      isLoggedIn: savedToken ? true : false
    });

    history.push("/");
  }

  return (
    <div>
      <h3>Login Page</h3>
      
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={values => handleLogin(values)}
        render={() => (
          <Form>
            <Field 
              type="email"
              name="username"
              placeholder="example@username.com"
              component={InputField}
            />

            <Field 
              type="password"
              name="password"
              component={InputField}
            />

            <Button type="submit" className="btn btn--md">Login</Button>
          </Form>
        )}
      />
    </div>
  )
}

export default Login;