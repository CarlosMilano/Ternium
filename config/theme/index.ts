import { Theme, createTheme } from "@mui/material/styles";

export const themeColors = {
    primario: "#FF9900",
    rojoTernium: "#ff3300",
    grisTernium: "#666666",
    naranjaTernium: "#ff9900",
    celesteTernium: "#01688a",
    grisPalidoTernium: "#d4d4d4",
    grisAceroTernium: "#485458",
};

interface TerniumTheme {
    colors: {
        rojoTernium: string;
        grisTernium: string;
        naranjaTernium: string;
        celesteTernium: string;
        grisPalidoTernium: string;
        grisAceroTernium: string;
    };
}

declare module "@mui/material/styles" {
    interface Theme extends TerniumTheme {}
    interface ThemeOptions extends TerniumTheme {}
}

export const muiTheme: Theme = createTheme({
    palette: {
        primary: {
            main: themeColors.celesteTernium,
        },
    },
    colors: {
        rojoTernium: "#ff3300",
        grisTernium: "#666666",
        naranjaTernium: "#ff9900",
        celesteTernium: "#01688a",
        grisPalidoTernium: "#d4d4d4",
        grisAceroTernium: "#485458",
    },
});
