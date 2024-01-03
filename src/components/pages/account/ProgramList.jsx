'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { useOnce } from '@/hooks/ui';
import { useFetch } from '@/hooks/fetcher';
import CButton from '@/components/CButton.jsx';
import CIcon from '@/components/CIcon.jsx';
import CLoader from '@/components/CLoader.jsx';
import ProgramCard from './ProgramCard.jsx';

export default function ProgramList() {
  const doFetch = useFetch();

  const [dataset, setDataset] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { code, data } = await doFetch('/v1/app/my/campaigns');
      if (code !== 200) {
        throw new Error('Unable to retrieve user programs.');
      }
      setDataset(data);
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  };

  useOnce(() => {
    fetchData();
  });

  if (loading) {
    return (
      <Box textAlign="center" py={8}>
        <CLoader />
        <Typography variant="body2" color="text.light">
          Fetching your programs...
        </Typography>
      </Box>
    );
  }
  if (error) {
    return (
      <Box textAlign="center" py={5}>
        <CIcon name="alert" size="6rem" color="text.light" />
        <Typography variant="body1" fontWeight="500" mt={2}>
          Something went wrong. Please try again.
        </Typography>
        <Typography variant="body2" color="text.light" mt={1}>
          #err: {error.message}
        </Typography>
      </Box>
    );
  }
  if (!dataset.length) {
    return (
      <Box textAlign="center" py={5}>
        <Box sx={{ opacity: '0.5' }}>
          <Image
            src="/images/img-search.svg"
            alt="Empty"
            width="120"
            height="120"
          />
        </Box>
        <Typography variant="body2" color="text.light" mt={2}>
          You did not joined any program yet
        </Typography>
        <Box mt={3}>
          <CButton
            component={Link}
            href="/"
            variant="contained"
          >
            Browse our programs
          </CButton>
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Typography variant="body2" color="text.light" mt={1} mb={3}>
        You have joined {dataset.length} programs so far.
      </Typography>
      <Grid container spacing={3}>
        {dataset.map((data) => (
          <Grid key={data.id} xs={12} md={4}>
            <ProgramCard
              data={data}
              refetch={fetchData}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
