import React from "react";
import {
  Page,
  Document,
  View,
  Text,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
    padding: 20,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: "bold",
  },
  subheader: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
  },
  text: {
    fontSize: 12,
    marginBottom: 3,
  },
});

const EmployeeInfoPDF = () => {
  const employee = {
    name: "NOMBRE1",
    age: 23,
    email: "email1@ternium.com",
    position: "posicion1",
    department: "department1",
    hireDate: "97/56/07",
  };

  return (
    <PDFViewer width='100%' height={1000}>
      <Document>
        <Page size='A4' style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.header}>Ficha Informativa del Empleado</Text>

            <Text style={styles.subheader}>Información Personal:</Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Nombre:</Text>{" "}
              {employee.name}
            </Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Edad:</Text> {employee.age}
            </Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Email:</Text>{" "}
              {employee.email}
            </Text>

            <Text style={styles.subheader}>Información Laboral:</Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Puesto:</Text>{" "}
              {employee.position}
            </Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Departamento:</Text>{" "}
              {employee.department}
            </Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Fecha de Contratación:</Text>{" "}
              {employee.hireDate}
            </Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default EmployeeInfoPDF;
