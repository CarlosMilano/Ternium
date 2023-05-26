import Head from "next/head";
import { Inter } from "next/font/google";
import { DataGrid } from "@mui/x-data-grid";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import InputAdornment from "@mui/material/InputAdornment";
import FilterAltOutlined from "@mui/icons-material/FilterAltOutlined";
import Close from "@mui/icons-material/Close";
import Search from "@mui/icons-material/Search";
import Navbar from "@/components/Navbar";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState, ChangeEventHandler, ChangeEvent, Reducer, Dispatch, useReducer } from "react";
import { TableEmpleado } from "@/utils/types/dbTables";
import { useRouter } from "next/router";
import { DropdownButton } from "@/components/themed/ThemedButtons";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    const [search, setSearch] = useState<string>("");
    const [dataEmpleados, setDataEmpleados] = useState<TableEmpleado[]>([]);
    type State = {
        Potencial: boolean;
        Perf: boolean;
        "Estructura 3": boolean;
        "Estructura 4": boolean;
        Jefe: boolean;
    };
    type Action = { key: string; type: "add" | "remove" };
    const reducer: Reducer<State, Action> = (state: State, action: Action): State => {
        switch (action.type) {
            case "add":
                return { ...state, [action.key]: true };
            case "remove":
                return { ...state, [action.key]: false };
            default:
                throw new Error("Unhandled action type: " + action.type);
        }
    };
    const [filters, dispatch]: [State, Dispatch<Action>] = useReducer<Reducer<State, Action>>(reducer, {
        Potencial: false,
        Perf: false,
        "Estructura 3": false,
        "Estructura 4": false,
        Jefe: false,
    });

    const md: boolean = useMediaQuery("(max-width: 900px)");
    const router = useRouter();

    useState(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/getEmpleados");
                const empleados: TableEmpleado[] = await res.json();
                console.log(empleados);
                setDataEmpleados(empleados);
            } catch (err) {
                console.error("Couldn't get data from table empleados");
            }
        };
        fetchData();
    });

    const onChangeSearch: ChangeEventHandler<HTMLInputElement> = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    return (
        <>
            <Head>
                <title>Ternium</title>
                <meta
                    name="description"
                    content="This is a software created for the dynamic visualization of the company talent"
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar sx={{ paddingTop: md ? null : 3 }} />
            <Stack alignItems="center" height="calc(100vh - 128px)">
                <Stack
                    gap={4}
                    sx={md ? { width: "100%", paddingInline: "16px" } : { width: "68%", translate: "-4% -64px" }}
                >
                    <Stack gap={1}>
                        {/* Search bar */}
                        <TextField
                            variant="filled"
                            hiddenLabel
                            placeholder="Buscar"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search></Search>
                                    </InputAdornment>
                                ),
                            }}
                            fullWidth
                            value={search}
                            onChange={onChangeSearch}
                        ></TextField>
                        {/* Filters */}
                        <Grid container gap={1} alignItems="center">
                            {/* Button */}
                            <DropdownButton
                                variant="contained"
                                instruction="Seleccione cualquier filtro"
                                startIcon={<FilterAltOutlined />}
                                sx={{
                                    color: "#485458",
                                    backgroundColor: "#E6E6E6",
                                    "&:hover": {
                                        backgroundColor: "#C9C9C9",
                                    },
                                }}
                                disableElevation
                                options={Object.entries(filters)
                                    .filter(([_, selected]: [string, boolean]) => {
                                        return !selected;
                                    })
                                    .map(([name, _]: [string, boolean]) => {
                                        return name;
                                    })}
                                onClickOption={(_, option: string) => {
                                    dispatch({ key: option, type: "add" });
                                }}
                            >
                                Filtros
                            </DropdownButton>
                            {/* Selected chips */}
                            {Object.entries(filters)
                                .filter(([_, selected]: [string, boolean]) => selected)
                                .map(([name, _]: [string, boolean]) => {
                                    return (
                                        <Chip
                                            variant="outlined"
                                            label={name}
                                            onDelete={(_) => dispatch({ key: name, type: "remove" })}
                                            deleteIcon={<Close sx={{ padding: "0.1rem" }} />}
                                            size="medium"
                                            sx={{ padding: "0.25rem" }}
                                            clickable
                                            key={name}
                                        ></Chip>
                                    );
                                })}
                        </Grid>
                    </Stack>
                    <main>
                        <DataGrid
                            columns={[
                                { field: "id_empleado", headerName: "ID", flex: 0.1, sortable: false },
                                { field: "nombre", headerName: "Nombre", flex: 1, sortable: false },
                                { field: "antiguedad", headerName: "Antigüedad", flex: 0.8, sortable: false },
                                { field: "universidad", headerName: "Universidad", flex: 1, sortable: false },
                                { field: "area_manager", headerName: "Area Manager", flex: 1, sortable: false },
                                { field: "direccion", headerName: "Dirección", flex: 1, sortable: false },
                                { field: "puesto", headerName: "Puesto", flex: 1, sortable: false },
                                { field: "pc_cat", headerName: "PC - CAT", flex: 0.8, sortable: false },
                            ]}
                            rows={dataEmpleados}
                            getRowId={(row: TableEmpleado) => row.id_empleado}
                            initialState={{
                                pagination: {
                                    paginationModel: { page: 0 },
                                },
                            }}
                            autoPageSize
                            rowHeight={40}
                            sx={{ height: 528 }}
                            rowSelection={false}
                            disableColumnMenu
                            sortingMode="server"
                            onRowClick={({ id }) => router.push(`/employee?id=${id}`)}
                        />
                    </main>
                </Stack>
            </Stack>
        </>
    );
}
