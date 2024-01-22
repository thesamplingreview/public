'use client';

import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import { states } from '@/config/options';
import CButton from '@/components/CButton.jsx';
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
  const columnSize = useMemo(() => {
    if (field.config?.layout) {
      const layout = Number(field.config.layout);
      if (layout === 1) {
        return 12;
      }
      if (layout === 2) {
        return 6;
      }
      if (layout === 3) {
        return 4;
      }
      if (layout === 4) {
        return 3;
      }
    }
    return 'auto';
  }, [field.config]);

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
        <Grid container justifyContent="center" spacing={3}>
          {states.map((opt) => (
            <Grid key={opt.id} xs={12} lg={columnSize}>
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
            </Grid>
          ))}
        </Grid>
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
