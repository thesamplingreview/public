'use client';

import { useMemo } from 'react';
import Box from '@mui/material/Box';
import { states } from '@/config/options';
import FSelection from '../comps/FSelection.jsx';
import HintText from '../comps/HintText.jsx';
import FieldAction from '../comps/FieldAction.jsx';

export default function FieldState({
  field,
  name,
  value,
  onChange,
  onPrev,
  onNext,
}) {
  const isNextable = useMemo(() => {
    if (field.mandatory) {
      return Boolean(value);
    }
    return true;
  }, [field.mandatory, value]);

  const handleSelect = (opt) => {
    onChange({
      name,
      value: opt.id,
    });
  };

  return (
    <>
      <Box width="40rem" maxWidth="100%" mx="auto" mb={6}>
        <FSelection
          value={value}
          options={states}
          column={field.config?.layout}
          maxCount={1}
          onSelect={handleSelect}
        />
        {field.hint && (
          <HintText
            text={field.hint}
            textAlign="center"
            mt={4}
          />
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
