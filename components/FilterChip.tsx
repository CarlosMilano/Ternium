import Stack from "@mui/material/Stack";
import Chip, { ChipProps } from "@mui/material/Chip";
import Close from "@mui/icons-material/Close";
import Popover from "@mui/material/Popover";
import TextField from "@mui/material/TextField";
import { ChangeEvent, FormEvent, FormEventHandler, MouseEvent, useState } from "react";
import { DropdownSelect } from "./themed/ThemedSelects";
import { OutlinedButton } from "./themed/ThemedButtons";
import { FilterConditionals } from "@/utils/types/filters";

interface FilterChipProps extends ChipProps {
    isNumeric?: boolean;
    onClickFilter: (condition: FilterConditionals, value: string) => void;
}

const FilterChip: React.FC<FilterChipProps> = ({ isNumeric, onClickFilter, label, ...chipProps }): JSX.Element => {
    // The button element that displays the dropdown.
    // Null if the dropdown is hidden.
    const [anchorChip, setAnchorChip] = useState<HTMLDivElement | null>(null);
    // The current selected conditional.
    const [conditional, setConditional] = useState<string>("");
    // The current value to be compared.
    const [value, setValue] = useState<string>("");
    // Current selected combination.
    const [selectedCombination, setSelectCombination] = useState<string>("");
    // True if the chip was saved correctly.
    const isSaved: boolean = selectedCombination.length > 0;
    // Temporary random string to set as ID.
    const randomID: string = new Date().toDateString();

    const handleSubmitFilter: FormEventHandler<HTMLFormElement> = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const condition: FilterConditionals | null =
            !isNumeric || conditional === "Igual a"
                ? "="
                : conditional === "Menor a"
                ? "<"
                : conditional === "Mayor a"
                ? ">"
                : null;
        if (condition && value.length !== 0) {
            onClickFilter(condition, value);
            setSelectCombination(`${conditional} ${value}`);
        } else {
            console.log("Filter unfinished!");
        }
    };

    return (
        <>
            <Chip
                variant="outlined"
                label={isSaved ? `${label}: ${selectedCombination}` : label}
                color={isSaved ? "primary" : "default"}
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
                        {isNumeric && (
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
                        <TextField
                            label="Valor"
                            value={value}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
                            sx={{ width: 240 }}
                            required
                            inputProps={isNumeric ? { inputMode: "numeric", pattern: "[0-9]*" } : {}}
                        />
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
