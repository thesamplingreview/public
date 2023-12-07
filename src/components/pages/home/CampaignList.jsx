'use client';

import { useState } from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import { useOnce } from '@/hooks/ui';
import { useFetch } from '@/hooks/fetcher';

export default function CampaignList({
  dataset: serverDataset,
  meta: serverMeta,
}) {
  const doFetch = useFetch();
  const [dataset, setDataset] = useState(serverDataset || []);
  const [meta, setMeta] = useState(serverMeta || {});

  // overwrite server cache
  useOnce(async () => {
    const result = await doFetch('/v1/app/campaigns');
    setDataset(result.data || []);
    setMeta(result.meta || {});
  });

  return (
    <Box>
      {dataset.map((item) => (
        <Box key={item.id}>
          <Link href={`/campaign/${item.slug}`}>
            {item.name} ({item.enrolments ? 'true' : 'false'})
          </Link>
        </Box>
      ))}
    </Box>
  );
}
