import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { ReactNode } from "react";

interface AcceptDialogProps extends DialogProps {
    dialogTitle: ReactNode;
    disableAccept?: boolean;
    onAccept: () => void;
    children: string;
}

export const AcceptDialog: React.FC<AcceptDialogProps> = ({
    dialogTitle,
    disableAccept,
    onAccept,
    onClose,
    children,
    ...dialogProps
}): JSX.Element => {
    return (
        <Dialog fullWidth onClose={onClose} {...dialogProps}>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogContent>
                <DialogContentText>{children}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    type="button"
                    onClick={(e) => {
                        if (onClose) {
                            onClose(e, "backdropClick");
                        }
                    }}
                >
                    Cancelar
                </Button>
                <Button type="button" disabled={disableAccept} onClick={() => onAccept()}>
                    Aceptar
                </Button>
            </DialogActions>
        </Dialog>
    );
};
