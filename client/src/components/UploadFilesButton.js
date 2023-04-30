import { useState } from 'react';
import FormData from "form-data";
import axios from "axios";

// mui components
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

// css
import "../App.css"

// functions
import { uploadFile } from "../api/upload_file";

export default function UploadFilesButton({ onUploadResponse, updatePaymentBatches }) {
  const [file, setFile] = useState();

  function handleFile(event) {
    setFile(event.target.files[0]);
  }

  function handleUploadFile() {
    if (file == undefined) {
      return;
    }
    let formData = new FormData();
    formData.append('file', file);
    uploadFile(formData, onUploadResponse, updatePaymentBatches);
  }

  return (
    <Box sx={{ p: 1, m: 1, display: "flex", justifyContent: 'flex-end' }}>
      <input accept="xml/*" type="file" onChange={handleFile}/>
      <Button variant="contained" onClick={handleUploadFile}>
        Upload
      </Button>
    </Box>
  )
};
