'use client';

import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { toStringWithData } from '@/helpers/utils';
import { useContextState } from '../hooks';
import HintText from '../comps/HintText.jsx';
import FieldAction from '../comps/FieldAction.jsx';

export default function FieldSelectImage({
  field,
  name,
  value,
  onChange,
  onPrev,
  onNext,
}) {
  const [theme] = useContextState(['theme']);

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
    }
    return 3;
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
      <Box width="50rem" maxWidth="100%" mx="auto" mb={6}>
        <Grid container justifyContent="center" spacing={3}>
          {field.options.map((opt) => (
            <Grid key={opt.id} xs={6} lg={columnSize}>
              <SelectItem
                item={opt}
                theme={theme}
                selected={internalValue.includes(opt.id)}
                disabled={checkDisabled(opt.id)}
                onClick={handleSelect}
              />
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

function SelectItem({
  item,
  theme,
  selected,
  disabled,
  onClick,
}) {
  const imageUrl = useMemo(() => {
    return item.image_url || '/images/product-placeholder.svg';
  }, [item.image_url]);

  const handleClick = () => {
    onClick(item);
  };

  return (
    <Button
      color="text"
      sx={[
        {
          position: 'relative',
          width: '100%',
          height: '100%',
          boxShadow: '0 1px 3px rgba(0,0,0,.15)',
          bgcolor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.8)',
          border: '1px solid transparent',
          borderRadius: '1rem',
          textAlign: 'center',
          flexDirection: 'column',
          fontSize: '0.875rem',
          px: 2,
          py: 3,
          transition: 'all .3s',
          '&:hover': {
            bgcolor: theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.95)',
            boxShadow: '0 3px 6px rgba(0,0,0,.25)',
            transform: 'translateY(-2px)',
          },
          '&:disabled': {
            opacity: '0.4',
          },
        },
        selected && ((t) => ({
          color: t.palette.primary.main,
          borderColor: t.palette.primary.main,
          outline: `1px solid ${t.palette.primary.main}`,
          '&:hover': {
            borderColor: t.palette.primary.main,
          },
        })),
      ]}
      disabled={disabled}
      onClick={handleClick}
    >
      <Box
        display="flex"
        alignItems="center"
        width="100%"
        flexGrow="1"
        mb={2}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={item.name}
          width="80"
          height="80"
          style={{ width: '100%', height: 'auto' }}
        />
      </Box>
      <Typography
        variant="h6"
        fontSize="1em"
        fontWeight="500"
        color={theme === 'dark' ? '#fff' : 'text.main'}
        lineHeight="1.35"
      >
        {item.name}
      </Typography>

      {item.sub && (
        <Typography
          component="div"
          variant="body2"
          fontSize="0.875em"
          color="text.light"
          lineHeight="1.35"
        >
          {item.sub}
        </Typography>
      )}
    </Button>
  );
}
