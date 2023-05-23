import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Head from "next/head";
import Paper from "@mui/material/Paper";
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
import EditSection, { EditEventHandler } from "@/components/employee/EditSection";
import { FormEventHandler, MouseEventHandler, useState } from "react";

/**
 * EmployeePage component.
 *
 * The page that displays an employee's information.
 */
const EmployeePage: React.FC = (): JSX.Element => {
    // The index of the section being currently edited.
    const [editSectionIndex, setEditSectionIndex] = useState<number | null>(null);
    // The indexes of the selected tabs.
    const [leftTabsIndex, setLeftTabsIndex] = useState<number>(0);
    const [rightTabsIndex, setRightTabsIndex] = useState<number>(0);

    const handleOnEdit: EditEventHandler = (_, index) => setEditSectionIndex(index);
    const handleOnSubmit: FormEventHandler<HTMLFormElement> = () => {};
    const handleOnCancel: MouseEventHandler<HTMLButtonElement> = () => setEditSectionIndex(null);

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
                                        <Avatar sx={{ bgcolor: "deeppink" }}>J</Avatar>
                                        <Typography variant="h6" component="h2">
                                            JORGE CLAUDIO GONZÁLEZ BECERRIL
                                        </Typography>
                                    </Stack>
                                </Stack>
                                <EditSection
                                    index={0}
                                    currentIndex={editSectionIndex}
                                    onEdit={handleOnEdit}
                                    onSubmit={handleOnSubmit}
                                    onCancel={handleOnCancel}
                                >
                                    <Grid container rowGap={2}>
                                        <Grid item md={3} sm={4} xs={6}></Grid>
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
                                        onCancel={handleOnCancel}
                                    >
                                        <TableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell align="center">Nota</TableCell>
                                                        <TableCell>Comentarios</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody></TableBody>
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
                                        onCancel={handleOnCancel}
                                    >
                                        <TableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Resumen</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody></TableBody>
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
                                        onCancel={handleOnCancel}
                                    >
                                        <Typography variant="body1" component="p">
                                            Temp
                                        </Typography>
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
