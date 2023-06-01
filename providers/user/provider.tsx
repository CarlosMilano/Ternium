import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { createContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/router";
import { Unsubscribe, User } from "firebase/auth";
import { auth } from "@/config/environment/firebase";
import { getRole } from "@/utils/functions";

const UserContext = createContext<{
  user: User | null | undefined;
  userRoles: object;
}>({
  user: undefined,
  userRoles: {},
});

const UserProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [userRoles, setUserRoles] = useState({});

  /**
   * onAuthStateChanged gets called each time the user:
   *      - Logs in
   *      - Logs out
   *      - Requests the page by url
   * Each time it changes the state of useState user.
   */
  useEffect(() => {
    const unsubscribe: Unsubscribe = auth.onAuthStateChanged(
      (UserCredentials: User | null) => {
        if (UserCredentials) {
          console.log("%cSesión encontrada!", "color: lime;");
          console.log("User Credentials: ", UserCredentials.uid);
          const userRoles = getRole(UserCredentials.uid);
          setUserRoles(userRoles);
        } else {
          console.log("%cLa sesión no está iniciada.", "color: yellow;");
        }
        setUser(UserCredentials);
      }
    );
    return () => unsubscribe();
  }, []);

  /**
   * This gets executed each time useState user changes state.
   *      i.e. everytime the user logs in/out, or enters the site.
   * This code won't do anything until the first onAuthStateChanged happens.
   */
  useEffect(() => {
    if (user === null) {
      if (router.pathname !== "/login") router.push("/login");
    } else if (user) {
      if (router.pathname === "/login") router.push("/");
    }
  }, [user]);

  // useEffect(() => {
  //     console.log(router.pathname);
  //     if (router.pathname !== "/login" && !user) router.push("/login");
  //     if (router.pathname === "/login" && user) router.push("/search");
  // }, [router.pathname]);

  return (
    <UserContext.Provider
      value={{
        user,
        userRoles,
      }}
    >
      {router.pathname === "/login" || user ? (
        children
      ) : (
        <Box
          sx={{
            height: "100vh",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </UserContext.Provider>
  );
};

export { UserContext };
export default UserProvider;
