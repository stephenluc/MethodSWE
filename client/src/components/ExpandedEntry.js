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

    return (
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
    )
}

export default ExpandedEntry;
