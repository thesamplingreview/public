'use client';

import { useMemo, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useContextState, useInput } from './hooks';
import FButton from './comps/FButton.jsx';
import fields from './fields';

export default function StepDynamic({ step, onNext }) {
  const formLayout = useContextState('formLayout');
  const [input, setInput] = useInput();

  const field = useMemo(() => {
    return formLayout[step - 1];
  }, [formLayout, step]);

  const isNextable = useMemo(() => {
    if (field.mandatory) {
      return Boolean(input[field.id]?.trim());
    }
    return true;
  }, [input, field]);

  const handleChange = useCallback((e) => {
    console.log(e.target)
    setInput((state) => ({
      ...state,
      [e.target.name]: e.target.value,
    }));
  }, [setInput]);

  return (
    <Box textAlign="center">
      {/* header */}
      <Box component="header">
        <Typography
          variant="h1"
          fontSize="2rem"
          mb={1}
        >
          {field.name}
        </Typography>
        {field.description && (
          <Typography
            component="div"
            variant="body1"
            color="text.light"
            fontWeight="300"
            lineHeight="1.75"
          >
            {field.description}
          </Typography>
        )}
      </Box>

      {/* body */}
      <Box my={6}>
        <FieldItem
          field={field}
          value={input[field.id] || ''}
          onChange={handleChange}
        />
      </Box>

      {/* action */}
      <Box>
        <FButton disabled={!isNextable} text="Next" onClick={onNext} />
      </Box>
    </Box>
  );
}

function FieldItem({ field, value, onChange }) {
  useEffect(() => {
    console.log(field);
  }, [field]);

  const Comp = fields[field.type];
  if (Comp) {
    return (
      <Comp
        field={field}
        name={`${field.id}`}
        value={value}
        onChange={onChange}
      />
    );
  }
  return null;
}
