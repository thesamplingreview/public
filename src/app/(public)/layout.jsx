import Box from '@mui/material/Box';
import Header from '@/components/layouts/Header.jsx';
import Footer from '@/components/layouts/Footer.jsx';

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <Box
        component="main"
        minHeight="calc(100vh - 3.75rem)"
      >
        {children}
      </Box>
      <Footer />
    </>
  );
}
