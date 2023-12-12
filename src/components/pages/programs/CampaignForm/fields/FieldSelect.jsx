'use client';

import Box from '@mui/material/Box';
import CButton from '@/components/CButton.jsx';

export default function FieldSelect({
  field, name, value, onChange,
}) {
  const handleSelect = (opt) => {
    onChange({
      target: {
        name,
        value: opt.id,
      },
    });
  };

  return (
    <Box
      display="flex"
      flexWrap="wrap"
      justifyContent="center"
      alignItems="center"
      gap={3}
    >
      {field.options.map((opt) => (
        <CButton
          key={opt.id}
          variant="outlined"
          color="text"
          size="small"
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
                opt.id === value && ((theme) => ({
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
              transition: 'all .3s',
              '&:hover': {
                transform: 'translateY(-2px)',
              },
            },
            opt.id === value && ((theme) => ({
              color: theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
              outline: `1px solid ${theme.palette.primary.main}`,
              '&:hover': {
                borderColor: theme.palette.primary.main,
              },
            })),
          ]}
          onClick={() => handleSelect(opt)}
        >
          {opt.name}
        </CButton>
      ))}
    </Box>
  );
}
