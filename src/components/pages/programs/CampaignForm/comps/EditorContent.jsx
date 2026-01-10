import { useMemo } from 'react';
import Box from '@mui/material/Box';

export default function EditorContent({ content, ...props }) {
  const processedContent = useMemo(() => {
    if (!content) return content;
    
    // Process HTML to add target="_blank" to links containing "Demo Video"
    return content.replace(
      /<a\s+([^>]*?)>([^<]*?Demo Video[^<]*?)<\/a>/gi,
      (match, attrs, linkText) => {
        // Check if target="_blank" already exists
        if (attrs.includes('target=')) {
          return match.replace(/target="[^"]*"/gi, 'target="_blank"');
        }
        // Add target="_blank" and rel="noopener noreferrer"
        return `<a ${attrs} target="_blank" rel="noopener noreferrer">${linkText}</a>`;
      }
    );
  }, [content]);

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
      <div className="content" dangerouslySetInnerHTML={{ __html: processedContent }} />
    </Box>
  );
}
