'use client';

import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Typography from '@mui/material/Typography';
import EditorContent from './comps/EditorContent.jsx';
import FButton from './comps/FButton.jsx';
import { useContextState } from './hooks';

export default function StepIntro({ mounted, onNext }) {
  const data = useContextState('data');

  const isQuotaHit = useMemo(() => {
    if (data.quota !== undefined && data.quota !== null) {
      return data.enrolments_accepted_count >= data.quota;
    }
    return false;
  }, [data]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      height="100%"
      width="40rem"
      maxWidth="100%"
      mx="auto"
      sx={[
        {
          opacity: 0,
          transform: 'translateY(2rem)',
          transition: 'transform .5s ease-out, opacity .5s',
        },
        mounted && {
          opacity: 1,
          transform: 'translateY(0)',
        },
      ]}
    >
      <Typography
        variant="h1"
        fontSize="2.5rem"
        mb={1}
      >
        {data.intro_title}
      </Typography>
      {data.intro_description && (
        <EditorContent
          content={data.intro_description}
          fontSize="1rem"
        />
      )}
      {isQuotaHit && (
        <Box mt={6} mb={-3}>
          <Alert severity="warning">
            <AlertTitle>Oops!</AlertTitle>
            This campaign has reached its enrollment quota.
          </Alert>
        </Box>
      )}
      <Box mt={6} mb={6}>
        <FButton text="Get Start" disabled={isQuotaHit} onClick={onNext} />
      </Box>
    </Box>
  );
}
