'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import { states } from '@/config/options';
import CInput from '@/components/CInput.jsx';
import CSelect from '@/components/CSelect.jsx';
import CInputPhone from '@/components/CInputPhone.jsx';
import HintText from '../comps/HintText.jsx';
import FieldAction from '../comps/FieldAction.jsx';
import { useAuth } from '@/hooks/auth';
import { useFetch } from '@/hooks/fetcher';

export default function FieldAddress({
  field,
  name,
  value,
  onChange,
  onPrev,
  onNext,
}) {
  const $el = useRef(null);
  const [user, setUser] = useAuth();
  const doFetch = useFetch();
  const [saving, setSaving] = useState(false);
  const [prefilled, setPrefilled] = useState(false);

  // Prefill from user delivery_address if available and not already filled
  useEffect(() => {
    if (user?.deliveryAddress && !prefilled && (!value || Object.keys(value).length === 0 || Object.values(value).every(v => !v))) {
      const addressData = user.deliveryAddress;
      onChange({
        name,
        value: {
          name: addressData.name || '',
          email: addressData.email || '',
          contact: addressData.contact || '',
          address: addressData.address || '',
          postal: addressData.postal || '',
          state: addressData.state || '',
        },
      });
      setPrefilled(true);
    }
  }, [user, prefilled, value, name, onChange]);

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

  const handleNext = async () => {
    // Save delivery_address to user profile if user is logged in
    if (user && value) {
      setSaving(true);
      try {
        const result = await doFetch('/v1/auth/my', {
          method: 'PUT',
          data: {
            delivery_address: value,
          },
        });
        // Update user context with new delivery_address
        if (result?.data) {
          setUser(result.data);
        }
      } catch (err) {
        // Silently fail - don't block form submission if save fails
        // eslint-disable-next-line no-console
        console.error('Failed to save delivery address:', err);
      } finally {
        setSaving(false);
      }
    }
    onNext();
  };

  useEffect(() => {
    const $input = $el.current.querySelector('input, textarea');
    if ($input) {
      $input.focus();
    }
  }, []);

  return (
    <>
      <Box width="32rem" maxWidth="100%" mx="auto" mb={6}>
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
          {field.config?.fields?.includes('contact') && (
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
        disabled={!isNextable || saving}
        onPrev={onPrev}
        onNext={handleNext}
      />
    </>
  );
}
