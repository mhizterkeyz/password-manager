import { useEffect } from "react";

import { Generator } from "../components/generator.component";
import { Passwords } from "../components/passwords.component";
import { useAppContext } from "../context/AppContext";

export const Home = () => {
  const { updateAppState, appState } = useAppContext();
  useEffect(() => {
    if (appState.background !== "light") {
      updateAppState({ background: "light" });
    }

    return () => {
      updateAppState({ background: "grey" });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Generator />
      <Passwords />
    </>
  );
};
