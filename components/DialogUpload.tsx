import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import { OutlinedButton, TextButton } from "./themed/ThemedButtons";
import Button from "@mui/material/Button";
import {
    useState,
    useRef,
    MouseEventHandler,
    ChangeEvent,
    ChangeEventHandler,
    FormEventHandler,
    FormEvent,
} from "react";
import { themeColors } from "@/config/theme";
import UploadFile from "@mui/icons-material/UploadFile";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DropdownSelect } from "./themed/ThemedSelects";
import { SelectChangeEvent } from "@mui/material/Select";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "@/config/environment/firebase";

// Uploads the .csv file uploaded by the user.
const uploadEmpleados = (csvFile: File) => {
    const storageRef = ref(storage, "csvFiles/" + csvFile.name);

    uploadBytes(storageRef, csvFile)
        .then((snapshot) => {
            console.log(snapshot);

            processCSVFileEmpleados(csvFile.name);
        })
        .catch((err) => {
            console.error(err);
        });
};

const processCSVFileEmpleados = (fileName: string) => {
    fetch("/api/upload", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ file: fileName }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error al procesar el archivo CSV");
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);
        })
        .catch((error) => {
            console.error(error);
        });
};

const uploadEvaluaciones = (csvFile: File) => {
    const storageRef = ref(storage, "uploads/" + csvFile.name);

    uploadBytes(storageRef, csvFile)
        .then((snapshot) => {
            console.log(snapshot);

            processCSVFileEvaluaciones(csvFile.name);
        })
        .catch((err) => {
            console.error(err);
        });
};

const processCSVFileEvaluaciones = (fileName: string) => {
    fetch("/api/uploadEvaluacion", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ file: fileName }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error al procesar el archivo CSV");
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);
        })
        .catch((error) => {
            console.error(error);
        });
};

const DialogUpload: React.FC<DialogProps> = ({ onClose, ...dialogProps }): JSX.Element => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [uploadType, setUploadType] = useState<string>("");

    // Wrapper for the onClose callback function.
    // Resets the Dialog's values.
    const closeDialog: () => void = (): void => {
        setFile(null);
        setUploadType("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        if (onClose !== undefined) {
            onClose({}, "backdropClick");
        }
    };
    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (file === null) return;
        try {
            switch (uploadType) {
                case "Empleados":
                    await uploadEmpleados(file);
                    break;
                case "Evaluaciones":
                    await uploadEvaluaciones(file);
                    break;
                default:
                    throw new Error(`Unknown type ${uploadType} of uploadType.`);
            }
        } catch (err) {
            console.error(err);
        } finally {
            closeDialog();
        }
    };

    // Programatically runs click event on input of type file.
    const handleOnClickFile: MouseEventHandler<HTMLButtonElement> = () => {
        if (fileInputRef.current !== null) {
            fileInputRef.current.click();
        }
    };

    const handleOnChangeFile: ChangeEventHandler<HTMLInputElement> = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target == null || e.target.files == null) return;
        if (e.target.files.length > 0) {
            setFile(e.target.files[0]);
        } else {
            setFile(null);
        }
    };

    const handleOnChangeType = (e: SelectChangeEvent<unknown>) => {
        setUploadType(e.target.value as string);
    };

    return (
        <Dialog onClose={closeDialog} {...dialogProps}>
            <form onSubmit={handleSubmit}>
                <DialogTitle>Subir CSV</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Estás a punto de agregar nuevos{" "}
                        <span style={{ color: themeColors.celesteTernium }}>empleados</span> o{" "}
                        <span style={{ color: themeColors.celesteTernium }}>evaluaciones</span>. Selecciona cuál será el
                        tipo de subida y sube tu archivo CSV.
                    </DialogContentText>
                    <Stack gap={1} mt={2}>
                        <DropdownSelect
                            value={uploadType}
                            label={"Selecciona un tipo"}
                            labelId="upload-type-label"
                            options={["Empleados", "Evaluaciones"]}
                            style={{ width: 180 }}
                            onChange={handleOnChangeType}
                            required
                        />
                        <Stack direction="row" alignItems="center" gap={1}>
                            <OutlinedButton
                                variant="outlined"
                                startIcon={<UploadFile />}
                                type="button"
                                onClick={handleOnClickFile}
                            >
                                Archivo
                            </OutlinedButton>
                            <Typography color="GrayText">{file !== null ? file.name : "Ningún archivo."}</Typography>
                        </Stack>
                    </Stack>
                    <input
                        ref={fileInputRef}
                        type="file"
                        style={{ height: 1, verticalAlign: "top", opacity: 0 }}
                        onChange={handleOnChangeFile}
                        accept=".csv"
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <TextButton variant="text" onClick={() => closeDialog()}>
                        Cancelar
                    </TextButton>
                    <Button type="submit" autoFocus>
                        Subir
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default DialogUpload;
