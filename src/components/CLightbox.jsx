import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';

export default function CLightbox({
  src = '',
  onClose,
  ...props
}) {
  return (
    <Dialog
      open={!!src}
      scroll="body"
      maxWidth="xl"
      {...props}
      onClose={onClose}
    >
      <Box
        component="img"
        src={src}
        alt=""
        width="1000"
        height="600"
        sx={{
          width: '100%',
          height: 'auto',
        }}
      />
    </Dialog>
  );
}
