'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { styled, darken } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useOnce, useUpdated } from '@/hooks/ui';
import { useFetch } from '@/hooks/fetcher';
import CButton from '@/components/CButton.jsx';
import CLoader from '@/components/CLoader.jsx';
import CampaignCard from './CampaignCardHorizontal.jsx';

export const NavButton = styled(CButton)(({ ownerState }) => ([
  {
    backgroundColor: '#edefff',
    color: '#666',
    fontWeight: 500,
    paddingLeft: 24,
    paddingRight: 24,
    '&:hover': {
      backgroundColor: '#d4d6e5',
      color: '#555',
    },
  },
  ownerState.active && {
    backgroundColor: ownerState.bg,
    color: '#fff',
    '&:hover': {
      backgroundColor: darken(ownerState.bg, 0.1),
      color: '#fff',
    },
  },
]));

export default function SecCampaigns({ initData }) {
  const doFetch = useFetch();

  const navs = useMemo(() => {
    return [
      { id: 'current', name: 'Current Programs', color: '#60e4e4' },
      { id: 'coming', name: 'Coming Soon', color: '#FB8F34' },
      // { id: 'past', name: 'Past', color: '#c0c2d4' },
    ];
  }, []);

  const [loading, setLoading] = useState(false);
  const [view, setView] = useState(navs[0].id);
  const [dataset, setDataset] = useState(initData.dataset || []);
  // @todo - pagination
  const [, setMeta] = useState(initData.meta || {});

  const fetchData = async () => {
    setLoading(true);
    const result = await doFetch('/v1/app/campaigns', {
      params: {
        state: view,
      },
    });
    setDataset(result.data || []);
    setMeta(result.meta || {});
    setLoading(false);
  };

  // overwrite server cache
  useOnce(() => {
    fetchData();
  });

  useUpdated(() => {
    fetchData();
  }, [view]);

  return (
    <Box
      pt={3}
      pb={6}
      sx={{
        background: 'linear-gradient(180deg, #ffffff 0%, #f6f7ff 100%)',
      }}
    >
      <Container maxWidth="xl" sx={{ overflow: 'auto' }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={{ xs: 2, sm: 3 }}
          mb={6}
        >
          {navs.map((nav) => (
            <NavButton
              key={nav.id}
              ownerState={{
                bg: nav.color,
                active: nav.id === view,
              }}
              sx={[
                (theme) => ({
                  [theme.breakpoints.up('sm')]: {
                    minWidth: 200,
                  },
                }),
              ]}
              onClick={() => setView(nav.id)}
            >
              {nav.name}
            </NavButton>
          ))}
        </Box>
      </Container>

      <Container maxWidth="lg" sx={{ mb: 6 }}>
        {loading && (
          <CLoader />
        )}

        {!loading && dataset.length === 0 && (
          <Box textAlign="center" py={5} sx={{ opacity: '0.5' }}>
            <Image
              src="/images/img-search.svg"
              alt="Empty"
              width="120"
              height="120"
            />
            <Typography variant="body2" fontWeight="500" mt={2}>
              No program yet
            </Typography>
          </Box>
        )}

        {!loading && dataset.length > 0 && (
          <Grid
            container
            justifyContent={dataset.length === 1 ? 'center' : 'flex-start'}
            spacing={4}
          >
            {dataset.map((item) => (
              <Grid key={item.id} xs={12} md={6}>
                <CampaignCard key={item.id} data={item} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
