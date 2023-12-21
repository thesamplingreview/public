import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import LoginClient from './fe.jsx';

export default function Login() {
  return (
    <Box
      sx={{ background: 'linear-gradient(145deg, #ffffff 0%, #f6f7ff 100%)' }}
    >
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
              <LoginClient />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
