'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FButton from './comps/FButton.jsx';
import { useContextState } from './hooks';

export default function StepIntro({ onNext }) {
  const data = useContextState('data');

  return (
    <Box textAlign="center">
      <Typography
        variant="h1"
        fontSize="2.5rem"
        mb={1}
      >
        {data.name}
      </Typography>
      <Typography
        component="div"
        variant="h5"
        color="text.light"
        fontWeight="300"
        lineHeight="1.75"
      >
        {data.description}
      </Typography>
      <Box mt={6}>
        <FButton text="Start" onClick={onNext} />
      </Box>
    </Box>
  );
}
