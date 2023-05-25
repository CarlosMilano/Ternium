import { Box, CircularProgress } from "@mui/material";
import { height } from "@mui/system";
import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";

const UserContext = createContext({});

const UserProvider = ({ children }) => {
  const router = useRouter();
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    if (router.pathname !== "/login" && !isLogged) router.push("/login");
    if (isLogged) router.push("/search");
    console.log("isLogged: ", isLogged);
  }, [isLogged]);

  return (
    <UserContext.Provider
      value={{
        isLogged,
        setIsLogged,
      }}
    >
      {router.pathname === "/login" || isLogged ? (
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
