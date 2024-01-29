'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import EditorContent from './comps/EditorContent.jsx';
import FButton from './comps/FButton.jsx';
import { useContextState } from './hooks';

export default function StepIntro({ mounted, onNext }) {
  const data = useContextState('data');

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
      <Box mt={6} mb={6}>
        <FButton text="Get Start" onClick={onNext} />
      </Box>
    </Box>
  );
}
