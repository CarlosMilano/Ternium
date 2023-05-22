import Button, { ButtonProps } from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Popover from "@mui/material/Popover";
import { styled } from "@mui/material/styles";
import { useState, useEffect, MouseEvent } from "react";

/**
 * A styled wrapper of the Button component.
 * Used for Buttons with variant 'outlined'.
 */
export const OutlinedButton = styled(Button)(({ theme }) => {
    return {
        borderColor: "var(--ternium-rojo)",
        paddingBlock: "0.5rem",
    };
});

/**
 * A styled wrapper of the Button component.
 * Used for Buttons with variant 'text'.
 */
export const TextButton = styled(Button)(({ theme }) => {
    return {
        color: "var(--ternium-gris-acero)",
    };
});

export interface DropdownButtonProps extends ButtonProps {
    /**
     * An array of the options displayed on the dropdown.
     */
    options: string[];
    /**
     * A text to be displayed at the top of the dropdown, disabled.
     * Used as an instruction to the user.
     */
    instruction: string;
    /**
     * A handler function for clicking any of the dropdown options.
     *
     * @param e - A mouse event passed down from onClick.
     * @param option - The text value of the option selected.
     */
    onClickOption: (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>, option: string) => void;
}
/**
 * DropdownButton component.
 * 
 * A Button component that displays a dropdown list.
 */
export const DropdownButton: React.FC<DropdownButtonProps> = ({
    options,
    instruction,
    onClickOption,
    children,
    ...buttonProps
}): JSX.Element => {
    // The button element that displays the dropdown.
    // Null if the dropdown is hidden.
    const [anchorButton, setAnchorButton] = useState<HTMLElement | null>(null);
    // Closes the Popover if there are no options.
    useEffect(() => {
        if (options.length === 0) setAnchorButton(null);
    }, [options]);

    return (
        <>
            <Button
                onClick={(e: MouseEvent<HTMLButtonElement>) => setAnchorButton(e.currentTarget)}
                disabled={options.length === 0}
                {...buttonProps}
            >
                {children}
            </Button>
            <Popover
                anchorEl={anchorButton}
                onClose={() => setAnchorButton(null)}
                open={Boolean(anchorButton)}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            >
                <List>
                    <ListItem disablePadding>
                        <ListItemButton disabled>
                            <ListItemText primary={instruction}></ListItemText>
                        </ListItemButton>
                    </ListItem>
                    {options.map((option: string) => (
                        <ListItem disablePadding key={option}>
                            <ListItemButton onClick={(e: MouseEvent<HTMLDivElement>) => onClickOption(e, option)}>
                                <ListItemText primary={option}></ListItemText>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Popover>
        </>
    );
};
