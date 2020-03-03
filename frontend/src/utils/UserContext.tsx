import React, { useState, useEffect, createContext } from "react";

interface IUserContext {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  role: string;
  isLoggedIn: boolean;
  updateContext: (data: any) => void;
}

interface IUserContextProvider {
  children: React.ReactNode;
}

const UserContext = createContext<IUserContext | null>(null);
const UserContextConsumer = UserContext.Consumer;

const UserContextProvider = (props: IUserContextProvider) => {
  const [userDetails, setUserDetails] = useState({
    id: "",
    first_name: "",
    last_name: "",
    username: "",
    role: "",
    isLoggedIn: false
  });

  // Update the user details context
  const updateContext = (data: any) => {
    const { id, first_name, last_name, username, role, isLoggedIn } = data;

    setUserDetails({
      id: "",
      first_name: "",
      last_name: "",
      username: "",
      role: "",
      isLoggedIn
    })
  }

  return (
    <UserContext.Provider value={{...userDetails, updateContext: updateContext}}>
      {props.children}
    </UserContext.Provider>
  )
}

export { UserContext, UserContextConsumer, UserContextProvider }