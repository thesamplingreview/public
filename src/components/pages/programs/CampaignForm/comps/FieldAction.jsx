'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CIcon from '@/components/CIcon.jsx';
import FButton from './FButton.jsx';

export default function FieldAction({
  text = 'Next',
  disabled,
  onPrev,
  onNext,
}) {
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <FButton
        disabled={disabled}
        text={text}
        onClick={onNext}
      />
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
  );
}
