'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Container from '@mui/material/Container';
import { useAuth } from '@/hooks/auth';
import CButton from '@/components/CButton.jsx';
import CIcon from '@/components/CIcon.jsx';

export default function Header() {
  const [auth] = useAuth();

  const [showMNav, setShowMNav] = useState(false);

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
          </Box>
        </Box>

        {/* nav #mobile (toggle) */}
        <Box
          px={2}
          display={{ sm: 'none' }}
          ml="auto"
        >
          <IconButton onClick={() => setShowMNav(true)}>
            <CIcon name="menu" size="1.75rem" />
          </IconButton>
        </Box>

        {/* nav #desktop */}
        <Box
          px={3}
          display={{ xs: 'none', sm: 'inline-flex' }}
          gap={{ xs: 4, xl: 5 }}
          ml="auto"
        >
          {/* <NavItem
            href="/"
            name="How It Works"
            icon="question"
          /> */}
          <NavItem
            href="https://samplingreview.com/"
            name="Contact Us"
          />
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

      {/* nav #mobile */}
      <Dialog
        open={showMNav}
        fullScreen
        sx={{
          '& .MuiPaper-root': {
            bgcolor: 'rgba(255,255,255,.9)',
          },
        }}
        onClose={() => setShowMNav(false)}
      >
        <DialogContent>
          <Box display="flex" alignItems="center" justifyContent="flex-end" height="6.25rem" mt={-2.5} px={1}>
            <IconButton onClick={() => setShowMNav(false)}>
              <CIcon name="times" size="1.75rem" />
            </IconButton>
          </Box>
          <Box py={3}>
            <MNavItem href="/" name="How It Works" icon="question" />
            {auth && (
              <MNavItem href="/my" name="My Account" icon="account" />
            )}
            {!auth && (
              <>
                <MNavItem href="/login" name="Log In" />
                  <Box textAlign="center">
                    <CButton
                      component={Link}
                      href="/signup"
                      variant="contained"
                      color="primary"
                      sx={{
                        fontSize: '1.125rem',
                        px: 4,
                      }}
                    >
                      Sign Up Now
                    </CButton>
                  </Box>
              </>
            )}
          </Box>
        </DialogContent>
      </Dialog>
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

function MNavItem({
  href, name, icon, ...props
}) {
  return (
    <Box
      {...props}
      component={Link}
      href={href}
      display="flex"
      alignItems="center"
      justifyContent="center"
      color="text.main"
      fontSize="1.25em"
      fontWeight="500"
      my={4}
      sx={{
        textDecoration: 'none',
        transition: 'all .3s',
        '&:hover': {
          color: 'primary.main',
        },
      }}
    >
      {icon && <CIcon name={icon} size="1.5em" mr={2} />}
      <Typography variant="inherit" component="span">
        {name}
      </Typography>
    </Box>
  );
}
