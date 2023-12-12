import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { CInputBase, CInputControl } from '@/components/CInput.jsx';

export default function CSelect({
  options = [],
  label,
  size,
  required,
  error,
  helperText,
  placeholder,
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
      <Select
        {...props}
        label={label}
        input={<CInputBase disableUnderline />}
        sx={{
          '& .MuiSelect-select': {
            py: '.875em',
            pl: '1.5em',
            pr: '2.5em !important',
          },
        }}
      >
        {placeholder && (
          <MenuItem value="">{placeholder}</MenuItem>
        )}
        {options.map((opt) => (
          <MenuItem key={opt.id} value={opt.id}>{opt.name}</MenuItem>
        ))}
      </Select>
    </CInputControl>
  );
}
