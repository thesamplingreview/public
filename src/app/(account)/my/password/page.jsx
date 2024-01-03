import Grid from '@mui/material/Unstable_Grid2';
import PageTitle from '@/components/pages/account/PageTitle.jsx';
import SideNav from '@/components/pages/account/SideNav.jsx';
import PasswordForm from '@/components/pages/account/PasswordForm.jsx';

export default function MyAccount() {
  return (
    <Grid container spacing={{ xs: 3, md: 5 }}>
      <Grid xs={12} md={4} lg={3}>
        <SideNav current="password" />
      </Grid>
      <Grid xs={12} md={8} lg={9}>
        <PageTitle icon="lock" title="Change Password" mb={3} />
        <PasswordForm />
      </Grid>
    </Grid>
  );
}
