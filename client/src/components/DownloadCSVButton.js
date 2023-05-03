import { useState } from 'react';
import Papa from 'papaparse';

// mui components
import LoadingButton from '@mui/lab/LoadingButton';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

// functions
import { 
  getReport
} from "../api/report";

// Function to export data as a file
const exportData = (data, fileName, type) => {
  // Create a link and download the file
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
};

export default function DownloadCSVButton({ paymentId, title, canDownload }) {
  const [loading, setLoading] = useState(false);

  const onGenReportClick = async (batchId, reportName) => {
    setLoading(true);
    const report = await getReport(batchId, reportName);
    console.log(report);
    const csvData = Papa.unparse(report);
    exportData(csvData, `${reportName}.csv`, 'text/csv;charset=utf-8;');
    setLoading(false);
  };

  return (
      <LoadingButton
        size="small"
        variant="contained"
        color="success"
        disabled={canDownload}
        startIcon={<FileDownloadIcon />}
        loading={loading}
        loadingPosition="start"
        onClick={() => onGenReportClick(paymentId, title)}
      >
        <span>{title}</span>
      </LoadingButton>
  )
};
