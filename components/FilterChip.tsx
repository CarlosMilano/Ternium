import Stack from "@mui/material/Stack";
import Chip, { ChipProps } from "@mui/material/Chip";
import Close from "@mui/icons-material/Close";
import Popover from "@mui/material/Popover";
import TextField from "@mui/material/TextField";
import { ChangeEvent, FormEvent, FormEventHandler, MouseEvent, useState } from "react";
import { DropdownSelect } from "./themed/ThemedSelects";
import { OutlinedButton } from "./themed/ThemedButtons";
import { FilterConditionals } from "@/utils/types/filters";

type FilterChipState = "disabled" | "saved" | "unsaved";

interface FilterChipProps extends ChipProps {
    type: "string" | "number" | "boolean";
    onClickFilter: (condition: FilterConditionals, value: string) => void;
}
const FilterChip: React.FC<FilterChipProps> = ({ type, onClickFilter, label, ...chipProps }): JSX.Element => {
    // The button element that displays the dropdown.
    // Null if the dropdown is hidden.
    const [anchorChip, setAnchorChip] = useState<HTMLDivElement | null>(null);
    // The current selected conditional.
    const [conditional, setConditional] = useState<string>("");
    // The current value to be compared.
    const [value, setValue] = useState<string>("");
    // The saved values after pressing the filter button.
    const [savedData, setSavedData] = useState<{ condition: string; value: string } | null>(null);
    // Temporary random string to set as ID.
    const randomID: string = new Date().toDateString();
    // The current state of the chip, according to its values.
    const state: FilterChipState =
        savedData === null && conditional === "" && value === ""
            ? "disabled"
            : savedData === null || savedData.condition !== conditional || savedData.value !== value
            ? "unsaved"
            : "saved";

    const handleSubmitFilter: FormEventHandler<HTMLFormElement> = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const condition: FilterConditionals | null =
            type === "string" || type === "boolean" || conditional === "Igual a"
                ? "="
                : conditional === "Menor a"
                ? "<"
                : conditional === "Mayor a"
                ? ">"
                : null;
        const newValue: string =
            type !== "boolean" ? value : value === "Activo" ? "true" : value === "Inactivo" ? "false" : "";
        if (condition && newValue.length !== 0) {
            onClickFilter(condition, newValue);
            setSavedData({ condition: conditional, value: value });
        } else {
            console.log("Filter unfinished!");
        }
    };

    return (
        <>
            <Chip
                variant="outlined"
                label={savedData ? `${label}: ${savedData.condition} ${savedData.value}` : label}
                color={state === "disabled" ? "default" : state === "unsaved" ? "warning" : "primary"}
                style={state === "disabled" ? { color: "grey" } : {}}
                deleteIcon={<Close sx={{ padding: "0.1rem" }} />}
                size="medium"
                sx={{ padding: "0.25rem" }}
                clickable
                onClick={(e: MouseEvent<HTMLDivElement>) => setAnchorChip(e.currentTarget)}
                {...chipProps}
            />
            <Popover
                anchorEl={anchorChip}
                onClose={() => setAnchorChip(null)}
                open={Boolean(anchorChip)}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            >
                <form onSubmit={handleSubmitFilter}>
                    <Stack gap={2} sx={{ padding: 2 }}>
                        {type === "number" && (
                            <DropdownSelect
                                id={randomID}
                                label="Condición"
                                labelId={`label-${randomID}`}
                                onChange={(e) => setConditional(e.target.value as string)}
                                options={["Menor a", "Mayor a", "Igual a"]}
                                value={conditional}
                                required
                                sx={{ width: 240 }}
                            />
                        )}
                        {(type === "string" || type === "number") && (
                            <TextField
                                label="Valor"
                                value={value}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
                                sx={{ width: 240 }}
                                required
                                inputProps={type === "number" ? { inputMode: "numeric", pattern: "[0-9]*" } : {}}
                            />
                        )}
                        {type === "boolean" && (
                            <DropdownSelect
                                id={`${label}-value`}
                                label="Selecciona"
                                labelId={`${label}-label`}
                                onChange={(e) => setValue(e.target.value as string)}
                                options={["Activo", "Inactivo"]}
                                value={value}
                                required
                                sx={{ width: 240 }}
                            />
                        )}
                        <Stack direction="row" justifyContent="end">
                            <OutlinedButton type="submit">Filtrar</OutlinedButton>
                        </Stack>
                    </Stack>
                </form>
            </Popover>
        </>
    );
};

export default FilterChip;
