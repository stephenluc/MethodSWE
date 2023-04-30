import { useState, useEffect } from "react";

// mui components
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// components
import ListView from './List';
import UploadFilesButton from './UploadFilesButton';

// functions
import { 
  getPaymentBatches,
  getPaymentBatch,
} from "../api/payment_batch";

const MAX_PAGE_SIZE = 10;

export default function HomeView() {
  const [snackBar, setSnackBar] = useState({isOpen: false, uploadRes: "success"});
  const { isOpen, uploadRes } = snackBar

  const [page, setPage] = useState(0);

  const [paymentBatches, setPaymentBatches] = useState([]);
  useEffect(() => {
    getPaymentBatches(setPaymentBatches);
  }, []);

  const onUploadResponse = (res) => {
    setSnackBar({isOpen: true, uploadRes: res})
  };

  const updatePaymentBatches = (data) => {
    paymentBatches.unshift(data);
    // worry about pagination later
    // if (paymentBatches.length > MAX_PAGE_SIZE) {
    //   paymentBatches.pop();
    // }
    setPaymentBatches(paymentBatches);
  }

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
        updatePaymentBatches={updatePaymentBatches}
      /> 
      <ListView paymentBatches={paymentBatches}/>
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
