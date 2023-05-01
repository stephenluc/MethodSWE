// mui components
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

// rechart components
import { PieChart, Pie, Sector, Cell, Tooltip } from 'recharts';


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function ExpandedEntry({ payment, updatePaymentBatches }) {
    const paymentId = payment._id;
    const {
      totalFunds,
      fundsPerBranch,
      fundsPerSource,
      numOfPayments,
      status
    } = payment;
    
    const branches = new Map(Object.entries(fundsPerBranch));
    const branchFunds = Array.from(branches).map(([name, value]) => {
      return { name, value }
    });

    const sources = new Map(Object.entries(fundsPerSource));
    const sourceFunds = Array.from(sources).map(([name, value]) => {
      return { name, value }
    });

    const canGetCSV = status === "completed" || status === "processing";
    const isCompleted = status === "completed";
    const csvButtons = (
      <Stack spacing={2} sx={{ mx: 2 }} direction="row" justifyContent="flex-end" alignItems="center">
          <Button
            size="small"
            variant="contained"
            color="success"
            disabled={!isCompleted}
          >
            Funds Per Source
          </Button>
          <Button 
            size="small"
            variant="contained"
            color="success"
            disabled={!isCompleted}
          >
            Funds Per Branch
          </Button>
          <Button 
            size="small"
            variant="contained"
            color="success"
            disabled={!isCompleted}
          >
            All Payments
          </Button>
      </Stack>
    );

    return (
      <Stack sx={{ my: 2 }} direction="column">
        {canGetCSV && csvButtons}
        <Stack sx={{ mx: 2 }} direction="row">
          <h3 style={{ textAlign: 'center' }}>Funds Per Branch</h3>
          <PieChart width={400} height={400}>
            <Pie
              data={branchFunds}
              cx={200}
              cy={200}
              outerRadius={160}
              fill="#8884d8"
              label
              nameKey="name"
              dataKey="value"
            >
              {branchFunds.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>

          <h3 style={{ textAlign: 'center' }}>Funds Per Source</h3>
          <PieChart width={400} height={400}>
            <Pie
              data={sourceFunds}
              cx={200}
              cy={200}
              outerRadius={160}
              fill="#8884d8"
              label
              nameKey="name"
              dataKey="value"
            >
              {sourceFunds.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </Stack>
      </Stack>
    )
}

export default ExpandedEntry;
