import Typography from '@mui/material/Typography';

export default function HintText({ text, ...props }) {
  return (
    <Typography
      {...props}
      variant="body2"
      component="div"
      fontSize=".875rem"
      color="text.light"
    >
      {text}
    </Typography>
  );
}
