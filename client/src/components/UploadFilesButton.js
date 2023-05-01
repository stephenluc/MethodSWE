import { useState } from 'react';
import FormData from "form-data";

// mui components
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

// css
import "../App.css"

// functions
import { uploadFile } from "../api/upload_file";

export default function UploadFilesButton({ onUploadResponse, refetchPaymentBatches }) {
  const [file, setFile] = useState(null);

  const handleFile = (event) => {
    setFile(event.target.files[0]);
  }

  const handleUploadFile = async () => {
    if (!file) {
      return;
    }
    try {
      let formData = new FormData();
      formData.append('file', file);
      const res = await uploadFile(formData)
      onUploadResponse(res.ok ? "success" : "error");
      refetchPaymentBatches();
    } catch(err) {
      onUploadResponse("error")
    };
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
