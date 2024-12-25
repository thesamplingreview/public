import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import PhoneVerificationClient from './fe.jsx';

export default function PhoneVerification() {
  return (
    <Box
      sx={{ background: 'linear-gradient(145deg, #ffffff 0%, #f6f7ff 100%)' }}
    >
      <Container maxWidth="xl">
        <Grid container justifyContent="center" minHeight="calc(100vh - 6.25rem)">
          <Grid md={6} lg={5}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
              height="100%"
              py={5}
            >
              <PhoneVerificationClient />
            </Box>
          </Grid>
        </Grid>

      </Container>
    </Box>
  );
}
