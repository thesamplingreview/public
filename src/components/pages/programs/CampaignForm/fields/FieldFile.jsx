'use client';

import { useRef, useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useFetch } from '@/hooks/fetcher';
import CButton from '@/components/CButton.jsx';
import CIcon from '@/components/CIcon.jsx';
import CLoader from '@/components/CLoader.jsx';
import { useContextState } from '../hooks';
import HintText from '../comps/HintText.jsx';
import FieldAction from '../comps/FieldAction.jsx';

export default function FieldFile({
  field,
  name,
  value,
  onChange,
  onPrev,
  onNext,
}) {
  const doFetch = useFetch();
  const [theme] = useContextState(['theme']);
  const $file = useRef(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDrag, setIsDrag] = useState(false);

  const config = useMemo(() => {
    let allowsText = '';
    let accept = '*';
    let extensions = [];
    let maxSize = '';
    let maxSizeText = '';

    // accept file type
    const allows = field.config?.accept;
    if (allows === 'image') {
      allowsText = 'JPG and PNG';
      accept = 'image/jpeg, image/png';
      extensions = ['jpg', 'png', 'jpeg'];
    } else if (allows === 'pdf') {
      allowsText = 'PDF';
      accept = 'application/pdf';
      extensions = ['pdf'];
    }

    // file size
    if (field.config?.max_size) {
      maxSize = field.config.max_size * 1024 * 1024;
      maxSizeText = `${field.config.max_size}Mb`;
    }

    return {
      accept,
      allowsText,
      extensions,
      maxSize,
      maxSizeText,
    };
  }, [field.config]);

  const isNextable = useMemo(() => {
    if (field.mandatory) {
      return Boolean(value);
    }
    return true;
  }, [field.mandatory, value]);

  const validate = (file) => {
    // extension check
    const ext = file.name.split('.').pop().toLowerCase();
    if (!config.extensions.includes(ext)) {
      return new Error(`Only allows ${config.allowsText}`);
    }
    // file size check
    if (file.size > config.maxSize) {
      return new Error(`File size is over ${config.maxSizeText}`);
    }
    return false;
  };

  const doUpload = async (file) => {
    setLoading(true);
    setError(null);
    try {
      const formdata = new FormData();
      formdata.append('file', file);
      formdata.append('tags', 'enrolments');

      const { data } = await doFetch('/v1/utils/upload-asset', {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        data: formdata,
      });
      if (!data.url) {
        throw new Error('Unable to upload.');
      }

      // trigger change
      onChange({
        name,
        value: data.url,
      });
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  };

  const handleUpload = (file) => {
    // validation
    const hasErr = validate(file);
    if (hasErr) {
      setError(hasErr);
      return;
    }
    // perform upload
    doUpload(file);
  };

  const handleClick = () => {
    $file.current.click();
  };

  const handleBrowse = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDrag(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDrag(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDrag(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  return (
    <>
      <Box width="40rem" maxWidth="100%" mx="auto" mb={6}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          bgcolor={theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.8)'}
          borderRadius="1rem"
          border="2px dashed"
          borderColor={theme === 'dark' ? '#333333' : '#e0e2fa'}
          p={4}
          sx={[
            {
              '& input[type=file]': {
                position: 'absolute',
                left: -9999,
                opacity: 0,
              },
            },
            isDrag && {
              borderColor: 'primary.main',
            },
          ]}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={$file}
            type="file"
            accept={config.accept}
            onChange={handleBrowse}
          />

          {/* loading */}
          {loading && (
            <Box my={3}>
              <CLoader />
              <Typography fontSize="0.75rem" color="text.light">
                Uploading...
              </Typography>
            </Box>
          )}
          {/* placeholder */}
          {!loading && !value && (
            <Box my={3} color="text.light">
              <CIcon name="image" size="3rem" />
            </Box>
          )}
          {/* preview */}
          {!loading && value && (
            <Box mb={3} mx="15%">
              <img
                src={value}
                alt="preview"
                width="350"
                height="350"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '350px',
                  objectFit: 'contain',
                }}
              />
            </Box>
          )}

          {error && (
            <Box my={1}>
              <Typography variant="body2" color="error">
                {error.message}
              </Typography>
            </Box>
          )}

          <Box my={1}>
            <CButton
              variant="contained"
              color="secondary"
              size="small"
              disabled={loading}
              onClick={handleClick}
            >
              Browse
            </CButton>
          </Box>
          {config.maxSize && (
            <Box my={0.5}>
              <Typography variant="body2" color="text.light">
                Maximum file size: {config.maxSizeText}
              </Typography>
            </Box>
          )}
          {config.allowsText && (
            <Box my={0.5}>
              <Typography variant="body2" color="text.light">
                Accept file: {config.allowsText}
              </Typography>
            </Box>
          )}
        </Box>

        {field.hint && (
          <HintText
            text={field.hint}
            textAlign="center"
            mt={2}
          />
        )}
      </Box>
      <FieldAction
        disabled={!isNextable || loading}
        onPrev={onPrev}
        onNext={onNext}
      />
    </>
  );
}
