'use client';

import { useState } from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useOnce } from '@/hooks/ui';
import { useFetch } from '@/hooks/fetcher';

export default function SecCampaigns({
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
      <Container maxWidth="xl">
        {dataset.map((item) => (
          <Box key={item.id}>
            <Link href={`/programs/${item.slug}`}>
              {item.name} ({item.enrolments ? 'true' : 'false'})
            </Link>
          </Box>
        ))}
      </Container>
    </Box>
  );
}
