'use client';

import { useRef, useMemo, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import HintText from '../comps/HintText.jsx';
import FieldAction from '../comps/FieldAction.jsx';

export default function FieldText({
  field,
  name,
  value,
  onChange,
  onPrev,
  onNext,
}) {
  const $input = useRef(null);

  const isNextable = useMemo(() => {
    if (field.mandatory) {
      return Boolean(value.trim());
    }
    return true;
  }, [field.mandatory, value]);

  const handleChange = (e) => {
    onChange({
      name,
      value: e.target.value,
    });
  };

  useEffect(() => {
    $input.current.focus();
  }, []);

  return (
    <>
      <Box width="32rem" maxWidth="100%" mx="auto" mb={6}>
        <TextField
          inputRef={$input}
          variant="standard"
          fullWidth
          placeholder={field.placeholder}
          sx={{
            '& .MuiInputBase-input': {
              fontSize: '1.125em',
              fontWeight: 500,
              py: 1.5,
            },
          }}
          name={name}
          value={value}
          onChange={handleChange}
        />
        {field.hint && (
          <HintText text={field.hint} my={1} />
        )}
      </Box>
      <FieldAction
        disabled={!isNextable}
        onPrev={onPrev}
        onNext={onNext}
      />
    </>
  );
}
