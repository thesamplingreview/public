'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useFetch } from '@/hooks/fetcher';
import CButton from '@/components/CButton.jsx';
import CLoadingButton from '@/components/CLoadingButton.jsx';
import CInput from '@/components/CInput.jsx';
import CInputRating from '@/components/CInputRating.jsx';
// pinjam
import EditorContent from '@/components/pages/programs/CampaignForm/comps/EditorContent.jsx';

export default function DialogReviewProgram({
  open,
  data,
  onClose,
}) {
  const handleClose = () => {
    onClose();
  };

  const handleCompleted = () => {
    onClose(true);
  };

  return (
    <Dialog
      open={open}
      fullWidth
      scroll="body"
      maxWidth="sm"
      onClose={handleClose}
    >
      <DialogTitle>
        Submit your review
      </DialogTitle>
      {data.review_type === 'redirect' && (
        <ContentRedirect
          data={data}
          onClose={handleClose}
        />
      )}
      {data.review_type === 'form' && (
        <ContentReviewForm
          data={data}
          onClose={handleClose}
          onComplete={handleCompleted}
        />
      )}
    </Dialog>
  );
}

function ContentRedirect({ data, onClose }) {
  return (
    <>
      <DialogContent>
        <EditorContent content={data.review_instruction} mb={3} />
      </DialogContent>
      <DialogActions>
        <CButton color="text" sx={{ color: 'text.light' }} onClick={onClose}>
          Close
        </CButton>
        {data.review_cta && (
          <CButton
            component="a"
            href={data.review_cta}
            target="_blank"
          >
            Open Link
          </CButton>
        )}
      </DialogActions>
    </>
  );
}

function ContentReviewForm({ data, onClose, onComplete }) {
  const doFetch = useFetch();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [input, setInput] = useState({
    rating: '',
    review: '',
  });

  const doSubmit = async () => {
    setSaving(true);
    setError(null);
    try {
      const result = await doFetch(`/v1/app/campaigns/${data.slug}/review`, {
        method: 'POST',
        data: { ...input },
      });
      if (result.code !== 200) {
        throw new Error('Failed to submit review.');
      }
      // callback
      onComplete(result.data);
    } catch (err) {
      if (err.response?.data?.code === 422) {
        setError(new Error(err.response.data.validator?.[0]?.msg || err.response.data.error));
      } else {
        setError(err);
      }
    }
    setSaving(false);
  };

  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    // validation
    let errMsg = '';
    if (!input.rating) {
      errMsg = 'Please select your rating.';
    }
    if (errMsg) {
      setError(new Error(errMsg));
      return;
    }

    // save
    doSubmit();
  };

  return (
    <DialogContent>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message}
        </Alert>
      )}
      <Box>
        <Typography
          component="div"
          fontSize="0.75em"
          fontWeight="300"
          mb={0.75}
          ml={1}
        >
          Rating *
        </Typography>
        <CInputRating
          name="rating"
          value={input.rating}
          onChange={handleChange}
        />
      </Box>
      <Box mt={2}>
        <Typography
          component="div"
          fontSize="0.75em"
          fontWeight="300"
          mb={0.75}
          ml={1}
        >
          Review
        </Typography>
        <CInput
          multiline
          minRows={3}
          maxRows={6}
          placeholder="Write your review"
          name="review"
          value={input.review}
          onChange={handleChange}
        />
      </Box>
      <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
        <CButton color="text" sx={{ color: 'text.light' }} onClick={onClose}>
          Cancel
        </CButton>
        <CLoadingButton
          variant="contained"
          loading={saving}
          onClick={handleSubmit}
        >
          Submit
        </CLoadingButton>
      </Box>
    </DialogContent>
  );
}
