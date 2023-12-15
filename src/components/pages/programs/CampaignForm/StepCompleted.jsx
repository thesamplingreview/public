'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import config from '@/config/app';
import CButton from '@/components/CButton.jsx';
import { useContextState } from './hooks';

export default function StepCompleted({ mounted }) {
  const [submission] = useContextState(['submission']);

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
        Great Program Enrolled!
      </Typography>
      <Typography
        component="div"
        variant="body1"
        color="text.light"
        fontWeight="300"
        fontSize="1.125rem"
        lineHeight="1.75"
      >
        Thank you for participate in our sampling review program. <br />bla bla bla
      </Typography>
      <Box mt={3}>
        <Typography
          variant="body2"
          component="div"
        >
          Enrolment ID: {submission.id}
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
