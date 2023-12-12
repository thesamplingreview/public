import { styled } from '@mui/material/styles';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';

// eslint-disable-next-line no-unused-vars
export const CInputBase = styled(Input)(({ theme }) => ({
  fontSize: '1em',
  fontWeight: '500',
  borderRadius: '4em',
  border: '1px solid transparent',
  backgroundColor: 'rgba(0,0,0,.06)',
  transition: 'border .3s, background .3s, outline .3s',
  '&:hover': {
    borderColor: 'rgba(0,0,0,.4)',
  },
  '&.Mui-focused': {
    borderColor: 'rgba(0,0,0,.4)',
    outline: '1px solid rgba(0,0,0,.4)',
  },
  '& input': {
    padding: '.875em 1.5em',
    '&::placeholder': {
      fontWeight: '300',
    },
  },
  '& .MuiInputAdornment-positionEnd': {
    marginRight: '1em',
  },
}));

export const CInputControl = ({
  label = '',
  required,
  size,
  error,
  helperText,
  children,
  ...props
}) => {
  return (
    <FormControl
      {...props}
      fullWidth
      size={size}
      required={required}
      error={error}
    >
      {label && (
        <InputLabel
          sx={{
            lineHeight: 1,
            left: '.5em',
            '&.Mui-focused': {
              color: 'rgba(0,0,0,.6)',
            },
            '&.MuiInputLabel-shrink': {
              transform: 'translate(14px, -6px) scale(0.75)',
            },
            '& + .MuiInputBase-root': {
              mt: 0,
            },
          }}
        >
          {label}
        </InputLabel>
      )}
      {children}
      {(error || helperText) && (
        <FormHelperText>{error || helperText}</FormHelperText>
      )}
    </FormControl>
  );
};

export default function CInput({
  label,
  size,
  required,
  error,
  helperText,
  controlProps,
  ...props
}) {
  return (
    <CInputControl
      {...controlProps}
      label={label}
      size={size}
      required={required}
      error={error}
      helperText={helperText}
    >
      <CInputBase
        {...props}
        disableUnderline
      />
    </CInputControl>
  );
}
