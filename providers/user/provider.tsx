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
        const unsubscribe: Unsubscribe = auth.onAuthStateChanged((UserCredentials: User | null) => {
            if (UserCredentials) {
                const userRoles = getRole(UserCredentials.uid);
                setUserRoles(userRoles);
            }
            setUser(UserCredentials);
        });
        return () => unsubscribe();
    }, []);

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
