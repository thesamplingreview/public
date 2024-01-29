'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import config from '@/config/app';
import CButton from '@/components/CButton.jsx';
import { useContextState } from './hooks';
import EditorContent from './comps/EditorContent.jsx';

export default function StepCompleted({ mounted }) {
  const [
    theme,
    data,
    formLayout,
    submission,
  ] = useContextState([
    'theme',
    'data',
    'formLayout',
    'submission',
  ]);

  const formFields = useMemo(() => {
    return formLayout.map((field) => {
      let answer = submission.submissions[field.id];
      let dataType = 'text';

      if (answer) {
        // custom type handling
        if (field.type === 'products') {
          const productIds = Array.isArray(answer) ? answer : [answer];
          const products = data.products?.filter((d) => productIds.includes(d.id))
            .map((d) => d.name);
          answer = products.join(', ');
        } else if (field.type === 'address') {
          answer = [
            answer.name,
            answer.contact,
            answer.address,
            answer.postal,
            answer.state,
          ].filter((v) => v).join(', ');
        } else if (field.type === 'file') {
          dataType = 'url';
        } else if (Array.isArray(answer)) {
          answer = answer.join(', ');
        } else if (typeof answer === 'object') {
          answer = answer.toString();
        }
      }

      return {
        dataType,
        id: field.id,
        type: field.type,
        label: field.name,
        value: answer,
      };
    }) || [];
  }, [formLayout, submission, data]);

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
        />
      )}
      <Box
        bgcolor={theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'background.light'}
        borderRadius="1rem"
        width="100%"
        fontSize="0.875rem"
        maxHeight="200px"
        textAlign="left"
        py={1.5}
        px={2}
        mt={3}
        sx={{ overflowY: 'auto' }}
      >
        <FormDataItem
          label="Enrolment ID"
          value={`#${submission.id}`}
        />
        {submission.created_at && (
          <FormDataItem
            label="Submission Date"
            value={format(new Date(submission.created_at), config.formatDateTime)}
          />
        )}
        {formFields.map((field) => (
          <FormDataItem
            key={field.id}
            label={field.label}
            value={field.value}
            type={field.dataType}
          />
        ))}
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

function FormDataItem({
  label,
  value,
  type = 'text',
}) {
  return (
    <Grid container my={1}>
      <Grid xs={12} sm={6}>
        {label}:
      </Grid>
      <Grid xs={12} sm={6}>
        {type === 'url' && value && (
          <Typography
            component="a"
            href={value}
            variant="inherit"
            fontWeight="500"
            target="_blank"
          >
            view file
          </Typography>
        )}
        {type === 'text' && (
          <Typography variant="inherit" fontWeight="500">
            {value || '-'}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
}
