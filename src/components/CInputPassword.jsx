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
      endAdornment={(
        <InputAdornment position="end">
          <IconButton
            edge="end"
            tabIndex={-1}
            onClick={() => setShow((state) => !state)}
          >
            {show ? <IcVisibilityOff /> : <IcVisibility />}
          </IconButton>
        </InputAdornment>
      )}
    />
  );
}
