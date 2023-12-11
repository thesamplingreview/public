import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconPreloader from './IconPreloader.jsx';

export default function Footer() {
  return (
    <>
      <Box
        component="footer"
        bgcolor="white"
      >
        <Container maxWidth="xl">
          This is footer
        </Container>
      </Box>

      <IconPreloader />
    </>
  );
}
