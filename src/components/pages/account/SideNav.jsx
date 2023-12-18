'use client';

import { Fragment } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Box from '@mui/material/Box';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import { useAuth } from '@/hooks/auth';
import CIcon from '@/components/CIcon.jsx';

export default function SideNav({ current }) {
  const [auth] = useAuth();

  const navs = [
    {
      id: 'campaigns',
      name: 'My Programs',
      href: '/my',
      icon: 'question',
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
    <Box
      bgcolor="#fff"
      borderRadius="1rem"
      sx={{
        boxShadow: '0 2px 4px rgba(0,0,0,.15)',
      }}
    >
      <Box px={3} py={2}>
        <Typography variant="h6">
          {auth.name}
        </Typography>
        <Typography variant="body2" component="div" color="text.light">
          {auth.email}
        </Typography>
      </Box>
      <MenuList>
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
                borderRightColor: 'secondary.main',
              }),
            ]}
          >
            <ListItemIcon
              sx={{
                color: 'secondary.main',
              }}
            >
              <CIcon name={nav.icon} fontSize="1.25em" />
            </ListItemIcon>
            <Box fontWeight="500" fontSize="0.875em" flexGrow="1">
              {nav.name}
            </Box>
          </MenuItem>
        ))}
      </MenuList>
    </Box>
  );
}
