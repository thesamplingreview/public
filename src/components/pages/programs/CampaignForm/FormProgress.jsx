'use client';

import { useMemo } from 'react';
import Box from '@mui/material/Box';
import { useContextState, useStep } from './hooks';

export default function FormProgress() {
  const formLayout = useContextState('formLayout');
  const [step] = useStep();

  const percentage = useMemo(() => {
    if (step === 0) {
      return 0;
    }
    return Math.round((100 / formLayout.length) * (step - 1));
  }, [step, formLayout]);

  return (
    <Box
      position="fixed"
      left="0"
      right="0"
      bottom="0"
    >
      <Box
        position="relative"
        height="4px"
        bgcolor="primary.main"
        sx={{
          width: `${percentage}%`,
          borderRadius: '0 1rem 1rem 0',
          transition: 'width .3s',
        }}
      />
    </Box>
  );
}
