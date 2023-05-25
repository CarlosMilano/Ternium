import { Theme, createTheme } from "@mui/material";

export const themeColors = {
    primario: "#FF9900",
    rojoTernium: "#ff3300",
    grisTernium: "#666666",
    naranjaTernium: "#ff9900",
    celesteTernium: "#01688a",
    grisPalidoTernium: "#d4d4d4",
    grisAceroTernium: "#485458",
};

export const muiTheme: Theme = createTheme({
    palette: {
        primary: {
            main: themeColors.celesteTernium,
        },
    },
});
