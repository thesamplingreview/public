import { useState } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import IcVisibility from '@mui/icons-material/Visibility';
import IcVisibilityOff from '@mui/icons-material/VisibilityOff';
import CInput from './CInput.jsx';

export default function CInputPassword({ error, ...props }) {
  const [show, setShow] = useState(false);

  return (
    <CInput
      {...props}
      type={show ? 'text' : 'password'}
      InputProps={{
        ...props.InputProps,
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setShow((state) => !state)}
              edge="end"
            >
              {show ? <IcVisibilityOff /> : <IcVisibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
