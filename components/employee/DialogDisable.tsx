import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import DialogActions from "@mui/material/DialogActions";
import { TextButton } from "../themed/ThemedButtons";
import Button from "@mui/material/Button";
import { useState, ChangeEvent, MouseEventHandler, MouseEvent } from "react";
import TabPanel from "./TabPanel";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import { themeColors } from "@/config/theme";

interface DialogDisableProps extends DialogProps {
    name: string | undefined;
    employeeIsEnabled: boolean | undefined;
    onToggleEnabled: (enable: boolean) => void;
    onDelete: () => void;
}

const DialogDisable: React.FC<DialogDisableProps> = ({
    name,
    employeeIsEnabled,
    onToggleEnabled,
    onDelete,
    onClose,
    ...dialogProps
}): JSX.Element => {
    const [tabIndex, setTabIndex] = useState<number>(0);
    const [confirmName, setConfirmName] = useState<string>("");
    const employeeName: string = name ? name : "Empleado sin nombre";
    const isEnabled: boolean = employeeIsEnabled === undefined ? false : employeeIsEnabled;

    // Wrapper for the onClose callback function.
    // Resets the Dialog's values.
    const closeDialog: () => void = (): void => {
        setTabIndex(0);
        setConfirmName("");
        if (onClose !== undefined) {
            onClose({}, "backdropClick");
        }
    };
    const handleOnClickToggleEnabled: MouseEventHandler<HTMLButtonElement> = () => {
        onToggleEnabled(!isEnabled);
        closeDialog();
    };
    const handleOnClickDelete: MouseEventHandler<HTMLButtonElement> = () => {
        onDelete();
        closeDialog();
    };

    return (
        <Dialog onClose={closeDialog} {...dialogProps}>
            <Tabs
                variant="fullWidth"
                style={{ marginBottom: 8 }}
                value={tabIndex}
                textColor={tabIndex === 0 ? "primary" : "secondary"}
                indicatorColor={tabIndex === 0 ? "primary" : "secondary"}
                onChange={(_, index: number) => setTabIndex(index)}
            >
                <Tab label="Deshabilitar" />
                <Tab label="Eliminar" />
            </Tabs>
            {/* Enable/Disable section */}
            <TabPanel currentIndex={tabIndex} index={0}>
                <DialogTitle>{isEnabled ? "Deshabilitar" : "Habilitar"} empleado</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Estás a punto de {isEnabled ? "deshabilitar" : "habilitar"} al empleado{" "}
                        <span style={{ color: themeColors.celesteTernium }}>{employeeName}</span>. Esta acción puede
                        deshacerse en cualquier momento. ¿Estás seguro?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <TextButton variant="text" onClick={() => closeDialog()}>
                        Cancelar
                    </TextButton>
                    <Button onClick={handleOnClickToggleEnabled} autoFocus>
                        {isEnabled ? "Deshabilitar" : "Habilitar"}
                    </Button>
                </DialogActions>
            </TabPanel>
            {/* Delete section */}
            <TabPanel currentIndex={tabIndex} index={1}>
                <DialogTitle>Eliminar empleado</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Estás a punto de <span style={{ color: themeColors.rojoTernium }}>eliminar</span> al empleado{" "}
                        {employeeName}. Esta acción es permanente y <b>no podrás deshacerla en otro momento</b>. ¿Estás
                        seguro?
                    </DialogContentText>
                </DialogContent>
                <Divider />
                <DialogContent>
                    <DialogContentText>
                        Para confimar, escribe <b>"{employeeName}"</b> debajo:
                    </DialogContentText>
                    <TextField
                        value={confirmName}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmName(e.target.value)}
                        placeholder={employeeName}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <TextButton variant="text" onClick={() => closeDialog()}>
                        Cancelar
                    </TextButton>
                    <Button
                        color="secondary"
                        onClick={handleOnClickDelete}
                        disabled={employeeName !== confirmName}
                        autoFocus
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </TabPanel>
        </Dialog>
    );
};

export default DialogDisable;
