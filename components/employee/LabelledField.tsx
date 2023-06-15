import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Editable } from "./EditSection";
import { ChangeEventHandler, ReactNode, CSSProperties, ChangeEvent } from "react";
import { DropdownSelect } from "../themed/ThemedSelects";

interface LabelledFieldProps {
    label: string;
    value: string | number | boolean | undefined;
    sectionIndex: number;
    currentSectionIndex: number | null;
    onChange: ChangeEventHandler<HTMLInputElement>;
    isNumeric?: boolean;
    isBoolean?: boolean;
    style?: CSSProperties | undefined;
    children: ReactNode;
}
const LabelledField: React.FC<LabelledFieldProps> = ({
    label,
    value,
    sectionIndex,
    currentSectionIndex,
    onChange,
    isNumeric,
    isBoolean,
    style,
    children,
}): JSX.Element => {
    const inputElement: JSX.Element = isNumeric ? (
        <TextField
            value={value === null ? "" : value}
            onChange={onChange}
            sx={{ marginRight: "1rem" }}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
        />
    ) : isBoolean ? (
        <DropdownSelect
            id={`${label}-value`}
            labelId={`${label}-label`}
            onChange={(e) => onChange(e as ChangeEvent<HTMLInputElement>)}
            options={["Sí", "No"]}
            value={value ? "Sí" : "No"}
            required
            sx={{ width: 140, maxWidth: "35vw" }}
        />
    ) : (
        <TextField value={value || ""} onChange={onChange} sx={{ marginRight: "1rem" }} />
    );

    return (
        <div style={style}>
            <Typography variant="body1" component="p" color="grey">
                {label}
            </Typography>
            <Editable sectionIndex={sectionIndex} currentSectionIndex={currentSectionIndex} inputElement={inputElement}>
                {children}
            </Editable>
        </div>
    );
};

export default LabelledField;
