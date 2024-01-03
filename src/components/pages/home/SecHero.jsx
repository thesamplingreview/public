import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export default async function SectionHero() {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="21rem"
      py={6}
    >
      <Container maxWidth="xl" height="100%">
        <Box maxWidth="680px" textAlign="center" mx="auto">
          <Typography
            variant="h1"
            fontSize={{ xs: '2rem', sm: '2.5rem' }}
            lineHeight="1.35"
            mb={2}
          >
            Participate in Our <br />Exclusive Sampling Initiatives
          </Typography>
          <Typography
            component="div"
            fontSize={{ xs: '1rem', sm: '1.25rem' }}
            fontWeight="300"
            color="text.light"
            lineHeight="1.75"
          >
            Experience and review premium products firsthand in our exclusive sampling programs for a hands-on and insightful experience.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
