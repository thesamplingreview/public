'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import config from '@/config/app';
import { useOnce } from '@/hooks/ui';
import { useFetch } from '@/hooks/fetcher';
import CButton from '@/components/CButton.jsx';
import CIcon from '@/components/CIcon.jsx';

export default function ProgramList() {
  const doFetch = useFetch();

  const [dataset, setDataset] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { code, data } = await doFetch('/v1/app/my/campaigns');
      if (code !== 200) {
        throw new Error('Failed to retrieve programs.');
      }
      console.log(data);
      setDataset(data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useOnce(() => {
    fetchData();
  });

  return (
    <>
      <Typography variant="body2" color="text.light" mt={1} mb={3}>
        You have joined {dataset.length} programs so far.
      </Typography>
      <Grid container spacing={3}>
        {dataset.map((data) => (
          <Grid key={data.id} xs={12} md={4}>
            <CampaignItem data={data} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

function CampaignItem({ data }) {
  console.log(data);
  const submission = data.enrolments?.[0] || {};

  return (
    <Box
      position="relative"
      display="flex"
      flexDirection="column"
      bgcolor="#fff"
      borderRadius="1rem"
      overflow="hidden"
      sx={{
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        transition: 'box-shadow .3s, transform .3s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '3px 6px 9px rgba(0,0,0,0.2)',
        },
      }}
    >
      <Box
        component="header"
        position="relative"
        bgcolor="background.main"
        pb="66.67%"
      >
        <Box
          component="img"
          src={data.cover_url}
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          sx={{ objectFit: 'cover' }}
        />
      </Box>
      <Box
        flexGrow="1"
        px={4}
        py={3}
      >
        <Typography variant="h6" fontWeight="500" mb={1}>
          {data.name}
        </Typography>
        <Typography variant="body2" mb={0.5}>
            Date: {format(new Date(submission.created_at), config.formatDateTime)}
        </Typography>
        <Typography variant="body2" mb={0.5}>
            Enrollment ID: {submission.id}
        </Typography>
      </Box>
    </Box>
  );
}
