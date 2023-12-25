'use client';

import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import CIcon from '@/components/CIcon.jsx';
import CLoadingButton from '@/components/CLoadingButton.jsx';
import { useContextState } from './hooks';
import EditorContent from './comps/EditorContent.jsx';

export default function StepSubmit({ onPrev, onSubmit }) {
  const [data, saving, validator] = useContextState(['data', 'saving', 'validator']);

  const errorMessage = useMemo(() => {
    if (!validator) {
      return '';
    }
    return Object.values(validator).join('<br>');
  }, [validator]);

  return (
    <Box
      display="flex"
      alignItems="center"
      flexDirection="column"
      height="100%"
      width="40rem"
      maxWidth="100%"
      py={3}
    >
      {/* body */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        flexGrow="1"
      >
        {/* validator */}
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <AlertTitle>Ops something is wrong</AlertTitle>
            <span dangerouslySetInnerHTML={{ __html: errorMessage }} />
          </Alert>
        )}

        <Typography
          variant="h1"
          fontSize="2rem"
          mb={1}
        >
          {data.presubmit_title || 'Almost Done'}
        </Typography>
        {data.presubmit_description && (
          <EditorContent
            content={data.presubmit_description}
            color="text.light"
          />
        )}
      </Box>

      {/* action */}
      <Box display="flex" flexDirection="column" alignItems="center" mt={6}>
        <CLoadingButton
          variant="contained"
          loading={saving}
          onClick={onSubmit}
        >
          Submit Form
        </CLoadingButton>
        <Button
          color="text"
          size="small"
          sx={{
            fontWeight: '300',
            fontSize: '0.75rem',
            color: 'var(--color-300)',
            py: 0.5,
            mt: 2,
          }}
          disabled={saving}
          startIcon={<CIcon name="chevron-left" size="0.75rem" />}
          onClick={onPrev}
        >
          Previous
        </Button>
      </Box>
    </Box>
  );
}
