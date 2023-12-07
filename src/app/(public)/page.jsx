// import { cookies } from 'next/headers';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useServerFetch } from '@/hooks/auth-server';
import CampaignList from '@/components/pages/home/CampaignList.jsx';

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
    <Box>
      <Container maxWidth="xl">
        <Typography variant="h1">Home page</Typography>

        <CampaignList dataset={result.data} meta={result.meta} />
      </Container>
    </Box>
  );
}
