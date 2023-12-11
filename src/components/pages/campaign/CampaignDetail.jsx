'use client';

import { useMemo, useEffect } from 'react';
import Box from '@mui/material/Box';

export default function CampaignDetail({ data }) {
  const formLayout = useMemo(() => {
    return data.form.fields.map((field) => {
      if (field.type === 'product') {
        return {
          ...field,
          options: data.products || [],
        };
      }
      return field;
    });
  }, [data]);

  useEffect(() => {
    console.log(formLayout);
  }, [formLayout]);

  return (
    <Box>
      Detail page: {data.name}
    </Box>
  );
}
