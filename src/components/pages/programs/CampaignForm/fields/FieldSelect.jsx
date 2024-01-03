'use client';

import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import { toStringWithData } from '@/helpers/utils';
import CButton from '@/components/CButton.jsx';
import HintText from '../comps/HintText.jsx';
import FieldAction from '../comps/FieldAction.jsx';

export default function FieldSelect({
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

  const maxCount = useMemo(() => {
    return Number(field.config?.select_count || 1);
  }, [field.config]);

  const internalValue = useMemo(() => {
    if (!value || !value.length) {
      return [];
    }
    if (!Array.isArray(value)) {
      return [value];
    }
    return value;
  }, [value]);

  const isNextable = useMemo(() => {
    if (field.mandatory) {
      return maxCount > 1 ? value?.length : Boolean(value);
    }
    return true;
  }, [field.mandatory, maxCount, value]);

  const checkDisabled = (val) => {
    if (maxCount > 1 && internalValue.length === maxCount) {
      return !internalValue.includes(val);
    }
    return false;
  };

  const handleSelect = (opt) => {
    let newValue;
    // different behavior for multiple & single selection
    if (maxCount > 1) {
      if (internalValue.includes(opt.id)) { // deselect
        newValue = internalValue.filter((v) => v !== opt.id);
      } else if (internalValue.length < maxCount) { // select
        newValue = [...internalValue, opt.id];
      } else { // unable to select
        return;
      }
    } else {
      newValue = opt.id;
    }

    onChange({
      name,
      value: newValue,
    });
  };

  return (
    <>
      <Box width="40rem" maxWidth="100%" mx="auto" flexGrow="1" mb={6}>
        <Grid container justifyContent="center" spacing={3}>
          {field.options.map((opt) => (
            <Grid key={opt.id} xs={12} lg={columnSize}>
              <CButton
                variant="outlined"
                color="text"
                size="small"
                fullWidth
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
                      internalValue.includes(opt.id) && ((theme) => ({
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
                    justifyContent: 'flex-start',
                    transition: 'all .3s',
                    '&:hover': {
                      bgcolor: '#fff',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 3px 6px rgba(0,0,0,.25)',
                    },
                  },
                  internalValue.includes(opt.id) && ((theme) => ({
                    color: theme.palette.primary.main,
                    borderColor: theme.palette.primary.main,
                    outline: `1px solid ${theme.palette.primary.main}`,
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
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
        {field.hint && (
          <HintText
            text={toStringWithData(field.hint, {
              count: internalValue.length,
              total: maxCount,
              left: maxCount - internalValue.length,
            })}
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
