import Link from 'next/link';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import ForgotForm from '@/components/pages/auth/ForgotForm.jsx';

export default function ForgotPassword() {
  return (
    <Box
      sx={{ background: 'linear-gradient(145deg, #ffffff 0%, #f6f7ff 100%)' }}
    >
      <Container maxWidth="xl">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          minHeight="calc(100vh - 6.25rem)"
          py={5}
        >
          <Box maxWidth="320px" textAlign="center" mx="auto">
            <Typography variant="h1" mb={2}>
              Forgot Password?
            </Typography>
            <Typography variant="body1" color="text.light" mb={4}>
              Don&lsquo;t worry, we will assists you reset your account password.
            </Typography>

            <ForgotForm />

            <Box mt={3}>
              <Typography component="span" variant="body2">
                Go back to
              </Typography>
              <Typography
                variant="body2"
                component={Link}
                href="/login"
                ml={1}
                className="link-main"
              >
                Log in
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
