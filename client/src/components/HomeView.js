import { useState, useEffect } from "react";

// mui components
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// components
import ListView from './List';
import UploadFilesButton from './UploadFilesButton';

// functions
import { 
  getPaymentBatches,
} from "../api/payment_batch";


export default function HomeView() {
  const [snackBar, setSnackBar] = useState({isOpen: false, uploadRes: "success"});
  const { isOpen, uploadRes } = snackBar

  const [paymentBatches, setPaymentBatches] = useState([]);

  const fetchPaymentBatches = async () => {
    const data = await getPaymentBatches()
    setPaymentBatches(data);
    return data
  }

  useEffect(() => {
    const fetch = async () => {
        await fetchPaymentBatches();
    };
    fetch();
  }, []);
  const onUploadResponse = (res) => {
    setSnackBar({isOpen: true, uploadRes: res})
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackBar({...snackBar, isOpen: false});
  };
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <h1 >Dunkin Donuts Payout Dashboard</h1>
      </Box>
      <UploadFilesButton 
        onUploadResponse={onUploadResponse}
        refetchPaymentBatches={fetchPaymentBatches}
      /> 
      {!paymentBatches ? (
        <h3>No Files Have Been Submited</h3>
      ) : (
        <ListView 
          paymentBatches={paymentBatches}
          refetchPaymentBatches={fetchPaymentBatches}
        />
      )}
      <Snackbar 
        open={isOpen} 
        autoHideDuration={3000} 
        onClose={handleClose} 
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity={uploadRes} sx={{ width: '100%' }}>
          Upload {uploadRes}
        </Alert>
      </Snackbar>
    </Box>
  );
}
