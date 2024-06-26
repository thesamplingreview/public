import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CIcon from './CIcon.jsx';

export default function CInputRating({
  name,
  value,
  maxRate = 5,
  onChange,
}) {
  const handleChange = (newValue) => {
    onChange({
      target: {
        name,
        value: newValue,
      },
    });
  };

  const content = [];
  for (let i = 1; i <= maxRate; i += 1) {
    content.push((
      <IconButton key={i} onClick={() => handleChange(i)}>
        <CIcon
          name="star"
          color={value >= i ? '#FFC107' : '#828ea2'}
        />
      </IconButton>
    ));
  }

  return (
    <Box display="flex" flexWrap="wrap">
      {content}
    </Box>
  );
}
