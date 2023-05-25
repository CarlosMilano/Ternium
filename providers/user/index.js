import { useContext } from "react";
import UserProvider, { UserContext } from "./provider";

const useUser = () => useContext(UserContext);

export { useUser, UserProvider };
