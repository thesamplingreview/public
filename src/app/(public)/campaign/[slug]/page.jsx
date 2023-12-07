import { cache } from 'react';
import { notFound } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useServerFetch } from '@/hooks/auth-server';
import CampaignDetail from '@/components/pages/campaign/CampaignDetail.jsx';

// manually cache for re-using purpose, as next memorize fetch not working
const fetchDetail = cache(async (slug) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const fetcher = await useServerFetch();
  try {
    const result = await fetcher(`/v1/app/campaigns/${slug}`);
    const { code, data } = result.data;
    if (code !== 200) {
      throw new Error('404');
    }
    return data;
  } catch (err) {
    return null;
  }
});

// generate metadata
export async function generateMetadata({ params }) {
  const data = await fetchDetail(params.slug);
  if (data) {
    return {
      title: data.meta_title || data.name,
      description: data.meta_description || '',
    };
  }
  return null;
}

async function useServerData(slug) {
  const data = await fetchDetail(slug);
  return data;
}

export default async function CampaignPage({ params }) {
  const result = await useServerData(params.slug);
  if (!result) {
    notFound();
  }

  return (
    <Box>
      <Container maxWidth="xl">
        <Typography variant="h1">{params.slug}</Typography>

        <CampaignDetail data={result} />
      </Container>
    </Box>
  );
}
