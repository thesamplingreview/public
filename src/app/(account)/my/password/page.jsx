import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import SideNav from '@/components/pages/account/SideNav.jsx';
import PasswordForm from '@/components/pages/account/PasswordForm.jsx';

export default function MyAccount() {
  return (
    <>
      <Typography variant="h1" mb={4}>
        Change Password
      </Typography>
      <Grid container spacing={5}>
        <Grid xs={12} md={9}>
          <PasswordForm />
        </Grid>
        <Grid xs={12} md={3} order={{ md: -1 }}>
          <SideNav current="password" />
        </Grid>
      </Grid>
    </>
  );
}
