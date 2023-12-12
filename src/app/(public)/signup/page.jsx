import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import SignupClient from './fe.jsx';

export default function Signup() {
  return (
    <>
      <Container maxWidth="xl">
        <Grid container justifyContent="flex-end" minHeight="calc(100vh - 6.25rem)">
          <Grid md={6} lg={5}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
              height="100%"
              py={5}
            >
              <SignupClient />
            </Box>
          </Grid>
          <Grid display={{ xs: 'none', md: 'block' }} md={6}>
            xxx
          </Grid>
        </Grid>

      </Container>
    </>
  );
}
