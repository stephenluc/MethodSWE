import { useState } from 'react';
import FormData from "form-data";

// mui components
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import FileUploadIcon from '@mui/icons-material/FileUpload';

// functions
import { uploadFile } from "../api/upload_file";

export default function UploadFilesButton({ onUploadResponse, refetchPaymentBatches }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFile = (event) => {
    setFile(event.target.files[0]);
  }

  const handleUploadFile = async () => {
    if (!file) {
      return;
    }
    setLoading(true);
    try {
      let formData = new FormData();
      formData.append('file', file);
      const res = await uploadFile(formData)
      onUploadResponse(res.ok ? "success" : "error");
      refetchPaymentBatches();
      setLoading(false);
    } catch(err) {
      onUploadResponse("error")
      setLoading(false);
    };
  }

  return (
    <Box sx={{ p: 1, m: 1, display: "flex", justifyContent: 'flex-end' }}>
      <input accept="xml/*" type="file" onChange={handleFile}/>
      <LoadingButton
        onClick={handleUploadFile}
        loading={loading}
        loadingPosition="start"
        startIcon={<FileUploadIcon />}
        variant="contained"
      >
        <span>Upload</span>
      </LoadingButton>
    </Box>
  )
};
