'use client';

import { useMemo } from 'react';
import Box from '@mui/material/Box';
import FSelection from '../comps/FSelection.jsx';
import HintText from '../comps/HintText.jsx';
import FieldAction from '../comps/FieldAction.jsx';

export default function FieldYesNo({
  field,
  name,
  value,
  onChange,
  onPrev,
  onNext,
}) {
  const options = useMemo(() => ([
    { id: 'Yes', name: 'Yes' },
    { id: 'No', name: 'No' },
  ]), []);

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
          options={options}
          value={value}
          column="auto"
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
