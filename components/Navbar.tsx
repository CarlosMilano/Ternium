import AppBar, { AppBarProps } from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Logout from "@mui/icons-material/Logout";
import Toolbar from "@mui/material/Toolbar";
import Image from "next/image";
import Link from "next/link";
import { TextButton } from "./themed/ThemedButtons";
import { MouseEvent, MouseEventHandler } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/config/environment/firebase";

interface NavbarProps extends AppBarProps {}

const Navbar: React.FC<NavbarProps> = ({ variant, elevation, position, color, style, ...appBarProps }): JSX.Element => {
    const handleOnClick: MouseEventHandler<HTMLButtonElement> = async (e: MouseEvent<HTMLButtonElement>) => {
        try {
            await signOut(auth);
        } catch (err) {
            console.error("There was an error during the sign out.");
        }
    };

    return (
        <AppBar
            variant="outlined"
            elevation={0}
            position="static"
            color="transparent"
            style={{ border: "none" }}
            sx={{ paddingTop: 2 }}
            {...appBarProps}
        >
            <Toolbar>
                <Link href="/">
                    <Box width={128 / 1.25} height={42 / 1.25} position="relative">
                        <Image src="/assets/imgs/ternium_color.png" alt="Logo de Ternium" fill sizes="100%" priority />
                    </Box>
                </Link>
                <Box sx={{ flexGrow: 1 }} />
                <TextButton variant="text" startIcon={<Logout></Logout>} onClick={handleOnClick}>
                    Cerrar Sesión
                </TextButton>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
