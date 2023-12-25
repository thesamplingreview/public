'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import config from '@/config/app';
import CButton from '@/components/CButton.jsx';
import { useContextState } from './hooks';
import EditorContent from './comps/EditorContent.jsx';

export default function StepCompleted({ mounted }) {
  const [data, submission] = useContextState(['data', 'submission']);

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
        component="h2"
        fontSize="2.5rem"
        mb={1}
      >
        {data.postsubmit_title || 'Great Program Enrolled!'}
      </Typography>
      {data.postsubmit_description && (
        <EditorContent
          content={data.postsubmit_description}
          color="text.light"
        />
      )}
      <Box mt={3}>
        <Typography
          variant="body2"
          component="div"
        >
          Enrollment ID: {submission.id}
        </Typography>
        {submission.created_at && (
          <Typography
            variant="body2"
            component="div"
          >
            Date: {format(new Date(submission.created_at), config.formatDateTime)}
          </Typography>
        )}
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center" mt={6}>
        <CButton
          component={Link}
          href="/"
          variant="contained"
        >
          View more programs
        </CButton>
      </Box>
    </Box>
  );
}
