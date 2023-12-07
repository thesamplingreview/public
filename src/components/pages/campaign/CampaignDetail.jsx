'use client';

import Box from '@mui/material/Box';

export default function CampaignDetail({ data }) {
  // console.log(data);

  return (
    <Box>
      Detail page: {data.name}
    </Box>
  );
}
