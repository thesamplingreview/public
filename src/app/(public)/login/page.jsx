import Link from 'next/link';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import LoginForm from '@/components/pages/auth/LoginForm.jsx';

export default function Login() {
  return (
    <>
      <Container maxWidth="xl">
        <Grid container minHeight="calc(100vh - 6.25rem)">
          <Grid display={{ xs: 'none', md: 'block' }} md={6}>
            xxx
          </Grid>
          <Grid md={6} lg={5}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
              height="100%"
              py={5}
            >
              <Box maxWidth="320px" textAlign="center" mx="auto">
                <Typography variant="h1" mb={2}>
                  Log In
                </Typography>
                <Typography variant="body1" color="text.light" mb={4}>
                  Welcome back. Lorem ipsuem
                </Typography>

                <LoginForm />

                <Box mt={3}>
                  <Typography
                    component={Link}
                    href="/forgot-password"
                    variant="body2"
                    className="link no-line"
                  >
                    Forgot password?
                  </Typography>
                </Box>

                <Box mt={1}>
                  <Typography component="span" variant="body2">
                    Don&lsquo;t have an account?
                  </Typography>
                  <Typography
                    variant="body2"
                    component={Link}
                    href="/signup"
                    ml={1}
                    className="link-main"
                  >
                    Sign up
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

      </Container>
    </>
  );
}
