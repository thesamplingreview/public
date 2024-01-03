import Grid from '@mui/material/Unstable_Grid2';
import PageTitle from '@/components/pages/account/PageTitle.jsx';
import SideNav from '@/components/pages/account/SideNav.jsx';
import ProfileForm from '@/components/pages/account/ProfileForm.jsx';

export default function MyProfile() {
  return (
    <Grid container spacing={{ xs: 3, md: 5 }}>
      <Grid xs={12} md={4} lg={9}>
        <SideNav current="profile" />
      </Grid>
      <Grid xs={12} md={8} lg={3}>
        <PageTitle icon="account" title="Edit Profile" mb={3} />
        <ProfileForm />
      </Grid>
    </Grid>
  );
}
