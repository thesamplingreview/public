import { useServerFetch } from '@/hooks/auth-server';
import SecHero from '@/components/pages/home/SecHero.jsx';
import SecCampaigns from '@/components/pages/home/SecCampaigns.jsx';

// this not working as expected (hence using force load pattern)
// export const dynamic = 'force-dynamic';
// export const revalidate = 0;

async function useServerData() {
  const fetcher = await useServerFetch();
  const result = await fetcher('/v1/app/campaigns');

  return result.data;
}

export default async function Home() {
  const result = await useServerData();

  return (
    <>
      <SecHero />
      <SecCampaigns dataset={result.data} meta={result.meta} />
    </>
  );
}
