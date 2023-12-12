import CButton from '@/components/CButton.jsx';
import CIcon from '@/components/CIcon.jsx';

export default function FButton({ text, ...props }) {
  return (
    <CButton
      {...props}
      variant="contained"
      color="primary"
      endIcon={<CIcon name="arrow-right" />}
      sx={{
        px: 3,
        '& svg': {
          transition: 'transform .3s',
        },
        '&:hover svg': {
          transform: 'translateX(3px)',
        },
      }}
    >
      {text}
    </CButton>
  );
}
