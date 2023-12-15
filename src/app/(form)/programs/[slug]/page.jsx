import { cache } from 'react';
import { notFound } from 'next/navigation';
import { useServerFetch } from '@/hooks/auth-server';
import CampaignForm from '@/components/pages/programs/CampaignForm';

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

export default async function Program({ params }) {
  const result = await useServerData(params.slug);
  if (!result) {
    notFound();
  }

  return <CampaignForm slug={params.slug} data={result} />;
}
