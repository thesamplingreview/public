'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import { useAuth } from '@/hooks/auth';
import CIcon from '@/components/CIcon.jsx';

export default function SideNav({ current }) {
  const theme = useTheme();
  const [auth] = useAuth();
  const toggleable = useMediaQuery(theme.breakpoints.down('md'));

  const [mShow, setMShow] = useState(false);

  const navs = [
    {
      id: 'campaigns',
      name: 'My Programs',
      href: '/my',
      icon: 'form',
    },
    {
      id: 'profile',
      name: 'Edit Profile',
      href: '/my/profile',
      icon: 'account',
    },
    {
      id: 'password',
      name: 'Change Password',
      href: '/my/password',
      icon: 'lock',
    },
    {
      id: 'logout',
      name: 'Logout',
      href: '/logout',
      icon: 'logout',
    },
  ];

  return (
    <>
      {/* alert */}
      {!auth.contactVerified && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Phone number is unverified!<br />
          <Box
            component={Link}
            href="/verify-phone?skip=true"
            fontSize="0.875em"
            fontWeight="600"
            color="warning.dark"
            sx={{ textDecoration: 'none' }}
          >
            Verify now
          </Box>
        </Alert>
      )}

      <Box
        bgcolor="#fff"
        borderRadius="1rem"
        overflow="hidden"
        sx={{
          boxShadow: '0 2px 4px rgba(0,0,0,.15)',
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          px={3}
          py={2}
          sx={{
            color: '#fff',
            backgroundImage: 'linear-gradient(135deg, rgba(96,228,228,1) 0%, rgba(251,143,52,1) 100%)',
          }}
        >
          <Box flexGrow="1">
            <Typography variant="h6">
              {auth.name}
            </Typography>
            <Typography component="div" fontSize="0.75rem" sx={{ opacity: 0.85 }}>
              {auth.email}
            </Typography>
          </Box>
          <Box display={{ md: 'none' }} pl={2}>
            <IconButton onClick={() => setMShow(!mShow)}>
              <CIcon name="menu" color="white" />
            </IconButton>
          </Box>
        </Box>
        {(!toggleable || mShow) && (
          <MenuList sx={{ pt: 0 }}>
            {navs.map((nav) => (
              <MenuItem
                key={nav.id}
                component={Link}
                href={nav.href}
                sx={[
                  {
                    py: 1.5,
                    borderTop: '1px solid var(--border-500)',
                    borderRight: '4px solid transparent',
                  },
                  nav.id === current && ({
                    bgcolor: 'rgba(0, 0, 0, 0.03)',
                    borderRightColor: 'primary.main',
                  }),
                ]}
              >
                <ListItemIcon>
                  <CIcon name={nav.icon} fontSize="1.25em" />
                </ListItemIcon>
                <Box fontWeight="500" fontSize="0.875em" flexGrow="1">
                  {nav.name}
                </Box>
              </MenuItem>
            ))}
          </MenuList>
        )}
      </Box>
    </>
  );
}
