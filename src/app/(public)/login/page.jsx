import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import LoginForm from '@/components/pages/auth/LoginForm.jsx';

export default function Login() {
  return (
    <Box>
      <Container maxWidth="xl">
        <Typography variant="h1">Login page</Typography>
        <LoginForm />
      </Container>
    </Box>
  );
}
