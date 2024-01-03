import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CIcon from '@/components/CIcon.jsx';

export default function PageTitle({ icon, title, ...props }) {
  return (
    <Box {...props} display="flex" alignItems="center">
      {icon && (
        <Box display="inline-flex" fontSize={{ xs: '2rem', md: '2.75rem' }} mx={2}>
          <CIcon name={icon} size="1em" />
        </Box>
      )}
      <Typography
        variant="h1"
        fontSize={{ xs: '1.5rem', md: '2rem' }}
      >
        {title}
      </Typography>
    </Box>
  );
}
