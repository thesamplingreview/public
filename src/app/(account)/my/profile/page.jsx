import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import SideNav from '@/components/pages/account/SideNav.jsx';
import ProfileForm from '@/components/pages/account/ProfileForm.jsx';

export default function MyProfile() {
  return (
    <>
      <Typography variant="h1" mb={4}>
        Edit Profile
      </Typography>
      <Grid container spacing={5}>
        <Grid xs={12} md={9}>
          <ProfileForm />
        </Grid>
        <Grid xs={12} md={3} order={{ md: -1 }}>
          <SideNav current="profile" />
        </Grid>
      </Grid>
    </>
  );
}
