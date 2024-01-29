'use client';

import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import CButton from '@/components/CButton.jsx';
import { useContextState } from '../hooks';

export default function FSelection({
  value,
  column,
  options,
  maxCount = 1,
  onSelect,
}) {
  const theme = useContextState('theme');

  const columnSize = useMemo(() => {
    if (column) {
      const layout = Number(column);
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
  }, [column]);

  const internalValue = useMemo(() => {
    if (!value || !value.length) {
      return [];
    }
    if (!Array.isArray(value)) {
      return [value];
    }
    return value;
  }, [value]);

  const checkDisabled = (val) => {
    if (maxCount > 1 && internalValue.length === maxCount) {
      return !internalValue.includes(val);
    }
    return false;
  };

  const handleSelect = (opt) => {
    onSelect(opt);
  };

  return (
    <Grid container justifyContent="center" spacing={3}>
      {options.map((opt) => (
        <Grid key={opt.id} xs={12} lg={columnSize}>
          <CButton
            key={opt.id}
            variant="outlined"
            color="text"
            size="small"
            fullWidth
            startIcon={(
              <Box
                width=".35em"
                height=".35em"
                borderRadius="50%"
                border="1px solid"
                borderColor={theme === 'dark' ? 'rgba(255,255,255,.5)' : 'rgba(0,0,0,0.5)'}
                sx={[
                  {
                    transition: 'background .3s, border .3s',
                  },
                  opt.id === value && ((t) => ({
                    bgcolor: t.palette.primary.main,
                    borderColor: t.palette.primary.main,
                  })),
                ]}
              />
            )}
            sx={[
              {
                position: 'relative',
                boxShadow: '0 1px 3px rgba(0,0,0,.15)',
                color: theme === 'dark' ? '#fff' : 'text.main',
                bgcolor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.8)',
                px: 3,
                justifyContent: 'flex-start',
                transition: 'all .3s',
                '&:hover': {
                  bgcolor: theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,.95)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 3px 6px rgba(0,0,0,.25)',
                },
                '&:disabled': {
                  color: theme === 'dark' ? '#fff' : 'text.main',
                  opacity: 0.5,
                },
              },
              internalValue.includes(opt.id) && ((t) => ({
                color: t.palette.primary.main,
                borderColor: t.palette.primary.main,
                outline: `1px solid ${t.palette.primary.main}`,
                '&:hover': {
                  borderColor: t.palette.primary.main,
                },
              })),
            ]}
            disabled={checkDisabled(opt.id)}
            onClick={() => handleSelect(opt)}
          >
            {opt.name}
          </CButton>
        </Grid>
      ))}
    </Grid>
  );
}
