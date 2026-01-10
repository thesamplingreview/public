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

  // Prefill from user delivery_address first, then fall back to user email/contact if missing
  useEffect(() => {
    if (!user) return;

    const addressData = user.deliveryAddress;
    const hasDeliveryAddress = addressData && typeof addressData === 'object' && !Array.isArray(addressData);

    // Check if value is empty (either undefined, empty string, empty object, or object with all empty values)
    const isEmpty = !normalizedValue || 
                    Object.keys(normalizedValue).length === 0 || 
                    Object.values(normalizedValue).every(v => !v || (typeof v === 'string' && v.trim() === ''));

    if (isEmpty) {
      // Form is completely empty - try delivery address first, then user email/contact/name
      if (hasDeliveryAddress) {
        // Use delivery address data, with user email/contact/name as fallback for those specific fields
        // Get name: prioritize user.name if exists, then delivery address name, then extract from email
        let recipientName = '';
        if (user.name && typeof user.name === 'string' && user.name.trim()) {
          recipientName = user.name;
        } else if (addressData.name && typeof addressData.name === 'string' && addressData.name.trim()) {
          recipientName = addressData.name;
        } else if (user.email) {
          // Extract username from email (part before @)
          recipientName = user.email.split('@')[0];
        }
        
        onChange({
          name,
          value: {
            name: recipientName,
            email: addressData.email || user.email || '',
            contact: (addressData.contact && typeof addressData.contact === 'string' && addressData.contact.trim()) 
              ? addressData.contact 
              : (user.contact && typeof user.contact === 'string' && user.contact.trim() ? user.contact : ''),
            address: addressData.address || '',
            postal: addressData.postal || '',
            state: addressData.state || '',
          },
        });
        setPrefilled(true);
      } else {
        // No delivery address - use user email, contact, and name if available
        const prefillValue = {};
        if (field.config?.fields?.includes('name')) {
          // Try user.name first, then extract from email
          if (user.name && typeof user.name === 'string' && user.name.trim()) {
            prefillValue.name = user.name;
          } else if (user.email) {
            // Extract username from email (part before @)
            prefillValue.name = user.email.split('@')[0];
          }
        }
        if (user.email && field.config?.fields?.includes('email')) {
          prefillValue.email = user.email;
        }
        // Check if contact exists and is not empty
        if (user.contact && typeof user.contact === 'string' && user.contact.trim() && field.config?.fields?.includes('contact')) {
          prefillValue.contact = user.contact;
        }
        if (Object.keys(prefillValue).length > 0) {
          onChange({
            name,
            value: prefillValue,
          });
          setPrefilled(true);
        }
      }
    } else {
      // Form is partially filled - check for missing fields and fill them
      // This runs even if prefilled is true, to ensure all fields get populated
      const updates = {};
      let needsUpdate = false;

      // For email field: check delivery address first, then user account
      if (field.config?.fields?.includes('email')) {
        const currentEmail = normalizedValue?.email;
        if (!currentEmail || (typeof currentEmail === 'string' && currentEmail.trim() === '')) {
          // Try delivery address first
          if (hasDeliveryAddress && addressData.email) {
            updates.email = addressData.email;
          } else if (user.email) {
            // Fall back to user email if delivery address doesn't have it
            updates.email = user.email;
          }
          if (updates.email) {
            needsUpdate = true;
          }
        }
      }

      // For contact field: check delivery address first, then user account
      if (field.config?.fields?.includes('contact')) {
        const currentContact = normalizedValue?.contact;
        if (!currentContact || (typeof currentContact === 'string' && currentContact.trim() === '')) {
          // Try delivery address first
          if (hasDeliveryAddress && addressData.contact && typeof addressData.contact === 'string' && addressData.contact.trim()) {
            updates.contact = addressData.contact;
          } else if (user.contact && typeof user.contact === 'string' && user.contact.trim()) {
            // Fall back to user contact if delivery address doesn't have it
            updates.contact = user.contact;
          }
          if (updates.contact) {
            needsUpdate = true;
          }
        }
      }

      // For name field: prioritize user.name if exists, then delivery address, then extract from email
      if (field.config?.fields?.includes('name')) {
        const currentName = normalizedValue?.name;
        if (!currentName || (typeof currentName === 'string' && currentName.trim() === '')) {
          // Prioritize user.name first
          if (user.name && typeof user.name === 'string' && user.name.trim()) {
            updates.name = user.name;
            needsUpdate = true;
          } else if (hasDeliveryAddress && addressData.name && typeof addressData.name === 'string' && addressData.name.trim()) {
            // Then try delivery address
            updates.name = addressData.name;
            needsUpdate = true;
          } else if (user.email) {
            // Finally extract username from email (part before @)
            updates.name = user.email.split('@')[0];
            needsUpdate = true;
          }
        }
      }

      // For address fields: check delivery address
      if (field.config?.fields?.includes('address')) {
        if (!normalizedValue?.address || (typeof normalizedValue.address === 'string' && normalizedValue.address.trim() === '')) {
          if (hasDeliveryAddress && addressData.address) {
            updates.address = addressData.address;
            needsUpdate = true;
          }
        }
        if (!normalizedValue?.postal || (typeof normalizedValue.postal === 'string' && normalizedValue.postal.trim() === '')) {
          if (hasDeliveryAddress && addressData.postal) {
            updates.postal = addressData.postal;
            needsUpdate = true;
          }
        }
        if (!normalizedValue?.state || (typeof normalizedValue.state === 'string' && normalizedValue.state.trim() === '')) {
          if (hasDeliveryAddress && addressData.state) {
            updates.state = addressData.state;
            needsUpdate = true;
          }
        }
      }

      if (needsUpdate) {
        onChange({
          name,
          value: {
            ...normalizedValue,
            ...updates,
          },
        });
        if (!prefilled) {
          setPrefilled(true);
        }
      }
    }
  }, [user, prefilled, normalizedValue, name, onChange, field.config?.fields]);

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
