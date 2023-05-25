import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

const UserContext = createContext({});

const UserProvider = ({ children }) => {
    const router = useRouter();
    const [isLogged, setIsLogged] = useState(false);

    console.log(router.pathname);

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
