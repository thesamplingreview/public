'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import config from '@/config/app';
import CButton from '@/components/CButton.jsx';
import DialogReviewProgram from './DialogReviewProgram.jsx';

export default function ProgramCard({ data, refetch }) {
  // assuming:
  // 1. all data is belongs to user only
  // 2. each user can have only 1 data
  const submission = data.enrolments?.[0] || {};
  const review = data.reviews?.[0] || {};

  const [isReview, setIsReview] = useState(false);

  const handleReviewClose = (isChanged) => {
    setIsReview(false);
    // if data is changed, force refetch (method from parent)
    if (isChanged) {
      refetch();
    }
  };

  return (
    <>
      <Box
        position="relative"
        display="flex"
        flexDirection="column"
        bgcolor="#fff"
        borderRadius="1rem"
        height="100%"
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
          component={Link}
          href={`/programs/${data.slug}`}
          position="relative"
          bgcolor="background.main"
          pb="66.67%"
        >
          <Box
            component="img"
            src={data.cover_url || '/images/placeholder.svg'}
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
          {review.id && (
            <Box mt={2}>
              <Typography variant="body2">
                Review submitted at: <br />{format(new Date(review.updated_at), config.formatDateTime)}
              </Typography>
              <CButton
                variant="text"
                size="small"
                sx={{ p: 0, fontSize: '0.75em' }}
                onClick={() => setIsReview(true)}
              >
                Edit review
              </CButton>
            </Box>
          )}
          {!review.id && (
            <Box mt={3}>
              <CButton
                variant="outlined"
                size="small"
                onClick={() => setIsReview(true)}
              >
                Write review
              </CButton>
            </Box>
          )}
        </Box>
      </Box>

      <DialogReviewProgram
        open={isReview}
        data={data}
        onClose={handleReviewClose}
      />
    </>
  );
}
