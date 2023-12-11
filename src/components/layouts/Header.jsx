'use client';

import Image from 'next/image';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useAuth } from '@/hooks/auth';
import CButton from '@/components/CButton.jsx';
import CIcon from '@/components/CIcon.jsx';

export default function Header() {
  const [auth] = useAuth();

  return (
    <Box
      component="header"
      height="6.25rem"
      bgcolor="#fff"
    >
      <Container
        maxWidth="xl"
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <Box>
          <Box
            component={Link}
            href="/"
            display="inline-flex"
            alignItems="center"
            color="text.main"
            sx={{ textDecoration: 'none' }}
          >
            <Image src="/images/logo.png" alt="SamplingReview" width="60" height="60" />
            <Typography component="span" fontWeight="500" ml={1}>
              Sampling Review
            </Typography>
          </Box>
        </Box>
        <Box
          px={3}
          ml="auto"
          display="inline-flex"
          gap={{ xs: 3, lg: 4, xl: 5 }}
        >
          <NavItem href="/" name="Home" />
          <NavItem href="/" name="How It Works" icon="question" />
          {auth && (
            <>
              <NavItem href="/my" name="My Account" icon="account" />
            </>
          )}
          {!auth && (
            <>
              <NavItem href="/login" name="Log In" />
              <CButton
                component={Link}
                href="/signup"
                variant="contained"
                color="primary"
                rounded
                sx={{
                  fontSize: '0.875em',
                  fontWeight: 500,
                  px: 3,
                  py: 1.25,
                }}
              >
                Sign Up
              </CButton>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
}

function NavItem({
  href, name, icon, ...props
}) {
  return (
    <Box
      {...props}
      component={Link}
      href={href}
      display="inline-flex"
      alignItems="center"
      color="text.main"
      fontWeight="600"
      fontSize="0.875em"
      sx={{
        textDecoration: 'none',
        transition: 'all .3s',
        '&:hover': {
          color: 'primary.main',
        },
      }}
    >
      {icon && <CIcon name={icon} size="1.5em" mr={1} />}
      <Typography variant="inherit" component="span">
        {name}
      </Typography>
    </Box>
  );
}
