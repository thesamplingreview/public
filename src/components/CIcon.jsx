import Box from '@mui/material/Box';

export default function CIcon({
  name,
  size = '1em',
  ...props
}) {
  return (
    <Box
      {...props}
      component="svg"
      display="inline-block"
      sx={{
        fill: 'currentColor',
        lineHeight: 1,
        width: size,
        height: size,
        ...props.sx,
      }}
    >
      <use xlinkHref={`#ic_${name}`} />
    </Box>
  );
}
