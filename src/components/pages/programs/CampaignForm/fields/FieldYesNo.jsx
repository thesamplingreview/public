'use client';

import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import CButton from '@/components/CButton.jsx';
import FieldAction from '../comps/FieldAction.jsx';

export default function FieldYesNo({
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
      <Box width="40rem" maxWidth="100%" mx="auto" flexGrow="1" mb={6}>
        <Stack justifyContent="center" direction="row" gap={3}>
          {field.options.map((opt) => (
            <CButton
              key={opt.id}
              variant="outlined"
              color="text"
              size="small"
              startIcon={(
                <Box
                  width=".35em"
                  height=".35em"
                  borderRadius="50%"
                  border="1px solid rgba(63, 64, 71, 0.5)"
                  sx={[
                    {
                      transition: 'background .3s, border .3s',
                    },
                    opt.id === value && ((theme) => ({
                      bgcolor: theme.palette.primary.main,
                      borderColor: theme.palette.primary.main,
                    })),
                  ]}
                />
              )}
              sx={[
                {
                  position: 'relative',
                  boxShadow: '0 1px 3px rgba(0,0,0,.15)',
                  bgcolor: '#fff',
                  px: 3,
                  transition: 'all .3s',
                  '&:hover': {
                    bgcolor: '#fff',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 3px 6px rgba(0,0,0,.25)',
                  },
                },
                opt.id === value && ((theme) => ({
                  color: theme.palette.primary.main,
                  borderColor: theme.palette.primary.main,
                  outline: `1px solid ${theme.palette.primary.main}`,
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                  },
                })),
              ]}
              onClick={() => handleSelect(opt)}
            >
              {opt.name}
            </CButton>
          ))}
        </Stack>
      </Box>
      <FieldAction
        disabled={!isNextable}
        onPrev={onPrev}
        onNext={onNext}
      />
    </>
  );
}
