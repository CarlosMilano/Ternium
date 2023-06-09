import axios from "axios";
import Head from "next/head";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import InputAdornment from "@mui/material/InputAdornment";
import FilterAltOutlined from "@mui/icons-material/FilterAltOutlined";
import Search from "@mui/icons-material/Search";
import PictureAsPdf from "@mui/icons-material/PictureAsPdf";
import UploadFile from "@mui/icons-material/UploadFile";
import Navbar from "@/components/Navbar";
import useMediaQuery from "@mui/material/useMediaQuery";
import Tooltip from "@mui/material/Tooltip";
import {
  useState,
  ChangeEvent,
  Reducer,
  useReducer,
  useEffect,
  useRef,
  MutableRefObject,
  ChangeEventHandler,
} from "react";
import { TableEmpleado } from "@/utils/types/dbTables";
import { useRouter } from "next/router";
import {
  ContainedButton,
  DropdownButton,
  OutlinedButton,
} from "@/components/themed/ThemedButtons";
import { GetPageEmpleadosRequestBody } from "./api/getPageEmpleados";
import FilterChip from "@/components/FilterChip";
import { FilterData, Filters } from "@/utils/types/filters";
import JSZip from "jszip";
import { pdf } from "@react-pdf/renderer";
import PdfEmployee from "@/utils/pdf/PdfEmployee";
import { saveAs } from "file-saver";
import { AcceptDialog } from "@/components/themed/ThemeDialogs";
import { GetAllTablesResult } from "./api/services/getAllTablesFromEmpleado";
import { CSVLink } from "react-csv";
import { Box, Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

export default function Home() {
  // The text from the search bar.
  const [search, setSearch] = useState<string>("");
  // The data from the table empleados.
  const [dataEmpleados, setDataEmpleados] = useState<TableEmpleado[] | null>(
    null
  );
  // The data from the table empleados.
  const [dataEmpleadosFull, setDataEmpleadosFull] = useState<
    TableEmpleado[] | null
  >(null);

  // Activate the download link
  const [activeLink, setActiveLink] = useState(false);
  // The total amount of employees. (Currently, the index of the last employee)
  const [amountOfEmployees, setAmountOfEmployees] = useState<number>(0);
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] =
    useState<boolean>(false);
  // A reference to the Input button that actually uploads the user's file.
  const refInputFile: MutableRefObject<HTMLInputElement | null> =
    useRef<HTMLInputElement | null>(null);
  // The state of the filters.
  type FilterType = {
    name: string;
    type: "string" | "number" | "boolean";
    isActive: boolean;
  };
  type FilterDataState = {
    [key: string]: FilterType;
  };
  type FilterDataAction = { key: string; type: "add" | "remove" };
  const filterDataReducer: Reducer<FilterDataState, FilterDataAction> = (
    state: FilterDataState,
    action: FilterDataAction
  ): FilterDataState => {
    switch (action.type) {
      case "add":
        return {
          ...state,
          [action.key]: { ...state[action.key], isActive: true },
        };
      case "remove":
        return {
          ...state,
          [action.key]: { ...state[action.key], isActive: false },
        };
      default:
        throw new Error("Unhandled action type: " + action.type);
    }
  };
  const [filterData, dispatchFilterData] = useReducer<
    Reducer<FilterDataState, FilterDataAction>
  >(filterDataReducer, {
    antiguedad: { name: "Antigüedad", type: "number", isActive: false },
    universidad: { name: "Universidad", type: "string", isActive: false },
    area_manager: { name: "Jefe", type: "string", isActive: false },
    direccion: { name: "Dirección", type: "string", isActive: false },
    puesto: { name: "Puesto", type: "string", isActive: false },
    pc_cat: { name: "PC - CAT", type: "string", isActive: false },
    habilitado: { name: "Habilitado", type: "boolean", isActive: false },
  });
  // The selected filters
  type FiltersAction = {
    key: string;
    type: "add" | "remove";
    data: FilterData;
  };
  const filtersReducer: Reducer<Filters, FiltersAction> = (
    state: Filters,
    action: FiltersAction
  ): Filters => {
    switch (action.type) {
      case "add":
        return { ...state, [action.key]: action.data };
      case "remove":
        return Object.entries(state).reduce(
          (acc: Filters, [key, value]: [string, FilterData]) => {
            if (key !== action.key) {
              acc[key] = value;
            }
            return acc;
          },
          {}
        );
      default:
        throw new Error("Unhandled action type: " + action.type);
    }
  };
  const [filters, dispatchFilters] = useReducer<
    Reducer<Filters, FiltersAction>
  >(filtersReducer, {});

  const md: boolean = useMediaQuery("(max-width: 900px)");
  const router = useRouter();

  // The amount of employees (rows) shown per page.
  // Manually update this value if the amount of rows changes in the UI.
  // For example, if you make the height of the table bigger.
  const pageSize: number = 10;
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: pageSize,
  });
  // Describes if the employee list is being loaded.
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // Describes if the user's download hasn't finished.
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  // The definition of the columns in the data grid.
  const columns: GridColDef<TableEmpleado>[] = [
    { field: "id_empleado", headerName: "ID", flex: 0.1, sortable: false },
    {
      field: "cet",
      headerName: "CET",
      flex: 0.5,
      minWidth: 80,
      sortable: false,
    },
    {
      field: "idm4",
      headerName: "IDM4",
      flex: 0.5,
      minWidth: 80,
      sortable: false,
    },
    {
      field: "nombre",
      headerName: "Nombre",
      flex: 1.4,
      minWidth: 160,
      sortable: false,
    },
    {
      field: "antiguedad",
      headerName: "Antigüedad",
      flex: 0.6,
      minWidth: 80,
      sortable: false,
    },
    {
      field: "area_manager",
      headerName: "Jefe",
      flex: 1,
      minWidth: 120,
      sortable: false,
    },
    {
      field: "direccion",
      headerName: "Dirección",
      flex: 0.8,
      minWidth: 100,
      sortable: false,
    },
    {
      field: "puesto",
      headerName: "Puesto",
      flex: 0.8,
      minWidth: 100,
      sortable: false,
    },
    {
      field: "pc_cat",
      headerName: "PC - CAT",
      flex: 0.6,
      minWidth: 80,
      sortable: false,
    },
  ];

  // For downloading csv

  const fetchDataCSV = async () => {
    // Fetch empleados in current page, and the total amount in the query.
    try {
      const bodyPage: GetPageEmpleadosRequestBody = {
        page: 0,
        pageSize: amountOfEmployees || 50,
        filters: filters,
      };
      const res = await fetch("/api/getPageEmpleados", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPage),
      });
      if (res.ok) {
        const [countWrapper, empleados]: [{ count: number }, TableEmpleado[]] =
          await res.json();
        const count: number = Number(countWrapper.count);
        setAmountOfEmployees(count);
        setDataEmpleadosFull(empleados);
        setIsLoading(false);
      } else {
        const error: { error: string } = await res.json();
        setDataEmpleados([]);
        console.error(error.error);
      }
    } catch (err) {
      console.error("Couldn't get data from table empleados");
    }
  };
  const handleDownloadCsv = () => {
    fetchDataCSV();
    setActiveLink(true);
    // console.log(dataEmpleadosFull);
  };
  // Fetches the list of employees.
  // Gets called each time the pagination model is set.
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      // Fetch empleados in current page, and the total amount in the query.
      try {
        const bodyPage: GetPageEmpleadosRequestBody = {
          page: paginationModel.page,
          pageSize: pageSize,
          filters: filters,
        };
        const res = await fetch("/api/getPageEmpleados", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyPage),
        });
        if (res.ok) {
          const [countWrapper, empleados]: [
            { count: number },
            TableEmpleado[]
          ] = await res.json();
          const count: number = Number(countWrapper.count);
          setAmountOfEmployees(count);
          setDataEmpleados(empleados);
          setIsLoading(false);
        } else {
          const error: { error: string } = await res.json();
          setDataEmpleados([]);
          console.error(error.error);
        }
      } catch (err) {
        console.error("Couldn't get data from table empleados");
      }
    };
    fetchData();
    fetchDataCSV();
  }, [paginationModel]);

  // Resets the pagination model each time the filters change.
  // Allows the list of employees to be updated.
  useEffect(() => {
    setPaginationModel({
      page: 0,
      pageSize: pageSize,
    });
  }, [filters]);

  // Adds or removes a filter to the 'name' column.
  const handleSubmitSearch: () => void = (): void => {
    if (search.length > 0) {
      dispatchFilters({
        key: "nombre",
        type: "add",
        data: { condition: "=", value: search },
      });
    } else {
      dispatchFilters({
        key: "nombre",
        type: "remove",
        data: { condition: "=", value: "" },
      });
    }
  };

  // Uploads the .csv file uploaded by the user.
  const handleFileUpload: ChangeEventHandler<HTMLInputElement> = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files === null || e.target.files.length === 0) return;
    const csvFile: File = e.target.files[0];
    const formData = new FormData();
    formData.append("file", csvFile);

    axios
      .post("/api/upload", formData)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const closeDownloadDialog = () => {
    if (isDownloading) return;
    setIsDownloadDialogOpen(false);
  };

  const handleDownloadPdf: () => void = async () => {
    if (dataEmpleados === null || dataEmpleados.length === 0) {
      closeDownloadDialog();
      return;
    }
    // Stops the dialog from being closed until the download is finished.
    setIsDownloading(true);

    const zip: JSZip = new JSZip();
    let hasAtLeastOne: boolean = false;

    for (const empleado of dataEmpleados) {
      try {
        const res = await fetch("/api/getAllTablesFromEmpleado", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_empleado: empleado.id_empleado }),
        });
        if (!res.ok) {
          const error: { error: string } = await res.json();
          throw new Error(error.error);
        }
        const allTables: GetAllTablesResult = await res.json();
        const pdfDoc = (
          <PdfEmployee
            empleado={empleado}
            comentarios={allTables.comentarios}
            evaluaciones={allTables.evaluacion}
            resumenes={allTables.resumen}
            trayectorias={allTables.trayectoria}
          />
        );
        const blob: Blob = await pdf(pdfDoc).toBlob();
        if (blob !== null) {
          zip.file(`${empleado?.nombre}_ficha.pdf`, blob);
          hasAtLeastOne = true;
        }
      } catch (err) {
        console.error(err);
      }
    }

    try {
      if (hasAtLeastOne) {
        const zipContent: Blob = await zip.generateAsync({ type: "blob" });
        saveAs(zipContent, "fichas_de_empleados.zip");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloading(false);
      closeDownloadDialog();
    }
  };

  return (
    <>
      <Head>
        <title>Ternium</title>
        <meta
          name='description'
          content='This is a software created for the dynamic visualization of the company talent'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      {/* Fixed overlay buttons */}
      <Stack
        position='fixed'
        width='100vw'
        height='100vh'
        alignItems='flex-end'
        justifyContent='flex-end'
        gap={md ? 1 : 2}
        padding={md ? "12px" : "24px"}
      >
        {!md && (
          <>
            <OutlinedButton
              variant='outlined'
              startIcon={<UploadFile />}
              type='button'
              onClick={() => {
                if (refInputFile === null || refInputFile.current === null)
                  return;
                refInputFile.current.click();
              }}
            >
              Subir
            </OutlinedButton>
            <input
              ref={refInputFile}
              type='file'
              style={{ display: "none" }}
              onChange={handleFileUpload}
              accept='.csv'
            />
          </>
        )}
        <Tooltip
          title='Solo pueden descargarse un máximo de 10 fichas a la vez'
          disableFocusListener={amountOfEmployees <= 10}
          disableHoverListener={amountOfEmployees <= 10}
          disableInteractive={amountOfEmployees <= 10}
          disableTouchListener={amountOfEmployees <= 10}
          placement='left-end'
        >
          <span>
            <ContainedButton
              type='button'
              variant='contained'
              disabled={amountOfEmployees > 10 || amountOfEmployees < 1}
              startIcon={<PictureAsPdf />}
              onClick={() => setIsDownloadDialogOpen(true)}
            >
              Descargar
            </ContainedButton>
          </span>
        </Tooltip>
        {!md && (
          <OutlinedButton
            variant='outlined'
            startIcon={<DownloadIcon />}
            type='button'
            onClick={handleDownloadCsv}
          >
            Descargar CSV
          </OutlinedButton>
        )}
        <AcceptDialog
          open={isDownloadDialogOpen}
          dialogTitle={
            <>
              Descargar
              <span style={{ color: "#01688A" }}> {amountOfEmployees} </span>
              fichas de empleado
            </>
          }
          disableAccept={isDownloading}
          onClose={closeDownloadDialog}
          onAccept={handleDownloadPdf}
        >
          ¿Estás seguro que quieres descargar todas las fichas? Se comprimirán
          todas en un archivo zip.
        </AcceptDialog>
      </Stack>
      {/* Navigation Bar */}
      <Navbar />
      {/* Main Content */}
      <Stack alignItems='center' height='calc(100vh - 128px)'>
        <Stack
          gap={4}
          sx={
            md
              ? { width: "100%", paddingInline: "16px" }
              : { width: "68%", translate: "-4% -60px" }
          }
        >
          <Stack gap={1}>
            {/* Search bar */}
            <TextField
              variant='filled'
              hiddenLabel
              placeholder='Nombre, ID, CET, IDM4...'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Search />
                  </InputAdornment>
                ),
              }}
              fullWidth
              value={search}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSearch(e.target.value.trimStart())
              }
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                e.preventDefault();
                handleSubmitSearch();
              }}
            ></TextField>
            {/* Filters */}
            <Grid container gap={1} alignItems='center'>
              {/* Button */}
              <DropdownButton
                variant='contained'
                instruction='Seleccione cualquier filtro'
                startIcon={<FilterAltOutlined />}
                sx={{
                  color: "#485458",
                  backgroundColor: "#E6E6E6",
                  "&:hover": {
                    backgroundColor: "#C9C9C9",
                  },
                }}
                disableElevation
                options={Object.entries(filterData)
                  .filter(([_, type]: [string, FilterType]) => {
                    return !type.isActive;
                  })
                  .map(([name, _]: [string, FilterType]) => {
                    return name;
                  })}
                onClickOption={(_, option: string) => {
                  dispatchFilterData({ key: option, type: "add" });
                }}
                getOptionName={(option: string) => filterData[option].name}
              >
                Filtros
              </DropdownButton>
              {/* Selected chips */}
              {Object.entries(filterData)
                .filter(([_, type]: [string, FilterType]) => type.isActive)
                .map(([name, type]: [string, FilterType]) => {
                  return (
                    <FilterChip
                      label={filterData[name].name}
                      onDelete={(_) => {
                        dispatchFilterData({ key: name, type: "remove" });
                        if (filters[name]) {
                          dispatchFilters({
                            key: name,
                            type: "remove",
                            data: { condition: "<", value: "" },
                          });
                        }
                      }}
                      onClickFilter={(condition, value) => {
                        dispatchFilters({
                          key: name,
                          type: "add",
                          data: { condition: condition, value: value },
                        });
                      }}
                      type={type.type}
                      key={name}
                    ></FilterChip>
                  );
                })}
            </Grid>
          </Stack>
          <main style={md ? { overflowX: "scroll" } : {}}>
            {activeLink && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "flex-end",
                }}
              >
                <CSVLink
                  data={
                    dataEmpleadosFull || [
                      { hola: 1, hola1: 2 },
                      { hola: 1, hola1: 2 },
                    ]
                  }
                  filename={"Empleados.csv"}
                  className='btn btn-primary'
                  target='_blank'
                >
                  Descargar CSV
                </CSVLink>
              </Box>
            )}
            {dataEmpleados ? (
              <DataGrid
                columns={columns}
                rows={dataEmpleados}
                getRowId={(row: TableEmpleado) => row.id_empleado}
                rowHeight={40}
                sx={md ? { height: 528, width: "200%" } : { height: 528 }}
                initialState={{
                  pagination: { paginationModel: paginationModel },
                }}
                rowSelection={false}
                disableColumnMenu
                sortingMode='server'
                paginationMode='server'
                pageSizeOptions={[10]}
                rowCount={amountOfEmployees}
                paginationModel={paginationModel}
                loading={isLoading}
                onPaginationModelChange={setPaginationModel}
                onRowClick={({ id }) => router.push(`/employee?id=${id}`)}
              />
            ) : (
              // Skeleton for the employee table.
              <Stack height={528} gap={1}>
                <Skeleton variant='rounded' width='100%' height={58} />
                <Skeleton variant='rounded' width='100%' height={420} />
                <Skeleton variant='rounded' width='100%' height={58} />
              </Stack>
            )}
          </main>
        </Stack>
      </Stack>
    </>
  );
}
