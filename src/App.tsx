import { Switch, Route } from "react-router";
import { useContext, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
import { LoginForm, SignupForm } from "./components/auth-form.component";
import { AppContext, IAppContext } from "./context/AppContext";
import { Home } from "./pages/home.page";
import { Header } from "./components/header.component";
import { $api } from "./utils/api";

function App() {
  const { appState, updateUser } = useContext<IAppContext>(AppContext);

  useEffect(() => {
    try {
      const user = $api.users.recoverAuth();
      $api.setAuthHeader(user?.token as string);
      updateUser({ ...user, isLoggedIn: true });
    } catch (error) {
      // Try to recover auth and faile
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`App App__background__${appState.background}`}>
      <Header />
      <Switch>
        <Route path="/login" component={LoginForm} />
        <Route path="/signup" component={SignupForm} />
        <Route component={Home} />
      </Switch>

      <ToastContainer hideProgressBar={true} autoClose={3000} />
    </div>
  );
}

export default App;
