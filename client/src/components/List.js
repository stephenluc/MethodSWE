import { useState } from "react";

// mui components
import List from '@mui/material/List';

// components
import ListEntry from './ListEntry';

export default function ListView({ paymentBatches, refetchPaymentBatches }) {
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
        refetchPaymentBatches={refetchPaymentBatches}
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