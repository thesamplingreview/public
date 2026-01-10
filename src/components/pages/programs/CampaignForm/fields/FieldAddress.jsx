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

  // Normalize value to always be an object
  const normalizedValue = useMemo(() => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return {};
    }
    return value;
  }, [value]);

  // Prefill from user delivery_address if available and not already filled
  useEffect(() => {
    // Check if value is empty (either undefined, empty string, empty object, or object with all empty values)
    const isEmpty = !normalizedValue || 
                    Object.keys(normalizedValue).length === 0 || 
                    Object.values(normalizedValue).every(v => !v || (typeof v === 'string' && v.trim() === ''));
    
    if (user?.deliveryAddress && !prefilled && isEmpty) {
      const addressData = user.deliveryAddress;
      // Only prefill if deliveryAddress is actually an object with data
      if (addressData && typeof addressData === 'object' && !Array.isArray(addressData)) {
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
    }
  }, [user, prefilled, normalizedValue, name, onChange]);

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
      return fields.every((key) => normalizedValue?.[key]?.trim());
    }
    return true;
  }, [field, normalizedValue]);

  const handleChange = (e) => {
    onChange({
      name,
      value: {
        ...normalizedValue,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleNext = async () => {
    // Save delivery_address to user profile if user is logged in
    if (user && normalizedValue) {
      setSaving(true);
      try {
        const result = await doFetch('/v1/auth/my', {
          method: 'PUT',
          data: {
            delivery_address: normalizedValue,
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
                value={normalizedValue?.name || ''}
                onChange={handleChange}
              />
            </Grid>
          )}
          {field.config?.fields?.includes('contact') && (
            <Grid xs={12}>
              <CInputPhone
                placeholder="Phone number"
                name="contact"
                value={normalizedValue?.contact || ''}
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
                value={normalizedValue?.email || ''}
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
                  value={normalizedValue?.address || ''}
                  onChange={handleChange}
                />
              </Grid>
              <Grid xs={6}>
                <CInput
                  placeholder="Postal code"
                  name="postal"
                  value={normalizedValue?.postal || ''}
                  onChange={handleChange}
                />
              </Grid>
              <Grid xs={6}>
                <CSelect
                  options={states}
                  placeholder="Select state"
                  name="state"
                  value={normalizedValue?.state || ''}
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
