import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Head from "next/head";
import Image from "next/image";
import InputAdornment from "@mui/material/InputAdornment";
import LockOutlined from "@mui/icons-material/LockOutlined";
import MailOutline from "@mui/icons-material/MailOutline";
import React, { FormEvent, FormEventHandler, useEffect, useState } from "react";
import Stack from "@mui/system/Stack"; // Why is it in /system and not in /material?
import styled from "@emotion/styled";
import terniumLogo from "../../public/assets/imgs/ternium_logo_white.png";
import TextField from "@mui/material/TextField";
import { auth } from "../../config/environment/firebase";
import { Unsubscribe, User, UserCredential, signInWithEmailAndPassword } from "firebase/auth";
import { themeColors } from "../../config/theme";
import { useUser } from "@/providers/user";

const LoginTextField = styled(TextField)(({ theme }) => ({
    width: "clamp(35%, 320px, 80%)",
    "& .MuiFilledInput-underline:before": {
        borderBottomColor: "rgba(255,255,255,0.5)",
    },
    "&:hover .MuiFilledInput-underline:before": {
        borderBottomColor: "white",
    },
    "& .MuiFilledInput-underline:after": {
        borderBottomColor: themeColors.rojoTernium,
    },
    // Label
    "& label": {
        color: "rgba(255,255,255,0.5)",
    },
    "&:hover label": {
        color: "white",
    },
    "& label.Mui-focused": {
        color: "white",
    },
    "&.Mui-focused fieldset": {
        borderColor: "white",
    },
    "& .MuiFilledInput-root": {
        backgroundColor: "rgba(255,255,255,0.1)",
        "& input": {
            color: "white",
        },
        "& .MuiInputAdornment-root": {
            color: "rgba(255,255,255,0.5)",
        },
    },
    "&:hover .MuiFilledInput-root": {
        "& .MuiInputAdornment-root": {
            color: "white",
        },
    },
    "& .MuiFilledInput-root.Mui-focused": {
        backgroundColor: "rgba(255,255,255,0.1)",
        "& .MuiInputAdornment-root": {
            color: themeColors.rojoTernium,
        },
    },
}));
const LoginButton = styled(Button)(({ theme }) => ({
    color: "white",
    borderColor: "rgba(255,255,255,0.5)",
    "&:hover": {
        borderColor: "white",
    },
    "&:focus .MuiTouchRipple-root": {
        color: "var(--red-ternium)",
    },
}));

const Login = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [wrongPassword, setWrongPassword] = useState<boolean>(false);
    const { user } = useUser();

    // useEffect(() => {
    //     const unsubscribe: Unsubscribe = auth.onAuthStateChanged((user: User | null) => {
    //         if (user) {
    //             console.log(user);
    //         } else {
    //             console.log("%cLa sesión no está iniciada.", "color: yellow;");
    //         }
    //     });
    //     return () => unsubscribe();
    // }, []);

    const handleOnSubmit: FormEventHandler<HTMLFormElement> = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        try {
            const user: UserCredential = await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            console.error("Credentials are not valid.");
            setWrongPassword(true);
        }
    };

    return (
        <Box sx={{ bgcolor: themeColors.primario, height: "100vh", width: "100%" }}>
            <Head>
                <title>Log In</title>
                <meta name="description" content="Formulario para inicio de sesión." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Stack alignItems="center" spacing={8} sx={{ bgcolor: themeColors.primario }}>
                <Image
                    alt="ternium-logo"
                    src={terniumLogo}
                    width={512 / 2}
                    height={178 / 2}
                    style={{ marginTop: "200px" }}
                />
                <form style={{ width: "100%" }} onSubmit={handleOnSubmit}>
                    <Stack alignItems="center" spacing={4}>
                        <Stack alignItems="center" spacing={2} sx={{ width: "100%" }}>
                            <LoginTextField
                                id="email"
                                label="Correo Electronico"
                                variant="filled"
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <MailOutline sx={{ mr: 1 }} />
                                        </InputAdornment>
                                    ),
                                }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value.trim())}
                            />
                            <LoginTextField
                                id="password"
                                label="Contraseña"
                                type="password"
                                variant="filled"
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockOutlined sx={{ mr: 1 }} />
                                        </InputAdornment>
                                    ),
                                    required: true,
                                }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value.trim())}
                            />
                        </Stack>
                        {wrongPassword && (
                            <Alert severity="error">
                                <AlertTitle>Error</AlertTitle>
                                Usuario y/o contraseñas incorrectas <strong>Vuelve a intentar!</strong>
                            </Alert>
                        )}
                        <LoginButton variant="outlined" type="submit">
                            Entrar
                        </LoginButton>
                    </Stack>
                </form>
            </Stack>
        </Box>
    );
};

export default Login;
