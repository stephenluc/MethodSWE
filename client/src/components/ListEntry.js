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
import { updatePendingPaymentBatch } from "../api/payment_batch";

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

function ListEntry({ payment, isOpen, onCollapseClick }) {
	const paymentId = payment._id;
	const { fileName } = payment;
	const [status, setStatus] = useState(payment.status);

	const hasAccepted = !(['rejected', 'processing'].includes(status));

	const onPendingClick = (paymentId, didAccept) => {
	  updatePendingPaymentBatch(paymentId, didAccept, setStatus);
	};

    const pendingButtons = (
      <Stack spacing={2} direction="row">
        <Button 
          variant="contained"
          color="success"
          onClick={() => onPendingClick(paymentId, true)}
        >
          Accept
        </Button>
        <Button 
          variant="contained"
          color="error"
          onClick={() => onPendingClick(paymentId, false)}
        >
          Reject
        </Button>
      </Stack>
    );

    return (
      <>
        <ListItemButton onClick={() => onCollapseClick(paymentId)}>
          <ListItemText primary={paymentId} secondary={fileName} />
          {pendingButtons}
          {buildStatusChip(status)}
          {isOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <ExpandedEntry payment={payment} />
        </Collapse>
        <Divider component="li" />
      </>
      )
}

export default ListEntry;
