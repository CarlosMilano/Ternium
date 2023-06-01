import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { createContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/router";
import { Unsubscribe, User } from "firebase/auth";
import { auth } from "@/config/environment/firebase";

const UserContext = createContext<{ user: User | null | undefined }>({ user: undefined });

const UserProvider = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const [user, setUser] = useState<User | null | undefined>(undefined);

    /**
     * onAuthStateChanged gets called each time the user:
     *      - Logs in
     *      - Logs out
     *      - Requests the page by url
     * Each time it changes the state of useState user.
     */
    useEffect(() => {
        const unsubscribe: Unsubscribe = auth.onAuthStateChanged((UserCredentials: User | null) => {
            if (UserCredentials) {
                console.log("%cSesión encontrada!", "color: lime;");
                console.log(UserCredentials);
            } else {
                console.log("%cLa sesión no está iniciada.", "color: yellow;");
            }
            setUser(UserCredentials);
        });
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

    return (
        <UserContext.Provider
            value={{
                user,
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
