import Box from '@mui/material/Box';
import Header from '@/components/layouts/Header.jsx';
import Footer from '@/components/layouts/Footer.jsx';
import IconPreloader from '@/components/layouts/IconPreloader.jsx';

export default function Layout({ children }) {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />
      <Box component="main" flexGrow="1">
        {children}
      </Box>
      <Footer />
      <IconPreloader />
    </Box>
  );
}
