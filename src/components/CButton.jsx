import Button from '@mui/material/Button';

export default function CButton({ rounded, children, ...props }) {
  return (
    <Button
      {...props}
      sx={[
        props.sx,
        rounded && {
          borderRadius: '3rem',
        },
      ]}
    >
      {children}
    </Button>
  );
}
