'use client';

import { useMemo, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useContextState, useInput } from './hooks';
import fields from './fields';

export default function StepDynamic({ step, onPrev, onNext }) {
  const formLayout = useContextState('formLayout');
  const [input, setInput] = useInput();

  const field = useMemo(() => {
    return formLayout[step - 1];
  }, [formLayout, step]);

  const handleChange = useCallback(({ name, value }) => {
    setInput((state) => ({
      ...state,
      [name]: value,
    }));
  }, [setInput]);

  return (
    <Box
      display="flex"
      alignItems="center"
      flexDirection="column"
      height="100%"
      py={3}
    >
      {/* header */}
      <Box
        textAlign="center"
        width="40rem"
        maxWidth="100%"
        mb={6}
      >
        <Typography
          variant="h1"
          component="h2"
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
      <FieldItem
        field={field}
        value={input[field.id] || ''}
        onChange={handleChange}
        onPrev={onPrev}
        onNext={onNext}
      />
    </Box>
  );
}

function FieldItem({
  field, value, onChange, onPrev, onNext,
}) {
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
        onPrev={onPrev}
        onNext={onNext}
      />
    );
  }
  return null;
}
