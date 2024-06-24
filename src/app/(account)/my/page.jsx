import Grid from '@mui/material/Unstable_Grid2';
import PageTitle from '@/components/pages/account/PageTitle.jsx';
import SideNav from '@/components/pages/account/SideNav.jsx';
import ProgramList from '@/components/pages/account/ProgramList.jsx';

export default function MyPrograms() {
  return (
    <Grid container spacing={{ xs: 3, md: 5 }}>
      <Grid xs={12} md={4} lg={3}>
        <SideNav current="campaigns" />
      </Grid>
      <Grid xs={12} md={8} lg={9}>
        <PageTitle icon="form" title="My Programs" mb={3} />
        <ProgramList />
      </Grid>
    </Grid>
  );
}
