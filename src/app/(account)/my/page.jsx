import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function MyAccount() {
  return (
    <Box component="main">
      <Typography variant="h1">My Account page</Typography>
      <Link href="/">Home page</Link>
    </Box>
  );
}
