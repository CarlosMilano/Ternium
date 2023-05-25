import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { muiTheme } from "@/config/theme";
import { ThemeProvider } from "@emotion/react";
import { UserProvider } from "@/providers/user";
import { CssBaseline } from "@mui/material";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider theme={muiTheme}>
            <CssBaseline></CssBaseline>
            <UserProvider>
                <Component {...pageProps} />;
            </UserProvider>
        </ThemeProvider>
    );
}
