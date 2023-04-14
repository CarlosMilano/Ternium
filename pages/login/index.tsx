import styled from "@emotion/styled";
import { Box, Button, InputAdornment, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import Head from "next/head";
import Image from "next/image";
import React, { useState } from "react";
import terniumLogo from "../../public/assets/imgs/ternium_logo_white.png";
import { themeColors } from "../../config/theme";

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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleOnSubmit = (e) => {
    e.preventDefault();
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
                // InputProps={{
                //     startAdornment: (
                //         <InputAdornment position="start">
                //             <MailOutline sx={{ mr: 1 }} />
                //         </InputAdornment>
                //     ),
                // }}
                value={username}
                onChange={(e) => setUsername(e.target.value.trim())}
              />
              <LoginTextField
                id='password'
                label='Contraseña'
                type='password'
                variant='filled'
                required
                // InputProps={{
                //     startAdornment: (
                //         <InputAdornment position="start">
                //             <LockOutlined sx={{ mr: 1 }} />
                //         </InputAdornment>
                //     ),
                //     required: true,
                // }}
                value={password}
                onChange={(e) => setPassword(e.target.value.trim())}
              />
            </Stack>
            <LoginButton variant='outlined' type='submit'>
              Entrar
            </LoginButton>
          </Stack>
        </form>
      </Stack>
    </Box>
  );
};

export default Login;
