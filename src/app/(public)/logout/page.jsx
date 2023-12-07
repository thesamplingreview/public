import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import LogoutForm from '@/components/pages/auth/LogoutForm.jsx';

export default function Logout() {
  return (
    <Box>
      <Container maxWidth="xl">
        <LogoutForm />
      </Container>
    </Box>
  );
}
