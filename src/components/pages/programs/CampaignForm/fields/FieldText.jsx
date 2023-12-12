'use client';

import { useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function FieldText({
  field, name, value, onChange,
}) {
  const $input = useRef(null);

  useEffect(() => {
    $input.current.focus();
  }, []);

  return (
    <Box px={{ lg: 6 }}>
      <TextField
        inputRef={$input}
        variant="standard"
        fullWidth
        placeholder={field.placeholder}
        sx={{
          '& .MuiInputBase-input': {
            fontSize: '1.125em',
            py: 1.5,
          },
        }}
        name={name}
        value={value}
        onChange={onChange}
      />
    </Box>
  );
}
