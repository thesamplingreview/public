import Image from 'next/image';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import SignupClient from './fe.jsx';

export default function Signup() {
  return (
    <Box
      sx={{ background: 'linear-gradient(145deg, #ffffff 0%, #f6f7ff 100%)' }}
    >
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
            <Box
              position="relative"
              width="580px"
              maxWidth="100%"
              pb="90%"
              sx={{
                '& img': {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                },
              }}
            >
              <Image
                src="/images/img-signup.svg"
                alt=""
                width="580"
                height="580"
              />
            </Box>
          </Grid>
        </Grid>

      </Container>
    </Box>
  );
}
