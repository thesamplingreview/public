import Button from '@mui/material/Button';

export default function CButton({
  rounded = true,
  children,
  ...props
}) {
  return (
    <Button
      {...props}
      sx={[
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
        rounded && {
          borderRadius: '3rem',
        },
      ]}
    >
      {children}
    </Button>
  );
}
