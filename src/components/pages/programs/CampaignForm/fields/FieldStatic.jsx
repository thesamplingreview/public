'use client';

import Box from '@mui/material/Box';
import HintText from '../comps/HintText.jsx';
import FieldAction from '../comps/FieldAction.jsx';
import EditorContent from '../comps/EditorContent.jsx';

export default function FieldStatic({
  field,
  onPrev,
  onNext,
}) {
  return (
    <>
      <Box width="32rem" maxWidth="100%" mx="auto" mb={6}>
        {field.config?.content && (
          <Box textAlign="center">
            <EditorContent
              content={field.config.content}
              color="text.light"
            />
          </Box>
        )}
        {field.hint && (
          <HintText text={field.hint} textAlign="center" mt={4} />
        )}
      </Box>
      <FieldAction
        onPrev={onPrev}
        onNext={onNext}
      />
    </>
  );
}
