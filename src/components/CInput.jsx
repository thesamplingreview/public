import TextField from '@mui/material/TextField';

export default function CInput({ error, ...props }) {
  return (
    <TextField
      {...props}
      fullWidth
      error={Boolean(error)}
      helperText={error || props.helperText}
    />
  );
}
