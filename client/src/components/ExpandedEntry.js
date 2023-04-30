import { useState, useEffect } from "react";

// mui components
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

function ExpandedEntry({ payment }) {
    const {
      totalFunds,
      fundsPerBranch,
      fundsPerSource,
      numOfPayments
    } = payment;
    
    const branches = new Map(Object.entries(fundsPerBranch));
    const branchFunds = Array.from(branches).map(([key, value]) => {
      return <ListItemText key={key} primary={key} secondary={value} />
    });

    const sources = new Map(Object.entries(fundsPerSource));
    const sourceFunds = Array.from(sources).map(([key, value]) => {
      return <ListItemText key={key} primary={key} secondary={value} />
    });

    return (
      <Stack spacing={2}>
        <ListItemText primary="Total Funds" secondary={totalFunds} />
        <ListItemText primary="Number Of Payments" secondary={numOfPayments} />
        {branchFunds}
        {sourceFunds}
      </Stack>
    )
}

export default ExpandedEntry;
