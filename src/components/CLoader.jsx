import { useMemo } from 'react';
import Box from '@mui/material/Box';

export default function CLoader({
  size = '2em',
  color = '#97a4ba',
  full = false,
  fullOffset = '0px',
  ...props
}) {
  // calculate full props
  const fullProp = useMemo(() => {
    if (!full) {
      return {};
    }
    if (full === 'header') {
      return { minHeight: `calc(100vh - 3.75rem - ${fullOffset})` };
    }
    return { minHeight: `calc(100vh - ${fullOffset})` };
  }, [full, fullOffset]);

  return (
    <Box
      display='flex'
      alignItems='center'
      justifyContent='center'
      p={3}
      sx={fullProp}
      {...props}
    >
      <Box className='text-center'>
        <Box
          display='block'
          sx={{
            width: size,
            height: size,
            '&:before': {
              content: '""',
              display: 'block',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              borderTop: `2px solid ${color}`,
              borderRight: '2px solid transparent',
              borderLeft: '2px solid transparent',
              animation: 'spin 0.7s linear infinite',
            },
          }}
        />
      </Box>
    </Box>
  );
}
