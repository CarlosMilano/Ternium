import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent, SelectProps } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { ReactNode } from "react";

interface DropdownSelectProps extends SelectProps {
    options: string[];
}

export const DropdownSelect = ({
    labelId,
    options,
    value,
    label,
    ...selectProps
}: DropdownSelectProps): JSX.Element => {
    return (
        <FormControl>
            <InputLabel id={labelId}>{label}</InputLabel>
            <Select labelId={labelId} value={value || ""} {...selectProps}>
                <MenuItem value="" disabled>
                    Selecciona una opción
                </MenuItem>
                {options.map((option: string) => {
                    return (
                        <MenuItem value={option} key={option}>
                            {option}
                        </MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    );
};
