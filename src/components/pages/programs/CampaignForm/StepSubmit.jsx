'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CIcon from '@/components/CIcon.jsx';
import CLoadingButton from '@/components/CLoadingButton.jsx';
import { useContextState } from './hooks';

export default function StepSubmit({ onPrev, onSubmit }) {
  const data = useContextState('data');
  const saving = useContextState('saving');

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
        <Typography
          variant="h1"
          fontSize="2rem"
          mb={1}
        >
          Almost Done
        </Typography>
        <Typography
          component="div"
          variant="body1"
          color="text.light"
          fontWeight="300"
          lineHeight="1.75"
        >
          {data.description}
        </Typography>
      </Box>
      {/* action */}
      <Box display="flex" flexDirection="column" alignItems="center" mt={6}>
        <CLoadingButton variant="contained" disabled={saving} onClick={onSubmit}>
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
          startIcon={<CIcon name="chevron-left" size="0.75rem" />}
          onClick={onPrev}
        >
          Previous
        </Button>
      </Box>
    </Box>
  );
}
