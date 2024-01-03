import Link from 'next/link';
import { format } from 'date-fns';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import config from '@/config/app';
import CButton from '@/components/CButton.jsx';
import CIcon from '@/components/CIcon.jsx';

export default function CampaignCardHorizontal({ data }) {
  return (
    <Box
      display="flex"
      flexDirection={{ xs: 'column', sm: 'row' }}
      position="relative"
      bgcolor="#fff"
      height="100%"
      borderRadius="1rem"
      overflow="hidden"
      sx={{
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        transition: 'box-shadow .3s, transform .3s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '3px 6px 9px rgba(0,0,0,0.2)',
        },
      }}
    >
      <Box
        component="header"
        position="relative"
        bgcolor="background.main"
        width={{ xs: '100%', sm: '200px' }}
        height={{ xs: '240px', sm: '100%' }}
        flex="0 0 auto"
      >
        <Box
          component="img"
          src={data.cover_url || '/images/placeholder.svg'}
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          sx={{ objectFit: 'cover' }}
        />
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        flexGrow="1"
        px={4}
        py={3}
      >
        <Typography variant="h6" fontWeight="500">
          {data.name}
        </Typography>
        <Box display="flex" alignItems="center" color="text.light" fontSize="0.75em">
          <CIcon name="calendar" />
          {data.state === 'past' && (
            <Box component="span" ml={1}>
              program ended
            </Box>
          )}
          {data.state === 'current' && (
            <Box component="span" ml={1}>
              end at {format(new Date(data.end_date), config.formatDateTime)}
            </Box>
          )}
          {data.state === 'coming' && (
            <Box component="span" ml={1}>
              start at {format(new Date(data.start_date), config.formatDateTime)}
            </Box>
          )}
        </Box>
        <Typography variant="body2" component="div" flexGrow="1" mt={1}>
          {data.description}
        </Typography>
        <Box mt={3}>
          {(!data.enrolments || data.enrolments.length === 0) && (
            <CButton
              component={Link}
              href={`/programs/${data.slug}`}
              variant="contained"
              size="small"
            >
              Enroll Now
            </CButton>
          )}
          {data.enrolments?.length > 0 && (
            <CButton
              component={Link}
              href={`/programs/${data.slug}`}
              variant="outlined"
              size="small"
            >
              You have enrolled
            </CButton>
          )}
        </Box>
      </Box>
    </Box>
  );
}
