import { useState } from "react";

// mui components
import ListItem from '@mui/material/ListItem';
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

function buildStatusChip(status) {
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
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleString('en-US');
}

function ListEntry({ payment, isOpen, onCollapseClick, updatePaymentBatches }) {
	const paymentId = payment._id;
	const { totalFunds, fileName, createdDate, numOfPayments } = payment;
	const formattedDate = new Date(createdDate).toLocaleString('en-US');
	const status = payment.status;

	const onPendingClick = (paymentId, didAccept) => {
      updatePendingPaymentBatch(paymentId, didAccept, updatePaymentBatches)
        .then(() => updatePaymentBatches());
    };
    const isPending = status === "pending";

    const statusButtons = (
      <Stack spacing={1.5} direction="row" justifyContent="flex-end" alignItems="center">
        {isPending && (
        	<>
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
	        </>
	    )}
        {buildStatusChip(status)}
        {isOpen ? <ExpandLess onClick={() => onCollapseClick(paymentId)}/> : <ExpandMore onClick={() => onCollapseClick(paymentId)}/>}
      </Stack>
    );

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
	          <ListItemText primary={fileName} secondary={formattedDate} />
	          <ListItemText primary={`Total Paid: $${totalFunds}`} secondary={`Number of Payments: ${numOfPayments}`}/>
          </Stack>
          {statusButtons}
        </ListItemButton>
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <ExpandedEntry payment={payment} updatePaymentBatches={updatePaymentBatches} />
        </Collapse>
        <Divider component="li" />
      </>
    )
}

export default ListEntry;
