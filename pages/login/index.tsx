import styled from "@emotion/styled";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Stack } from "@mui/system";
import Head from "next/head";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import terniumLogo from "../../public/assets/imgs/ternium_logo_white.png";
import { themeColors } from "../../config/theme";
import { LockOutlined, MailOutline } from "@mui/icons-material";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/environment/firebase";
import { useRouter } from "next/router";
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [wrongPassword, setWrongPassword] = useState(false);
  const { setIsLogged } = useUser();

  const router = useRouter();

  const handleOnSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
  };

  console.log("env", process.env.HOLA);

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setIsLogged(true);
        console.log("aqui se cambia el login, HAndle logn");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setWrongPassword(true);
      });
  };

  return (
    <Box sx={{ bgcolor: themeColors.primario, height: "100vh", width: "100%" }}>
      <Head>
        <title>Log In</title>
        <meta name='description' content='Formulario para inicio de sesión.' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Stack
        alignItems='center'
        spacing={8}
        sx={{ bgcolor: themeColors.primario }}
      >
        <Image
          alt='ternium-logo'
          src={terniumLogo}
          width={512 / 2}
          height={178 / 2}
          style={{ marginTop: "200px" }}
        />
        <form style={{ width: "100%" }} onSubmit={handleOnSubmit}>
          <Stack alignItems='center' spacing={4}>
            <Stack alignItems='center' spacing={2} sx={{ width: "100%" }}>
              <LoginTextField
                id='email'
                label='Correo Electronico'
                variant='filled'
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <MailOutline sx={{ mr: 1 }} />
                    </InputAdornment>
                  ),
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
              />
              <LoginTextField
                id='password'
                label='Contraseña'
                type='password'
                variant='filled'
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
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
              <Alert severity='error'>
                <AlertTitle>Error</AlertTitle>
                Usuario y/o contraseñas incorrectas{" "}
                <strong>Vuelve a intentar!</strong>
              </Alert>
            )}
            <LoginButton onClick={handleLogin} variant='outlined' type='submit'>
              Entrar
            </LoginButton>
          </Stack>
        </form>
      </Stack>
    </Box>
  );
};

export default Login;
