import Box from '@mui/material/Box';

export default function EditorContent({ content, ...props }) {
  return (
    <Box
      width="100%"
      lineHeight="1.75"
      {...props}
      sx={{
        opacity: 0.75,
        '& .content': {
          '& > *': {
            mt: 0,
            mb: 2,
          },
          '& ul, & ol': {
            textAlign: 'left',
          },
          '& li': {
            pl: 2,
            mb: 0.75,
          },
        },
      }}
    >
      <div className="content" dangerouslySetInnerHTML={{ __html: content }} />
    </Box>
  );
}
