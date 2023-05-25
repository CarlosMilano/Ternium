import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Editable } from "./EditSection";
import { ChangeEventHandler, ReactNode } from "react";

interface LabelledFieldProps {
    label: string;
    value: string | number | undefined;
    sectionIndex: number;
    currentSectionIndex: number | null;
    onChange: ChangeEventHandler<HTMLInputElement>;
    children: ReactNode;
}
const LabelledField: React.FC<LabelledFieldProps> = ({
    label,
    value,
    sectionIndex,
    currentSectionIndex,
    onChange,
    children,
}): JSX.Element => {
    const inputElement: JSX.Element = (
        <TextField value={value || ""} onChange={onChange} sx={{ marginRight: "1rem" }} />
    );

    return (
        <div>
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
