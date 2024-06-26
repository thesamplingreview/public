import { useRef, useState, useMemo } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CIcon from '@/components/CIcon.jsx';
import { useFetch } from '@/hooks/fetcher';
import { formatBytes } from '@/helpers/utils';
import { useOnce, useUpdated } from '@/hooks/ui';

function genFilenameFromUrl(url) {
  if (url) {
    const segs = url.split('/');
    return segs[segs.length - 1];
  }
  return '';
}

export default function CInputUpload({
  value,
  max = 1,
  extensions = ['jpg', 'jpeg', 'png', 'webp'],
  maxsize = 4,
  onChange,
  onStateChange,
}) {
  const [items, setItems] = useState(value?.map((v) => ({
    key: v.id,
    url: v.url,
    asset_id: v.asset_id,
    name: v.name || genFilenameFromUrl(v.url),
    size: v.size || '',
  })) || []);
  const [globalError, setGlobalError] = useState('');

  const handleItemAdd = (newFiles) => {
    if ((newFiles.length + items.length) > max) {
      setGlobalError(`Maximum upload ${max} items.`);
      return;
    }

    const newItems = newFiles.map((file, index) => ({
      key: `${(new Date()).valueOf()}_${index}`,
      name: file.name,
      size: file.size,
      url: '',
      asset_id: '',
      file,
    }));
    setItems((oldState) => ([
      ...oldState,
      ...newItems,
    ]));
    setGlobalError('');
  };

  const handleItemRemove = (data) => {
    setItems((oldState) => oldState.filter((d) => d.key !== data.key));
    setGlobalError('');
  };

  const handleItemUpdated = (data) => {
    setItems((oldState) => oldState.map((d) => (d.key === data.key ? data : d)));
  };

  useUpdated(() => {
    const newValue = items.filter((d) => d.url && d.asset_id);
    onStateChange(newValue.length !== items.length);
    onChange(newValue);
  }, [items]);

  return (
    <Box>
      <DropZone
        maxsize={maxsize}
        extensions={extensions}
        error={globalError}
        onAddFiles={handleItemAdd}
      />
      {items.map((d) => (
        <UploadItem
          key={d.key}
          data={d}
          maxsize={maxsize}
          extensions={extensions}
          onRemove={handleItemRemove}
          onUpdate={handleItemUpdated}
        />
      ))}
    </Box>
  );
}

const DropZone = ({
  maxsize,
  extensions,
  error,
  onAddFiles,
}) => {
  const $file = useRef();

  const [isDrag, setIsDrag] = useState(false);

  const handleBrowse = () => {
    $file.current.click();
  };

  const handleChange = (e) => {
    onAddFiles(Array.from(e.target.files));
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
    onAddFiles(Array.from(e.dataTransfer.files));
  };

  return (
    <Box position="relative" overflow="hidden">
      <input
        ref={$file}
        type="file"
        accept={extensions.map((v) => `.${v}`).join(',')}
        style={{
          position: 'absolute',
          top: 0,
          left: '-100vw',
          opacity: 1,
        }}
        onChange={handleChange}
      />
      <Box
        display="flex"
        gap={1}
        flexDirection="column"
        textAlign="center"
        border="2px dashed var(--border-500)"
        borderRadius="1rem"
        p={3}
        className="clickable"
        sx={[
          {
            transition: 'border .3s',
            '&:hover': {
              borderColor: 'rgba(0,0,0,.4)',
            },
          },
          isDrag && {
            borderColor: 'primary.main',
          },
        ]}
        onClick={handleBrowse}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Typography variant="body2">
          Drop file here or&nbsp;
          <Typography component="span" variant="inherit" color="primary">
            Click to Browse
          </Typography>
        </Typography>
        <Typography variant="body2" fontSize="0.75em" color="var(--color-300)">
          Maximum file size: {maxsize} MB
        </Typography>
        {error && (
          <Typography
            variant="body2"
            color="error"
            sx={{ fontSize: '0.75em' }}
          >
            {error}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

const UploadItem = ({
  data,
  extensions,
  maxsize,
  onRemove,
  onUpdate,
}) => {
  const doFetch = useFetch();

  const [error, setError] = useState('');
  const [uploadState, setUploadState] = useState('');
  const [percentage, setPercentage] = useState(0);

  const filesize = useMemo(() => {
    if (data.size) {
      return formatBytes(data.size);
    }
    return '';
  }, [data.size]);
  const unremoveable = useMemo(() => {
    return ['uploading', 'preparing'].includes(uploadState);
  }, [uploadState]);

  const doUpload = async (file) => {
    try {
      // generate presigned url
      setUploadState('preparing');
      const formData = {
        filename: file.name,
        filesize: file.size,
        mimetype: file.type,
      };
      const result = await doFetch('v1/utils/upload-s3-presigned-url', {
        method: 'POST',
        data: formData,
      });
      const { presigned_url, asset } = result.data;
      if (!presigned_url) {
        throw new Error('Server error');
      }
      // uploading
      setUploadState('uploading');
      setPercentage(0);
      const resultS3 = await axios.put(
        result.data.presigned_url,
        file,
        {
          headers: {
            'Content-Type': 'application/octet-stream',
          },
          onUploadProgress(e) {
            setPercentage(Math.round((e.loaded / file.size) * 100));
          },
        },
      );
      if (resultS3.status !== 200) {
        throw new Error('S3 error');
      }
      onUpdate({
        key: data.key,
        name: file.name,
        size: file.size,
        url: asset.url,
        asset_id: asset.id,
      });
      setUploadState('uploaded');
    } catch (err) {
      setUploadState('error');
      setError(err.message);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const doDeletion = async () => {
    if (!data.asset_id) {
      return;
    }
    try {
      // generate presigned url
      setUploadState('deleting');
      await doFetch(`v1/utils/asset/${data.asset_id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      // non-blocking
      // ...
    }
  };

  const handleRemove = async () => {
    // better UX
    if (!data.url) {
      onRemove(data);
      return;
    }

    // eslint-disable-next-line no-alert
    if (!window.confirm('Are you sure want to remove?')) {
      return;
    }
    // server remove (tbc) - disabled
    // await doDeletion();
    onRemove(data);
  };

  useOnce(() => {
    if (data.url) {
      setUploadState('uploaded');
    } else if (data.file) {
      let hasError = '';
      // extension check
      const ext = data.file.name.split('.').pop().toLowerCase();
      if (!extensions.includes(ext)) {
        hasError = 'Invalid format!';
      } else if (data.file.size > maxsize * 1024 * 1024) {
        // file size check
        hasError = 'File to large!';
      }
      if (hasError) {
        setUploadState('error');
        setError(hasError);
        return;
      }

      // uploading
      doUpload(data.file);
    }
  });

  return (
    <Box
      bgcolor="#f5f6ff"
      borderRadius="1rem"
      fontSize="0.875rem"
      px={3}
      py={2}
      mt={1}
    >
      <Grid container spacing={3}>
        <Grid xs>
          <Typography variant="inherit" className="truncate">
            {data.name}
          </Typography>
        </Grid>
        <Grid xs="auto">
          <Typography variant="inherit" className="truncate">
            {filesize}
          </Typography>
        </Grid>
        <Grid xs={4}>
          {uploadState === 'error' && (
            <Typography
              variant="inherit"
              className="truncate"
              color="error"
              title={error}
            >
              {error || 'Error'}
            </Typography>
          )}
          {uploadState === 'preparing' && (
            <Typography variant="inherit" className="truncate">
              Preparing...
            </Typography>
          )}
          {uploadState === 'deleting' && (
            <Typography variant="inherit" className="truncate">
              Deleting...
            </Typography>
          )}
          {uploadState === 'uploading' && (
            <Box
              bgcolor="var(--main-500)"
              height="100%"
              width={`${percentage}%`}
              sx={{
                transition: 'width .15s',
              }}
            />
          )}
          {uploadState === 'uploaded' && (
            <Typography
              component="a"
              href={data.url}
              variant="inherit"
              className="truncate"
              color="#2ea782"
              fontWeight="500"
              target="_blank"
              sx={{
                textDecoration: 'none',
              }}
            >
              Uploaded
              <CIcon name="external" size="0.75em" sx={{ ml: 1 }} />
            </Typography>
          )}
        </Grid>
        <Grid xs="auto">
          <IconButton
            disabled={unremoveable}
            sx={{ m: -1 }}
            onClick={handleRemove}
          >
            <CIcon name="times" size="1rem" />
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  );
};
