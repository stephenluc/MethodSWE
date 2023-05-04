// mui components
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ListItemButton from '@mui/material/ListItemButton';
import Tooltip from '@mui/material/Tooltip';

// components
import ExpandedEntry from './ExpandedEntry';

// functions
import { 
  updatePendingPaymentBatch
} from "../api/payment_batch";

const buildStatusChip = (status) => {
    const statusCode = {
		'processing': {
      color: 'primary',
      label: 'PROCESSING',
      title: 'Payments are being processed. Check back later by refreshing the page.'
    },
		'completed': {
      color: 'success',
      label: 'COMPLETED',
      title: 'Payments are fulfilled. CSV reports are now downloadable.'
    },
		'rejected': {
      color: 'error',
      label: 'REJECTED',
      title: 'Payments were rejected by user.',
    },
		'pending': {
      color: 'warning',
      label: 'PENDING',
      title: 'Payments are pending. Review the file details and accept or reject the payments.'
    },
    'uploading': {
      color: 'info',
      label: 'UPLOADING',
      title: 'File is being uploaded. Check back later by refreshing the page.'
    },
	};
    return (
      <Tooltip title={statusCode[status].title}>
    	 <Chip variant="outlined" label={statusCode[status].label} color={statusCode[status].color}/>
      </Tooltip>
    );
};

const buildPendingButtons = (paymentId, refetchPaymentBatches) => {
    const onPendingClick = async (paymentId, didAccept) => {
      await updatePendingPaymentBatch(paymentId, didAccept)
      refetchPaymentBatches();
    };
    return (
      <Stack spacing={1.5} direction="row" justifyContent="flex-end" alignItems="center">
          <Button
            size="small"
            variant="contained"
            color="success"
            onClick={() => onPendingClick(paymentId, true)}
          >
            Accept
          </Button>
          <Button 
            size="small"
            variant="contained"
            color="error"
            onClick={() => onPendingClick(paymentId, false)}
          >
            Reject
          </Button>
      </Stack>
    );
};

function ListEntry({ payment, isOpen, onCollapseClick, refetchPaymentBatches }) {
	const paymentId = payment._id;
	const { totalFunds, fileName, createdDate, numOfPayments } = payment;
	const formattedDate = new Date(createdDate).toLocaleString('en-US');
	const status = payment.status;
  const isUploading =  status === "uploading";
  const isPending = status === "pending";

  const onEntryClick = () => {
    if (!isUploading) {
      onCollapseClick(paymentId)
    }
  }

  return (
    <>
      <ListItemButton alignItems="center">
        <Stack
        	justifyContent="flex-start"
	  	    alignItems="center"
        	direction="row"
        	sx={{ width: '100%'}}
        	onClick={() => onEntryClick()}
        >
          <ListItemText 
            sx={{ 'flex-grow': 0, mr: 5, width: 200 }}
            primary={fileName}
            secondary={formattedDate}
          />
          {!isUploading && <ListItemText primary={`Total Paid: $${totalFunds}`} secondary={`Number of Payments: ${numOfPayments}`}/>}
        </Stack>
        {isPending && buildPendingButtons(paymentId, refetchPaymentBatches)}
        <Stack
          sx={{ pl: 2 }}
          onClick={() => onEntryClick()}
          alignItems="center"
          direction="row"
        >
          {buildStatusChip(status)}
          {isOpen ? <ExpandLess /> : <ExpandMore />}
        </Stack>
      </ListItemButton>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <ExpandedEntry payment={payment} refetchPaymentBatches={refetchPaymentBatches} />
      </Collapse>
      <Divider component="li" />
    </>
  )
}

export default ListEntry;
