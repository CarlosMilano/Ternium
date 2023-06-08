import React, { useState } from 'react';
import axios from 'axios';

const UploadCSV = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      axios
        .post('/api/upload', formData)
        .then((res) => {
          console.log(res.data);
          // Realiza alguna acción después de la carga exitosa del archivo
        })
        .catch((err) => {
          console.error(err);
          // Realiza alguna acción en caso de error
        });
    }
  };

  return (
    <div>
      <h1>Subir Archivo CSV</h1>
      <input type="file" name="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload}>Subir</button>
    </div>
  );
};

export default UploadCSV;
