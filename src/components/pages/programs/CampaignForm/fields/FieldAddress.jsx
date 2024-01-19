'use client';

import { useRef, useMemo, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import { states } from '@/config/options';
import CInput from '@/components/CInput.jsx';
import CSelect from '@/components/CSelect.jsx';
import CInputPhone from '@/components/CInputPhone.jsx';
import HintText from '../comps/HintText.jsx';
import FieldAction from '../comps/FieldAction.jsx';

export default function FieldAddress({
  field,
  name,
  value,
  onChange,
  onPrev,
  onNext,
}) {
  const $el = useRef(null);

  const isNextable = useMemo(() => {
    if (field.mandatory) {
      const fields = [];
      if (field.config?.fields?.includes('name')) {
        fields.push('name');
      }
      if (field.config?.fields?.includes('email')) {
        fields.push('email');
      }
      if (field.config?.fields?.includes('contact')) {
        fields.push('contact');
      }
      if (field.config?.fields?.includes('address')) {
        fields.push('address', 'postal', 'state');
      }
      return fields.every((key) => value?.[key]?.trim());
    }
    return true;
  }, [field, value]);

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
    const $input = $el.current.querySelector('input, textarea');
    if ($input) {
      $input.focus();
    }
  }, []);

  return (
    <>
      <Box width="32rem" maxWidth="100%" mx="auto" flexGrow="1" mb={6}>
        <Grid ref={$el} container spacing={2}>
          {field.config?.fields?.includes('name') && (
            <Grid xs={12}>
              <CInput
                placeholder="Recipient name"
                name="name"
                value={value?.name || ''}
                onChange={handleChange}
              />
            </Grid>
          )}
          {field.config?.fields?.includes('phone') && (
            <Grid xs={12}>
              <CInputPhone
                placeholder="Phone number"
                name="contact"
                value={value?.contact}
                onChange={handleChange}
              />
            </Grid>
          )}
          {field.config?.fields?.includes('email') && (
            <Grid xs={12}>
              <CInput
                type="email"
                placeholder="Email address"
                name="email"
                value={value?.email || ''}
                onChange={handleChange}
              />
            </Grid>
          )}
          {field.config?.fields?.includes('address') && (
            <>
              <Grid xs={12}>
                <CInput
                  multiline
                  minRows={3}
                  placeholder="Mailling address"
                  name="address"
                  value={value?.address || ''}
                  onChange={handleChange}
                />
              </Grid>
              <Grid xs={6}>
                <CInput
                  placeholder="Postal code"
                  name="postal"
                  value={value?.postal || ''}
                  onChange={handleChange}
                />
              </Grid>
              <Grid xs={6}>
                <CSelect
                  options={states}
                  placeholder="Select state"
                  name="state"
                  value={value?.state || ''}
                  onChange={handleChange}
                />
              </Grid>
           </>
          )}
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
