import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Head from "next/head";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Tab from "@mui/material/Tab";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TabPanel from "@/components/employee/TabPanel";
import Tabs from "@mui/material/Tabs";
import EditSection, { EditEventHandler, Editable } from "@/components/employee/EditSection";
import { ChangeEvent, ChangeEventHandler, FormEvent, FormEventHandler, MouseEvent, useEffect, useState } from "react";
import useObjectState from "@/utils/hooks/useObjectState";
import {
    TableComentarios,
    TableEmpleado,
    TableEvaluacion,
    TableResumen,
    TableTrayectoria,
} from "@/utils/types/dbTables";
import LabelledField from "@/components/employee/LabelledField";
import TextField from "@mui/material/TextField";
import { GetEmpleadoRequestBody } from "../api/getTablaEmpleado";

type AllData = {
    dataEmpleado: TableEmpleado | null;
    dataComentarios: TableComentarios[] | null;
    dataResumen: TableResumen[] | null;
    dataEvaluacion: TableEvaluacion[] | null;
    dataTrayectoria: TableTrayectoria[] | null;
};
async function fakeFetch(path: "empleado" | "comentarios" | "resumen" | "evaluacion" | "trayectoria"): Promise<object> {
    const empleado: TableEmpleado = {
        id_empleado: 1,
        nombre: "Jorge Claudio González Becerril",
        edad: 21,
        antiguedad: 1,
        estudios: "0",
        universidad: "ITESM",
        area_manager: "Cocina",
        direccion: "Manejo regional",
        puesto: "Cocinero de Pizza",
        pc_cat: "51 - 51",
    };
    const comentarios: TableComentarios[] = [
        {
            id_comentario: "0",
            nota: 5,
            comentario:
                "Muy bien hecho, eres el mejor empleado que he tenido en toda la vida. Lo recomiendo para hacer " +
                "trabajos manuales y sucios. Volvería a contratarlo.",
        },
        {
            id_comentario: "1",
            nota: 3,
            comentario: "No pienso que volvería a ser una opción.",
        },
    ];
    const resumen: TableResumen[] = [
        {
            id_resumen: "0",
            resumen_perfil: "Cursó la materia de besarse a más de diez perros.",
        },
        {
            id_resumen: "1",
            resumen_perfil: "Atacó a la reina.",
        },
        {
            id_resumen: "2",
            resumen_perfil: "No tengo comentarios sobre este empleado.",
        },
    ];
    const evaluacion: TableEvaluacion[] = [
        { id_evaluacion: "0", performance: 5, anio: 2023, potencial: 5, curva: "TX DIMA C1" },
        { id_evaluacion: "1", performance: 4, anio: 2022, potencial: 4, curva: "TX DIMA C1" },
        { id_evaluacion: "2", performance: 5, anio: 2021, potencial: 5, curva: "TX DIMA C1" },
    ];
    const trayectoria: TableTrayectoria[] = [
        { id_trayectoria: "0", empresa: "Ternium", puesto: "Ingeniero Civil" },
        { id_trayectoria: "1", empresa: "Lyft", puesto: "Superintendente" },
    ];
    return new Promise((resolve) => {
        setTimeout(() => {
            switch (path) {
                case "empleado":
                    resolve(empleado);
                    break;
                case "comentarios":
                    resolve(comentarios);
                    break;
                case "resumen":
                    resolve(resumen);
                    break;
                case "evaluacion":
                    resolve(evaluacion);
                    break;
                case "trayectoria":
                    resolve(trayectoria);
                    break;
                default:
                    resolve({});
            }
        }, 500);
    });
}

/**
 * EmployeePage component.
 *
 * The page that displays an employee's information.
 */
const EmployeePage: React.FC = (): JSX.Element => {
    // A record of the most recent fetched data.
    // Used to restore the value of fields when edits are cancelled.
    const [fetchedData, updateFetchedData, setFetchedData] = useObjectState<AllData>({
        dataEmpleado: null,
        dataComentarios: null,
        dataResumen: null,
        dataEvaluacion: null,
        dataTrayectoria: null,
    });
    // The data from the different tables in the db.
    const [dataEmpleado, updateDataEmpleado, setDataEmpleado] = useObjectState<TableEmpleado | null>(null);
    const [dataComentarios, updateDataComentarios, setDataComentarios] = useObjectState<TableComentarios[] | null>(
        null
    );
    const [dataResumen, updateDataResumen, setDataResumen] = useObjectState<TableResumen[] | null>(null);
    const [dataEvaluacion, updateDataEvaluacion, setDataEvaluacion] = useObjectState<TableEvaluacion[] | null>(null);
    const [dataTrayectoria, updateDataTrayectoria, setDataTrayectoria] = useObjectState<TableTrayectoria[] | null>(
        null
    );
    // The index of the section being currently edited.
    const [editSectionIndex, setEditSectionIndex] = useState<number | null>(null);
    // The indexes of the selected tabs.
    const [leftTabsIndex, setLeftTabsIndex] = useState<number>(0);
    const [rightTabsIndex, setRightTabsIndex] = useState<number>(0);
    // True if the page is doing a POST of updated data.
    // Determines if publish buttons should be disabled.
    const [isUpdatingData, setIsUpdatingData] = useState<boolean>(false);

    const idEmpleado: number = 1;

    // Data fetching.
    useEffect(() => {
        const fetchData = async () => {
            // Fetch data for Empleado.
            try {
                const bodyEmpleado: GetEmpleadoRequestBody = {
                    id_empleado: idEmpleado,
                };
                const res = await fetch("/api/getTablaEmpleado", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(bodyEmpleado),
                });
                if (res.ok) {
                    const dataEmpleado: TableEmpleado = await res.json();
                    setDataEmpleado(dataEmpleado);
                    updateFetchedData("dataEmpleado", dataEmpleado);
                    console.log(dataEmpleado);
                } else {
                    const error: { error: string } = await res.json();
                    console.error(error.error);
                }
            } catch (err) {
                console.error("Error fetching data for Empleado");
            }
            // setDataEmpleado((await fakeFetch("empleado")) as TableEmpleado);
            setDataComentarios((await fakeFetch("comentarios")) as TableComentarios[]);
            setDataResumen((await fakeFetch("resumen")) as TableResumen[]);
            setDataEvaluacion((await fakeFetch("evaluacion")) as TableEvaluacion[]);
            setDataTrayectoria((await fakeFetch("trayectoria")) as TableTrayectoria[]);
        };
        fetchData();
    }, []);

    const handleOnEdit: EditEventHandler = (_, index) => setEditSectionIndex(index);
    const handleOnSubmit: FormEventHandler<HTMLFormElement> = () => {};
    const handleOnCancel: (
        event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
        type: "empleado" | "comentarios" | "resumen" | "evaluacion" | "trayectoria"
    ) => void = (e, type) => {
        setEditSectionIndex(null);
        switch (type) {
            case "empleado":
                setDataEmpleado(fetchedData.dataEmpleado);
                break;
            case "comentarios":
                setDataComentarios(fetchedData.dataComentarios);
                break;
            case "resumen":
                setDataResumen(fetchedData.dataResumen);
                break;
            case "evaluacion":
                setDataEvaluacion(fetchedData.dataEvaluacion);
                break;
            case "trayectoria":
                setDataTrayectoria(fetchedData.dataTrayectoria);
                break;
            default:
                throw Error("type not found.");
        }
    };
    const handleOnSubmitEmpleado: FormEventHandler<HTMLFormElement> = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsUpdatingData(true);
        console.log("Updating data...");
        try {
            const res = await fetch("/api/updateTablaEmpleado", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataEmpleado),
            });
            if (res.ok) {
                const result = await res.json();
                updateFetchedData("dataEmpleado", dataEmpleado);
            } else {
                console.error("Error updating data for Empleado: ", res.statusText);
                setDataEmpleado(fetchedData.dataEmpleado);
            }
        } catch (err) {
            console.error("Error updating data for Empleado");
        }
        console.log("Updated ended!");
        setEditSectionIndex(null);
        setIsUpdatingData(false);
    };

    // Generates a color for the employee's avatar, based on their name.
    const randomColor: string = `hsl(${dataEmpleado?.nombre
        ?.split("")
        .map<number>((letter: string, index: number) => {
            return letter.charCodeAt(0);
        })
        .reduce((carry: number, charCode: number) => {
            return carry + charCode;
        })}, 100%, 54%)`;

    return (
        <>
            <Head>
                <title>Ficha del Empleado</title>
                <meta name="description" content="Ficha del empleado" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Box>
                <Container>
                    <Grid container gap={1} justifyContent="center">
                        {/* Left card */}
                        <Grid item xs={12} md={8}>
                            <Paper variant="outlined" sx={{ padding: "1.5rem", height: "100%" }}>
                                {/* Top section */}
                                <Stack gap={3} mb={3}>
                                    <Stack direction="row" gap={2} alignItems="center">
                                        {/* Avatar */}
                                        <>
                                            {dataEmpleado ? (
                                                <Avatar sx={{ bgcolor: randomColor }}>
                                                    {dataEmpleado?.nombre?.at(0)?.toUpperCase()}
                                                </Avatar>
                                            ) : (
                                                <Skeleton variant="circular" width={40} height={40} />
                                            )}
                                        </>
                                        {/* Name */}
                                        <Typography variant="h6" component="h2">
                                            {dataEmpleado ? (
                                                dataEmpleado?.nombre?.toUpperCase()
                                            ) : (
                                                <Skeleton width={200} />
                                            )}
                                        </Typography>
                                    </Stack>
                                </Stack>
                                <EditSection
                                    index={0}
                                    currentIndex={editSectionIndex}
                                    onEdit={handleOnEdit}
                                    onSubmit={handleOnSubmitEmpleado}
                                    onCancel={(e) => handleOnCancel(e, "empleado")}
                                    disabled={dataEmpleado === null}
                                    disableSave={isUpdatingData}
                                >
                                    <Grid container rowGap={2}>
                                        {/* Edad */}
                                        <Grid item md={3} sm={4} xs={6}>
                                            <LabelledField
                                                label="Edad"
                                                value={dataEmpleado?.edad}
                                                sectionIndex={0}
                                                currentSectionIndex={editSectionIndex}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                                    updateDataEmpleado("edad", e.target.value)
                                                }
                                            >
                                                <Typography variant="body1" component="p">
                                                    {dataEmpleado ? dataEmpleado?.edad : <Skeleton width="80%" />}
                                                </Typography>
                                            </LabelledField>
                                        </Grid>
                                        {/* Antigüedad */}
                                        <Grid item md={3} sm={4} xs={6}>
                                            <LabelledField
                                                label="Antigüedad"
                                                value={dataEmpleado?.antiguedad}
                                                sectionIndex={0}
                                                currentSectionIndex={editSectionIndex}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                                    updateDataEmpleado("antiguedad", e.target.value)
                                                }
                                            >
                                                <Typography variant="body1" component="p">
                                                    {dataEmpleado ? dataEmpleado?.antiguedad : <Skeleton width="80%" />}
                                                </Typography>
                                            </LabelledField>
                                        </Grid>
                                        {/* Estudios */}
                                        <Grid item md={3} sm={4} xs={6}>
                                            <LabelledField
                                                label="Estudios"
                                                value={dataEmpleado?.estudios}
                                                sectionIndex={0}
                                                currentSectionIndex={editSectionIndex}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                                    updateDataEmpleado("estudios", e.target.value)
                                                }
                                            >
                                                <Typography variant="body1" component="p">
                                                    {dataEmpleado ? dataEmpleado?.estudios : <Skeleton width="80%" />}
                                                </Typography>
                                            </LabelledField>
                                        </Grid>
                                        {/* Universidad */}
                                        <Grid item md={3} sm={4} xs={6}>
                                            <LabelledField
                                                label="Universidad"
                                                value={dataEmpleado?.universidad}
                                                sectionIndex={0}
                                                currentSectionIndex={editSectionIndex}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                                    updateDataEmpleado("universidad", e.target.value)
                                                }
                                            >
                                                <Typography variant="body1" component="p">
                                                    {dataEmpleado ? (
                                                        dataEmpleado?.universidad
                                                    ) : (
                                                        <Skeleton width="80%" />
                                                    )}
                                                </Typography>
                                            </LabelledField>
                                        </Grid>
                                        {/* Area Manager */}
                                        <Grid item md={3} sm={4} xs={6}>
                                            <LabelledField
                                                label="Area Manager"
                                                value={dataEmpleado?.area_manager}
                                                sectionIndex={0}
                                                currentSectionIndex={editSectionIndex}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                                    updateDataEmpleado("area_manager", e.target.value)
                                                }
                                            >
                                                <Typography variant="body1" component="p">
                                                    {dataEmpleado ? (
                                                        dataEmpleado?.area_manager
                                                    ) : (
                                                        <Skeleton width="80%" />
                                                    )}
                                                </Typography>
                                            </LabelledField>
                                        </Grid>
                                        {/* Dirección */}
                                        <Grid item md={3} sm={4} xs={6}>
                                            <LabelledField
                                                label="Dirección"
                                                value={dataEmpleado?.direccion}
                                                sectionIndex={0}
                                                currentSectionIndex={editSectionIndex}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                                    updateDataEmpleado("direccion", e.target.value)
                                                }
                                            >
                                                <Typography variant="body1" component="p">
                                                    {dataEmpleado ? dataEmpleado?.direccion : <Skeleton width="80%" />}
                                                </Typography>
                                            </LabelledField>
                                        </Grid>
                                        {/* Puesto */}
                                        <Grid item md={3} sm={4} xs={6}>
                                            <LabelledField
                                                label="Puesto"
                                                value={dataEmpleado?.puesto}
                                                sectionIndex={0}
                                                currentSectionIndex={editSectionIndex}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                                    updateDataEmpleado("puesto", e.target.value)
                                                }
                                            >
                                                <Typography variant="body1" component="p">
                                                    {dataEmpleado ? dataEmpleado?.puesto : <Skeleton width="80%" />}
                                                </Typography>
                                            </LabelledField>
                                        </Grid>
                                        {/* PC - CAT */}
                                        <Grid item md={3} sm={4} xs={6}>
                                            <LabelledField
                                                label="PC - CAT"
                                                value={dataEmpleado?.pc_cat}
                                                sectionIndex={0}
                                                currentSectionIndex={editSectionIndex}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                                    updateDataEmpleado("pc_cat", e.target.value)
                                                }
                                            >
                                                <Typography variant="body1" component="p">
                                                    {dataEmpleado ? dataEmpleado?.pc_cat : <Skeleton width="80%" />}
                                                </Typography>
                                            </LabelledField>
                                        </Grid>
                                    </Grid>
                                </EditSection>
                                {/* Bottom section */}
                                <Tabs
                                    variant="scrollable"
                                    value={leftTabsIndex}
                                    onChange={(_, index: number) => setLeftTabsIndex(index)}
                                >
                                    <Tab label="Cliente Proveedor" />
                                    <Tab label="Resumen Perfil" />
                                </Tabs>
                                {/* Tab: Cliente Proveedor */}
                                <TabPanel index={0} currentIndex={leftTabsIndex}>
                                    <EditSection
                                        index={1}
                                        currentIndex={editSectionIndex}
                                        onEdit={handleOnEdit}
                                        onSubmit={handleOnSubmit}
                                        onCancel={(e) => handleOnCancel(e, "comentarios")}
                                        disabled={dataComentarios === null}
                                        disableSave={isUpdatingData}
                                    >
                                        <TableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell align="center">Nota</TableCell>
                                                        <TableCell>Comentarios</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {dataComentarios ? (
                                                        // Tabla comentarios.
                                                        dataComentarios?.map(
                                                            (
                                                                { id_comentario, nota, comentario }: TableComentarios,
                                                                index: number
                                                            ) => {
                                                                const onChangeNota: ChangeEventHandler<
                                                                    HTMLInputElement
                                                                > = (e: ChangeEvent<HTMLInputElement>) => {
                                                                    updateDataComentarios(
                                                                        `${index}.nota`,
                                                                        e.target.value
                                                                    );
                                                                };
                                                                const onChangeComentario: ChangeEventHandler<
                                                                    HTMLInputElement
                                                                > = (e: ChangeEvent<HTMLInputElement>) => {
                                                                    updateDataComentarios(
                                                                        `${index}.comentario`,
                                                                        e.target.value
                                                                    );
                                                                };
                                                                const inputElementNota: JSX.Element = (
                                                                    <TextField
                                                                        value={nota}
                                                                        onChange={onChangeNota}
                                                                        size="small"
                                                                    />
                                                                );
                                                                const inputElementComentario: JSX.Element = (
                                                                    <TextField
                                                                        value={comentario}
                                                                        onChange={onChangeComentario}
                                                                        size="small"
                                                                        fullWidth
                                                                    />
                                                                );

                                                                return (
                                                                    <TableRow key={id_comentario}>
                                                                        <TableCell align="center" sx={{ maxWidth: 75 }}>
                                                                            <Editable
                                                                                sectionIndex={1}
                                                                                currentSectionIndex={editSectionIndex}
                                                                                inputElement={inputElementNota}
                                                                            >
                                                                                {nota}
                                                                            </Editable>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Editable
                                                                                sectionIndex={1}
                                                                                currentSectionIndex={editSectionIndex}
                                                                                inputElement={inputElementComentario}
                                                                            >
                                                                                {comentario}
                                                                            </Editable>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                );
                                                            }
                                                        )
                                                    ) : (
                                                        // Loading skeleton for table Comentarios.
                                                        <>
                                                            <TableRow>
                                                                <TableCell align="center" width={75}>
                                                                    <Skeleton
                                                                        variant="rounded"
                                                                        width={32}
                                                                        height={32}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Skeleton variant="text" width="100%" />
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell align="center" width={75}>
                                                                    <Skeleton
                                                                        variant="rounded"
                                                                        width={32}
                                                                        height={32}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Skeleton variant="text" width="100%" />
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell align="center" width={75}>
                                                                    <Skeleton
                                                                        variant="rounded"
                                                                        width={32}
                                                                        height={32}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Skeleton variant="text" width="100%" />
                                                                </TableCell>
                                                            </TableRow>
                                                        </>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </EditSection>
                                </TabPanel>
                                {/* Tab: Resumen Perfil */}
                                <TabPanel index={1} currentIndex={leftTabsIndex}>
                                    <EditSection
                                        index={2}
                                        currentIndex={editSectionIndex}
                                        onEdit={handleOnEdit}
                                        onSubmit={handleOnSubmit}
                                        onCancel={(e) => handleOnCancel(e, "resumen")}
                                        disabled={dataResumen === null}
                                        disableSave={isUpdatingData}
                                    >
                                        <TableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Resumen</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {dataResumen ? (
                                                        // Table Resumen.
                                                        dataResumen?.map(
                                                            (
                                                                { id_resumen, resumen_perfil }: TableResumen,
                                                                index: number
                                                            ) => {
                                                                const onChange: ChangeEventHandler<HTMLInputElement> = (
                                                                    e: ChangeEvent<HTMLInputElement>
                                                                ) => {
                                                                    updateDataResumen(
                                                                        `${index}.resumen_perfil`,
                                                                        e.target.value
                                                                    );
                                                                };
                                                                const inputElement: JSX.Element = (
                                                                    <TextField
                                                                        value={resumen_perfil}
                                                                        onChange={onChange}
                                                                        size="small"
                                                                        fullWidth
                                                                    />
                                                                );

                                                                return (
                                                                    <TableRow key={id_resumen}>
                                                                        <TableCell>
                                                                            <Editable
                                                                                sectionIndex={2}
                                                                                currentSectionIndex={editSectionIndex}
                                                                                inputElement={inputElement}
                                                                            >
                                                                                {resumen_perfil}
                                                                            </Editable>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                );
                                                            }
                                                        )
                                                    ) : (
                                                        // Loading skeleton for table Resumen.
                                                        <>
                                                            <TableRow>
                                                                <TableCell>
                                                                    <Skeleton variant="text" width="100%" />
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>
                                                                    <Skeleton variant="text" width="100%" />
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>
                                                                    <Skeleton variant="text" width="100%" />
                                                                </TableCell>
                                                            </TableRow>
                                                        </>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </EditSection>
                                </TabPanel>
                            </Paper>
                        </Grid>
                        {/* Right card */}
                        <Grid item xs={12} md={3}>
                            <Paper variant="outlined" sx={{ padding: "1.5rem", height: "100%" }}>
                                <Typography variant="h6" component="h2" mb={2}>
                                    TRAYECTORIAS
                                </Typography>
                                <Tabs
                                    variant="scrollable"
                                    value={rightTabsIndex}
                                    onChange={(_, index: number) => setRightTabsIndex(index)}
                                    scrollButtons={false}
                                >
                                    <Tab label="Evaluación" />
                                    <Tab label="Laboral" />
                                </Tabs>
                                {/* Tab: Evaluación */}
                                <TabPanel index={0} currentIndex={rightTabsIndex}>
                                    <EditSection
                                        index={3}
                                        currentIndex={editSectionIndex}
                                        onEdit={handleOnEdit}
                                        onSubmit={handleOnSubmit}
                                        onCancel={(e) => handleOnCancel(e, "evaluacion")}
                                        disabled={dataEvaluacion === null}
                                        disableSave={isUpdatingData}
                                    >
                                        {dataEvaluacion ? (
                                            dataEvaluacion?.map(
                                                (
                                                    {
                                                        id_evaluacion,
                                                        performance,
                                                        anio,
                                                        potencial,
                                                        curva,
                                                    }: TableEvaluacion,
                                                    index: number,
                                                    arr: TableEvaluacion[]
                                                ) => {
                                                    const isLast: boolean = index === arr.length - 1;
                                                    const onChangePotencial: ChangeEventHandler<HTMLInputElement> = (
                                                        e: ChangeEvent<HTMLInputElement>
                                                    ) => {
                                                        updateDataEvaluacion(`${index}.potencial`, e.target.value);
                                                    };
                                                    const onChangeCurva: ChangeEventHandler<HTMLInputElement> = (
                                                        e: ChangeEvent<HTMLInputElement>
                                                    ) => {
                                                        updateDataEvaluacion(`${index}.curva`, e.target.value);
                                                    };
                                                    return (
                                                        <Stack direction="row" gap={1} key={id_evaluacion}>
                                                            {/* Performace */}
                                                            <Stack direction="column" pt={2}>
                                                                <div style={{ height: "100%" }}>
                                                                    <Avatar
                                                                        sx={{
                                                                            bgcolor: "gold",
                                                                            color: "black",
                                                                            width: 32,
                                                                            height: 32,
                                                                            fontSize: 16,
                                                                            mt: 2,
                                                                        }}
                                                                    >
                                                                        {performance}
                                                                    </Avatar>
                                                                    <div
                                                                        hidden={isLast}
                                                                        style={{
                                                                            backgroundColor: "lightgray",
                                                                            width: 1,
                                                                            height: "100%",
                                                                            margin: "auto",
                                                                        }}
                                                                    ></div>
                                                                </div>
                                                            </Stack>
                                                            {/* Information */}
                                                            <List sx={{ width: "100%" }}>
                                                                <ListItem
                                                                    sx={{
                                                                        flexDirection: "column",
                                                                        alignItems: "flex-start",
                                                                    }}
                                                                >
                                                                    {/* Año */}
                                                                    <Typography
                                                                        variant="body1"
                                                                        component="p"
                                                                        textAlign="end"
                                                                        width="100%"
                                                                        color="grey"
                                                                    >
                                                                        {anio}
                                                                    </Typography>
                                                                    {/* Potencial */}
                                                                    <LabelledField
                                                                        label="Potencial"
                                                                        value={potencial}
                                                                        sectionIndex={3}
                                                                        currentSectionIndex={editSectionIndex}
                                                                        onChange={onChangePotencial}
                                                                    >
                                                                        <Typography variant="body1" component="p">
                                                                            {potencial}
                                                                        </Typography>
                                                                    </LabelledField>
                                                                    {/* Curva */}
                                                                    <LabelledField
                                                                        label="Curva"
                                                                        value={curva}
                                                                        sectionIndex={3}
                                                                        currentSectionIndex={editSectionIndex}
                                                                        onChange={onChangeCurva}
                                                                    >
                                                                        <Typography variant="body1" component="p">
                                                                            {curva}
                                                                        </Typography>
                                                                    </LabelledField>
                                                                </ListItem>
                                                            </List>
                                                        </Stack>
                                                    );
                                                }
                                            )
                                        ) : (
                                            // Loading skeleton of Evaluación.
                                            <Stack direction="column" gap={2} pt={2}>
                                                <Skeleton variant="rectangular" width="100%" height={128} />
                                                <Skeleton variant="rectangular" width="100%" height={128} />
                                                <Skeleton variant="rectangular" width="100%" height={128} />
                                            </Stack>
                                        )}
                                    </EditSection>
                                </TabPanel>
                                {/* Tab: Trayectoria Laboral */}
                                <TabPanel index={1} currentIndex={rightTabsIndex}>
                                    <EditSection
                                        index={4}
                                        currentIndex={editSectionIndex}
                                        onEdit={handleOnEdit}
                                        onSubmit={handleOnSubmit}
                                        onCancel={(e) => handleOnCancel(e, "trayectoria")}
                                        disabled={dataTrayectoria === null}
                                        disableSave={isUpdatingData}
                                    >
                                        {dataTrayectoria ? (
                                            dataTrayectoria?.map(
                                                (
                                                    { id_trayectoria, empresa, puesto }: TableTrayectoria,
                                                    index: number
                                                ) => {
                                                    const onChangeEmpresa: ChangeEventHandler<HTMLInputElement> = (
                                                        e: ChangeEvent<HTMLInputElement>
                                                    ) => {
                                                        updateDataTrayectoria(`${index}.empresa`, e.target.value);
                                                    };
                                                    const onChangePuesto: ChangeEventHandler<HTMLInputElement> = (
                                                        e: ChangeEvent<HTMLInputElement>
                                                    ) => {
                                                        updateDataTrayectoria(`${index}.puesto`, e.target.value);
                                                    };
                                                    return (
                                                        <List sx={{ width: "100%" }} key={id_trayectoria}>
                                                            <ListItem
                                                                sx={{
                                                                    flexDirection: "column",
                                                                    alignItems: "flex-start",
                                                                }}
                                                            >
                                                                {/* Año */}
                                                                <Typography
                                                                    variant="body1"
                                                                    component="p"
                                                                    textAlign="end"
                                                                    width="100%"
                                                                    color="grey"
                                                                >
                                                                    Sin año
                                                                </Typography>
                                                                {/* Empresa */}
                                                                <LabelledField
                                                                    label="Empresa"
                                                                    value={empresa}
                                                                    sectionIndex={4}
                                                                    currentSectionIndex={editSectionIndex}
                                                                    onChange={onChangeEmpresa}
                                                                >
                                                                    <Typography variant="body1" component="p">
                                                                        {empresa}
                                                                    </Typography>
                                                                </LabelledField>
                                                                {/* Puesto */}
                                                                <LabelledField
                                                                    label="Puesto"
                                                                    value={puesto}
                                                                    sectionIndex={4}
                                                                    currentSectionIndex={editSectionIndex}
                                                                    onChange={onChangePuesto}
                                                                >
                                                                    <Typography variant="body1" component="p">
                                                                        {puesto}
                                                                    </Typography>
                                                                </LabelledField>
                                                            </ListItem>
                                                        </List>
                                                    );
                                                }
                                            )
                                        ) : (
                                            // Loading skeleton of Laboral.
                                            <Stack direction="column" gap={2} pt={2}>
                                                <Skeleton variant="rectangular" width="100%" height={128} />
                                                <Skeleton variant="rectangular" width="100%" height={128} />
                                                <Skeleton variant="rectangular" width="100%" height={128} />
                                            </Stack>
                                        )}
                                    </EditSection>
                                </TabPanel>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </>
    );
};

export default EmployeePage;
