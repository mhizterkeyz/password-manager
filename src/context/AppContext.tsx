import { createContext, PropsWithChildren, useContext, useState } from "react";
import { noop } from "../utils";

export interface IAppState {
  background: AppBackground;
}

export interface IUser {
  id: string;
  email: string;
  username: string;
  authToken: string;
  isLoggedIn: boolean;
}

export interface IPasswordItem {
  image?: string;
  domain: string;
  username?: string;
  password: string;
  id: string;
}

export interface IGenerator {
  id?: string;
  domain: string;
  username?: string;
  password: string;
}

export interface IAppContext {
  appState: IAppState;
  updateAppState: (arg: Partial<IAppState>) => void;
  user: IUser;
  updateUser: (arg: Partial<IUser>) => void;
  passwords: IPasswordItem[];
  updatePasswords: (arg: IPasswordItem[]) => void;
  logoutUser: () => void;
  generator: IGenerator;
  updateGenerator: (arg: IGenerator) => void;
}

type AppBackground = "light" | "grey";

export const defaultAppState: IAppState = { background: "grey" };
export const defaultUser: IUser = {
  id: "",
  email: "",
  username: "",
  authToken: "",
  isLoggedIn: false,
};
export const defaultGenerator: IGenerator = {
  id: "",
  domain: "",
  username: "",
  password: "",
};
export const defaultAppContext: IAppContext = {
  appState: defaultAppState,
  updateAppState: noop,
  user: defaultUser,
  updateUser: noop,
  passwords: [],
  updatePasswords: noop,
  logoutUser: noop,
  generator: defaultGenerator,
  updateGenerator: noop,
};
export const AppContext = createContext<IAppContext>(defaultAppContext);

export const AppContextProvider = (props: PropsWithChildren<unknown>) => {
  const [appState, setAppState] = useState(defaultAppContext.appState);
  const [user, setUser] = useState(defaultAppContext.user);
  const [passwords, setPasswords] = useState(defaultAppContext.passwords);
  const [generator, setGenerator] = useState(defaultAppContext.generator);

  const updateAppState = (values: Partial<IAppState>) => {
    const newAppState = { ...appState, ...values };
    setAppState(newAppState);
  };
  const updateUser = (values: Partial<IUser>) => {
    const newUser = { ...user, ...values };
    setUser(newUser);
  };
  const logoutUser = () => {
    setUser(defaultAppContext.user);
    delete localStorage.loggedUser;
  };

  return (
    <AppContext.Provider
      value={{
        appState,
        updateAppState,
        user,
        updateUser,
        passwords,
        updatePasswords: setPasswords,
        logoutUser,
        generator,
        updateGenerator: setGenerator,
      }}
      children={props?.children}
    />
  );
};

export const useAppContext = (): IAppContext => {
  const appContext = useContext<IAppContext>(AppContext);

  return appContext;
};
