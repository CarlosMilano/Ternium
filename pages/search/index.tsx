import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ExitToApp from "@mui/icons-material/ExitToApp";
import FilterAltOutlined from "@mui/icons-material/FilterAltOutlined";
import FilledInput from "@mui/material/FilledInput";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import PictureAsPdf from "@mui/icons-material/PictureAsPdf";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import Snackbar from "@mui/material/Snackbar";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import terniumLogo from "../../public/assets/imgs/ternium_color.png";
import React, { useEffect, useState } from "react";
import { auth } from "@/config/environment/firebase";
import { DataGrid } from "@mui/x-data-grid";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { TableEmpleado } from "@/utils/types/dbTables";
import { themeColors } from "@/config/theme";
import { useRouter } from "next/router";
import { useUser } from "@/providers/user";
import * as admin from "firebase-admin";

function Search() {
  const [dataEmpleados, setDataEmpleados] = useState<TableEmpleado[]>([]);
  const [open, setOpen] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("user: ", user);
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
  }, []);

  //   admin.initializeApp();

  //   const setCustomClaims = async (email: string) => {
  //     const user = await admin.auth().getUserByEmail(email);
  //     admin.auth().setCustomUserClaims(user.uid, {
  //       role: "admin",
  //     });
  //   };

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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickSnack = () => {
    setOpenSnack(true);
  };

  const handleCloseSnack = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnack(false);
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {})
      .catch((error) => {
        handleClickSnack;
      });
  };

  //   const handleSetCustomClaims = () => {
  //     axios
  //       .post("/api/setCustomClaims", { email: "" }) // Agrega el correo electrónico aquí
  //       .then((response) => {
  //         console.log(response.data);
  //       })
  //       .catch((error) => {
  //         console.error("Error setting custom claims:", error);
  //         handleClickSnack();
  //       });
  //   };

  return (
    <Box sx={{ bgcolor: "white", height: "100vh", width: "100%" }}>
      {/* <button
        style={{ position: "fixed", bottom: "50px", left: "50px" }}
        onClick={handleSetCustomClaims}
      >
        Set custom claims
      </button> */}
      {/* <button onClick={handleClickSnack}>Hola</button> */}
      <Snackbar
        open={openSnack}
        autoHideDuration={6000}
        onClose={handleCloseSnack}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnack}
          severity='error'
          sx={{ width: "100%" }}
        >
          Ocurrio un error!
        </Alert>
      </Snackbar>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        fullWidth
      >
        <DialogTitle id='alert-dialog-title'>Descargar 14 archivos</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            ¿Estás seguro que quieres descargar todos los archivos?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleClose} autoFocus>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
      <Head>
        <title>Search</title>
        <meta name='description' content='Busqueda de empleados.' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 3,
          paddingBottom: 1,
        }}
      >
        <Image
          src={terniumLogo}
          alt='Logo de la barra de navegación'
          width={128}
        />
        <Box sx={{ width: "60%" }}>
          <FormControl fullWidth sx={{ m: 1 }} variant='filled'>
            <FilledInput
              placeholder='Buscar'
              id='filled-adornment-search'
              startAdornment={
                <InputAdornment position='start'>
                  <SearchOutlined sx={{ mr: 1 }} />
                </InputAdornment>
              }
            />
          </FormControl>
        </Box>
        <Link href='/'>
          <Button
            variant='text'
            startIcon={<ExitToApp />}
            sx={{ color: themeColors.grisAceroTernium }}
            onClick={handleSignOut}
          >
            Cerrar Sesion
          </Button>
        </Link>
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "59%",
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
          }}
        >
          <Button
            variant='contained'
            startIcon={<FilterAltOutlined />}
            sx={{
              color: themeColors.grisAceroTernium,
              backgroundColor: "#D9D9D9",
              marginRight: 1,
            }}
          >
            Filtros
          </Button>
          <Button
            onClick={handleClickOpen}
            variant='outlined'
            startIcon={<PictureAsPdf />}
            sx={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
            }}
          >
            Descargar
          </Button>
          <Chip
            sx={{ marginRight: 1 }}
            label='Nombre: A-Z'
            variant='outlined'
            onDelete={() => console.log("hola")}
          />
          <Chip
            sx={{ marginRight: 1 }}
            label='Performace: Mayor a 3'
            variant='outlined'
            onDelete={() => console.log("hola")}
          />
        </Box>
      </Box>
      <Box
        sx={{
          marginTop: 2,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "59%",
            height: "75vh",
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
          }}
        >
          <DataGrid
            rows={dataEmpleados}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 8,
                },
              },
            }}
            getRowId={(row) => row.id_empleado}
            pageSizeOptions={[5]}
            autoHeight
            disableRowSelectionOnClick
            onRowClick={(params) => router.push(`/employee?id=${params.id}`)}
          />
        </Box>
      </Box>
    </Box>
  );
}

const columns = [
  { field: "id_empleado", headerName: "ID", width: 80 },
  { field: "nombre", headerName: "Nombre", width: 100 },
  { field: "antiguedad", headerName: "Antigüedad", width: 120 },
  { field: "universidad", headerName: "Universidad", width: 140 },
  { field: "area_manager", headerName: "Area Manager", width: 140 },
  { field: "direccion", headerName: "Dirección", width: 120 },
  { field: "puesto", headerName: "Puesto", width: 100 },
  { field: "pc_cat", headerName: "PC - CAT", width: 100 },
];

export default Search;
