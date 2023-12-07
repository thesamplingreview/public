import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Header from '@/components/layouts/Header.jsx';
import Footer from '@/components/layouts/Footer.jsx';

export default function NotFound() {
  return (
    <>
      <Header />
      <Box
        component="main"
        minHeight="calc(100vh - 3.75rem)"
        textAlign="center"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Container maxWidth="xl">
          <Typography variant="h1" mb={2}>
            404
          </Typography>
          <Typography variant="body1" color="text.light">
            Page not found
          </Typography>
        </Container>
      </Box>
      <Footer />
    </>
  );
}
