'use client';

import Link from 'next/link';
import Image from 'next/image';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';

const FooterLink = styled(Box)(() => ({
  color: 'var(--color-500)',
  textDecoration: 'none',
  transition: 'color .3s',
  '&:hover': {
    color: '#FB8F34',
  },
}));

export default function Footer() {
  return (
    <Box component="footer" py={1.5}>
      <Container maxWidth="xl">
        <Grid container spacing={3} alignItems="center">
          <Grid xs={12} md="auto">
            <Image src="/images/logo.png" alt="SamplingReview" width="50" height="50" />
          </Grid>
          <Grid xs={12} md>
            <Box display="flex" alignItems="center"
                fontSize="0.875em" gap={2}>
              <FooterLink component={Link} href="https://samplingreview.com/" target="_blank">
                Contact Us
              </FooterLink>
              <FooterLink component={Link} href="https://samplingreview.com/tnc/" target="_blank">
                Terms and Conditions
              </FooterLink>
              <FooterLink component={Link} href="https://samplingreview.com/privacy/" target="_blank">
                Privacy Policy
              </FooterLink>
            </Box>
          </Grid>
          <Grid xs={12} md="auto">
            <Box component="span" fontSize="0.875em">
              © 2024 SamplingReview
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
