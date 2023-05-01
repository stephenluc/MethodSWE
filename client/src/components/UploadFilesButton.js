import { useState } from 'react';
import FormData from "form-data";

// mui components
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

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
    if (file === undefined) {
      return;
    }
    let formData = new FormData();
    formData.append('file', file);
    uploadFile(formData, onUploadResponse).then(res => {
        onUploadResponse(res.ok ? "success" : "error");
        return res.json();
    }).then(data => {
      updatePaymentBatches();
      return data;
    }).catch(err => onUploadResponse("error"));
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
