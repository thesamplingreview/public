'use client';

import { useRef, useMemo, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import CInput from '@/components/CInput.jsx';
import CSelect from '@/components/CSelect.jsx';
import CInputPhone from '@/components/CInputPhone.jsx';
import FieldAction from '../comps/FieldAction.jsx';

export default function FieldAddress({
  field,
  name,
  value,
  onChange,
  onPrev,
  onNext,
}) {
  const $input = useRef(null);

  const isNextable = useMemo(() => {
    if (field.mandatory) {
      const {
        name: inputName, email, contact, address, postal, state,
      } = value || {};

      return (
        inputName?.trim()
        && email
        && contact
        && address?.trim()
        && postal?.trim()
        && state
      );
    }
    return true;
  }, [field.mandatory, value]);

  const handleChange = (e) => {
    onChange({
      name,
      value: {
        ...value,
        [e.target.name]: e.target.value,
      },
    });
  };

  useEffect(() => {
    $input.current.focus();
  }, []);

  return (
    <>
      <Box width="32rem" maxWidth="100%" mx="auto" flexGrow="1" mb={6}>
        <Grid container spacing={2}>
          <Grid xs={12}>
            <CInput
              inputRef={$input}
              placeholder="Recipient name"
              name="name"
              value={value?.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid xs={12}>
            <CInputPhone
              placeholder="Phone number"
              prefixes={[
                { id: '+60', name: 'aaa' },
                { id: '+61', name: 'aaa' },
              ]}
              name="contact"
              value={value?.contact}
              onChange={handleChange}
            />
          </Grid>
          <Grid xs={12}>
            <CInput
              type="email"
              placeholder="Email address"
              name="email"
              value={value?.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid xs={12}>
            <CInput
              multiline
              minRows={3}
              placeholder="Mailling address"
              name="address"
              value={value?.address}
              onChange={handleChange}
            />
          </Grid>
          <Grid xs={6}>
            <CInput
              placeholder="Postal code"
              name="postal"
              value={value?.postal}
              onChange={handleChange}
            />
          </Grid>
          <Grid xs={6}>
            <CSelect
              options={[
                { id: 1, name: 'Option 1' },
                { id: 2, name: 'Option 2' },
              ]}
              placeholder="Select state"
              name="state"
              value={value?.state}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </Box>
      <FieldAction
        disabled={!isNextable}
        onPrev={onPrev}
        onNext={onNext}
      />
    </>
  );
}
