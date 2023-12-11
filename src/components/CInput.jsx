import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

// eslint-disable-next-line no-unused-vars
const CInputStyled = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    fontSize: '1em',
    fontWeight: '500',
    borderRadius: '4em',
    border: 'none',
    backgroundColor: 'rgba(0,0,0,.06)',
    '& input': {
      padding: '.875em 1.5em',
      '&::placeholder': {
        fontWeight: '300',
      },
    },
    '& fieldset': {
      borderColor: 'rgba(0,0,0,.06)',
    },
  },
  '& .MuiFormLabel-root': {
    left: '.5rem',
  },
}));

export default function CInput({ error, ...props }) {
  return (
    <CInputStyled
      {...props}
      fullWidth
      error={Boolean(error)}
      helperText={error || props.helperText}
    />
  );
}
