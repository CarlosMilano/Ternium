import { Document, Page, View, Text, StyleSheet, Font } from "@react-pdf/renderer";
import { TableComentarios, TableEmpleado, TableEvaluacion, TableResumen, TableTrayectoria } from "../types/dbTables";

Font.register({ family: "Roboto-Regular", src: "/Roboto-Regular.ttf" });
Font.register({ family: "Roboto-Medium", src: "/Roboto-Medium.ttf" });
Font.register({ family: "Roboto-Bold", src: "/Roboto-Bold.ttf" });

const styles = StyleSheet.create({
    page: { padding: 16 },
    paper: {
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#B3B3B3",
        borderRadius: 4,
        padding: 16,
        marginBottom: 16,
    },
    title: { fontSize: 14, marginBottom: 24, fontFamily: "Roboto-Bold" },
    section: {
        fontSize: 11,
        color: "#01688A",
        borderBottomStyle: "solid",
        borderBottomWidth: 2,
        borderBottomColor: "#01688A",
        padding: 8,
        marginBottom: 8,
        fontFamily: "Roboto-Regular",
    },
    subtitle: { fontSize: 11, color: "grey", fontFamily: "Roboto-Regular" },
    text: { fontSize: 11, fontFamily: "Roboto-Regular" },
    sectionInformation: { display: "flex", flexDirection: "row", marginBottom: 24 },
    sectionInformationColumn: { flex: 1, flexDirection: "column", gap: 8 },
    sectionCommentsRow: {
        display: "flex",
        flexDirection: "row",
        paddingVertical: 8,
        borderBottom: "1px solid #D3D3D3",
    },
    sectionSummaryRow: { padding: 8, borderBottom: "1px solid #D3D3D3" },
    sectionEvaluation: { padding: 8, borderBottom: "1px solid #D3D3D3" },
    sectionEvaluationTable: { display: "flex", flexDirection: "row", gap: 32 },
});

interface PdfEmployeeProps {
    empleado: TableEmpleado | null;
    comentarios: TableComentarios[] | null;
    resumenes: TableResumen[] | null;
    evaluaciones: TableEvaluacion[] | null;
    trayectorias: TableTrayectoria[] | null;
}

const PdfEmployee: React.FC<PdfEmployeeProps> = ({
    empleado,
    comentarios,
    resumenes,
    evaluaciones,
    trayectorias,
}): JSX.Element => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.paper}>
                    {/* Nombre */}
                    <Text style={styles.title}>{empleado?.nombre || "N/A"}</Text>
                    {/* SECCIÓN: Información */}
                    <View style={styles.sectionInformation}>
                        <View style={styles.sectionInformationColumn}>
                            <View>
                                <Text style={styles.subtitle}>Edad</Text>
                                <Text style={styles.text}>{empleado?.edad || "N/A"}</Text>
                            </View>
                            <View>
                                <Text style={styles.subtitle}>Area Manager</Text>
                                <Text style={styles.text}>{empleado?.area_manager || "N/A"}</Text>
                            </View>
                        </View>
                        <View style={styles.sectionInformationColumn}>
                            <View>
                                <Text style={styles.subtitle}>Antigüedad</Text>
                                <Text style={styles.text}>{empleado?.antiguedad || "N/A"}</Text>
                            </View>
                            <View>
                                <Text style={styles.subtitle}>Dirección</Text>
                                <Text style={styles.text}>{empleado?.direccion || "N/A"}</Text>
                            </View>
                        </View>
                        <View style={styles.sectionInformationColumn}>
                            <View>
                                <Text style={styles.subtitle}>Estudios</Text>
                                <Text style={styles.text}>{empleado?.estudios || "N/A"}</Text>
                            </View>
                            <View>
                                <Text style={styles.subtitle}>Puesto</Text>
                                <Text style={styles.text}>{empleado?.puesto || "N/A"}</Text>
                            </View>
                        </View>
                        <View style={styles.sectionInformationColumn}>
                            <View>
                                <Text style={styles.subtitle}>Universidad</Text>
                                <Text style={styles.text}>{empleado?.universidad || "N/A"}</Text>
                            </View>
                            <View>
                                <Text style={styles.subtitle}>PC - CAT</Text>
                                <Text style={styles.text}>{empleado?.pc_cat || "N/A"}</Text>
                            </View>
                        </View>
                    </View>
                    {/* SECCIÓN: Comentarios */}
                    <Text style={styles.section}>CLIENTE PROVEEDOR</Text>
                    {/*          Table Header */}
                    <View style={styles.sectionCommentsRow}>
                        <View style={{ flex: 0.15, flexDirection: "column", alignItems: "center" }}>
                            <Text style={{ ...styles.text, fontFamily: "Roboto-Medium" }}>Nota</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: "column" }}>
                            <Text style={{ ...styles.text, fontFamily: "Roboto-Medium" }}>Comentarios</Text>
                        </View>
                    </View>
                    {/*          Table Rows */}
                    {comentarios?.map((comentario: TableComentarios) => {
                        return (
                            <View style={styles.sectionCommentsRow} key={comentario.id_comentario}>
                                <View style={{ flex: 0.15, flexDirection: "column", alignItems: "center" }}>
                                    <Text style={styles.text}>{comentario.nota}</Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: "column" }}>
                                    <Text style={styles.text}>{comentario.comentario}</Text>
                                </View>
                            </View>
                        );
                    })}
                    {/* SECCIÓN: Resumen */}
                    <Text style={styles.section}>RESUMEN PERFIL</Text>
                    {/*          Table Header */}
                    <View style={styles.sectionSummaryRow}>
                        <Text style={{ ...styles.text, fontFamily: "Roboto-Medium" }}>Resumen</Text>
                    </View>
                    {/*          Table Rows */}
                    {resumenes?.map((resumen: TableResumen) => {
                        return (
                            <View style={styles.sectionSummaryRow}>
                                <Text style={{ ...styles.text }}>{resumen.resumen_perfil}</Text>
                            </View>
                        );
                    })}
                </View>
                <View style={styles.paper}>
                    {/* SECCIÓN: Evaluación */}
                    <Text style={styles.section}>EVALUACIÓN</Text>
                    {/*          Table Rows */}
                    {evaluaciones?.map((evaluacion: TableEvaluacion) => {
                        return (
                            <View style={styles.sectionEvaluation}>
                                <Text style={{ ...styles.subtitle, textAlign: "right" }}>{evaluacion.año}</Text>
                                <View style={styles.sectionEvaluationTable}>
                                    <View>
                                        <Text style={styles.subtitle}>Performance</Text>
                                        <Text style={styles.text}>{evaluacion.performance}</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.subtitle}>Potencial</Text>
                                        <Text style={styles.text}>{evaluacion.potencial}</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.subtitle}>Curva</Text>
                                        <Text style={styles.text}>{evaluacion.curva}</Text>
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                    {/* SECCIÓN: Laboral */}
                    <Text style={styles.section}>LABORAL</Text>
                    {/*          Table Rows */}
                    {trayectorias?.map((trayectoria: TableTrayectoria) => {
                        return (
                            <View style={styles.sectionEvaluation}>
                                <View style={styles.sectionEvaluationTable}>
                                    <View>
                                        <Text style={styles.subtitle}>Empresa</Text>
                                        <Text style={styles.text}>{trayectoria.empresa}</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.subtitle}>Puesto</Text>
                                        <Text style={styles.text}>{trayectoria.puesto}</Text>
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                </View>
            </Page>
        </Document>
    );
};

export default PdfEmployee;
