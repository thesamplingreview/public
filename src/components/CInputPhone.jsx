import { useState, useMemo } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { useUpdated } from '@/hooks/ui';
import { phonePrefixes } from '@/config/options';
import CInput from './CInput.jsx';
import CSelect from './CSelect.jsx';

export default function CInputPhone({
  value,
  name = '',
  disabled = false,
  onChange,
  ...props
}) {
  const [internalVal, setInternalVal] = useState(value || '');

  const prefixes = useMemo(() => {
    return phonePrefixes.map((d) => ({
      id: d.id,
      name: `${d.name} (${d.id})`,
    }));
  }, []);

  const valuePrefix = useMemo(() => {
    if (!prefixes.length) {
      return '';
    }
    const found = prefixes.find((d) => d.id === internalVal.substring(0, d.id.length));
    return found?.id || prefixes[0].id;
  }, [internalVal, prefixes]);

  const valueNumber = useMemo(() => {
    return internalVal.replace(valuePrefix, '');
  }, [internalVal, valuePrefix]);

  const valueFull = useMemo(() => {
    if (!valueNumber) {
      return '';
    }
    return `${valuePrefix}${valueNumber}`;
  }, [valuePrefix, valueNumber]);

  const handleChangePrefix = (e) => {
    // reset number
    setInternalVal(e.target.value);
  };

  const handleChangeNumber = (e) => {
    const input = e.target.value.replace(/[^0-9]/g, '');
    setInternalVal(`${valuePrefix}${input}`);
  };

  useUpdated(() => {
    onChange({
      target: {
        name,
        value: valueFull,
      },
    });
  }, [valueFull]);

  return (
    <Grid container spacing={1}>
      {name && (
        <input
          type="hidden"
          name={name}
          value={valueFull}
        />
      )}
      <Grid xs="auto">
        <CSelect
          value={valuePrefix}
          options={prefixes}
          disabled={disabled}
          renderValue={(val) => val}
          sx={{ width: 90 }}
          onChange={handleChangePrefix}
        />
      </Grid>
      <Grid xs>
        <CInput
          {...props}
          disabled={disabled}
          value={valueNumber}
          onChange={handleChangeNumber}
        />
      </Grid>
    </Grid>
  );
}
