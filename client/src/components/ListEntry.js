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

// components
import ExpandedEntry from './ExpandedEntry';

// functions
import { 
  updatePendingPaymentBatch
} from "../api/payment_batch";

const buildStatusChip = (status) => {
    const colorCode = {
		'processing': 'primary',
		'completed': 'success',
		'rejected': 'error',
		'pending': 'warning'
	};
	const statusCode = {
		'processing': 'PROCESSING',
		'completed': 'COMPLETED',
		'rejected': 'REJECTED',
		'pending': 'PENDING'
	};
    return (
    	<Chip variant="outlined" label={statusCode[status]} color={colorCode[status]}/>
    );
};

const buildPendingButtons = (paymentId, status, refetchPaymentBatches) => {
    const onPendingClick = async (paymentId, didAccept) => {
      await updatePendingPaymentBatch(paymentId, didAccept)
      refetchPaymentBatches();
    };
    const isPending = status === "pending";
    return (
      <Stack spacing={1.5} direction="row" justifyContent="flex-end" alignItems="center">
        {isPending && (
          <Button
            size="small"
            variant="contained"
            color="success"
            onClick={() => onPendingClick(paymentId, true)}
          >
            Accept
          </Button>
          )}
        {isPending && (
          <Button 
            size="small"
            variant="contained"
            color="error"
            onClick={() => onPendingClick(paymentId, false)}
          >
            Reject
          </Button>
        )}
      </Stack>
    );
};

function ListEntry({ payment, isOpen, onCollapseClick, refetchPaymentBatches }) {
	const paymentId = payment._id;
	const { totalFunds, fileName, createdDate, numOfPayments } = payment;
	const formattedDate = new Date(createdDate).toLocaleString('en-US');
	const status = payment.status;
  return (
    <>
      <ListItemButton alignItems="center">
        <Stack
        	justifyContent="flex-start"
	  	    alignItems="center"
        	direction="row"
        	sx={{ width: '90%'}}
        	onClick={() => onCollapseClick(paymentId)
        }>
          <ListItemText sx={{ 'flex-grow': 0, mr: 5 }} primary={fileName} secondary={formattedDate} />
          <ListItemText primary={`Total Paid: $${totalFunds}`} secondary={`Number of Payments: ${numOfPayments}`}/>
        </Stack>
        {buildPendingButtons(paymentId, status, refetchPaymentBatches)}
        <Stack
          sx={{ pl: 2 }}
          onClick={() => onCollapseClick(paymentId)}
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
