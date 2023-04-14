import { themeColors } from "@/config/theme";
import { Box, Typography } from "@mui/material";
import Head from "next/head";
import React from "react";

function Search() {
  return (
    <Box sx={{ bgcolor: "white", height: "100vh", width: "100%" }}>
      <Head>
        <title>Log In</title>
        <meta name='description' content='Formulario para inicio de sesión.' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Typography color={"black"}>Search</Typography>
    </Box>
  );
}

export default Search;
