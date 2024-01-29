'use client';

import { useMemo } from 'react';
import Box from '@mui/material/Box';
import { toStringWithData } from '@/helpers/utils';
import FSelection from '../comps/FSelection.jsx';
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
      <Box width="40rem" maxWidth="100%" mx="auto" mb={6}>
        <FSelection
          options={field.options}
          value={value}
          column={field.config?.layout}
          maxCount={maxCount}
          onSelect={handleSelect}
        />
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
