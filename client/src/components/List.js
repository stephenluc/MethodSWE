import { useState, useEffect } from "react";

// mui components
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ListItemButton from '@mui/material/ListItemButton';

// components
import ListEntry from './ListEntry';

// function
import { 
  getPaymentBatch,
  acceptPaymentBatch,
  rejectPaymentBatch
} from "../api/payment_batch";

export default function ListView({ paymentBatches }) {
  const [openId, setOpenId] = useState(null);

  const handleCollapseClick = (paymentId) => {
    setOpenId(paymentId === openId ? null : paymentId);
  };

  const listEntries = paymentBatches.map((payment) => {
    return (
      <ListEntry 
        key={payment._id}
        payment={payment}
        isOpen={openId === payment._id}
        onCollapseClick={handleCollapseClick}
      />
    )
  });


  return (
    <List
      sx={{
        width: '100%',
        bgcolor: 'background.paper',
      }}
    >
      {listEntries}
    </List>
  );
}