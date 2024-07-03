'use client';

import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useFetch } from '@/hooks/fetcher';
import CIcon from '@/components/CIcon.jsx';
import CButton from '@/components/CButton.jsx';
import CLoadingButton from '@/components/CLoadingButton.jsx';
import CInput from '@/components/CInput.jsx';
import CInputRating from '@/components/CInputRating.jsx';
import CInputUpload from '@/components/CInputUpload.jsx';
import CLightbox from '@/components/CLightbox.jsx';
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

function generateDefaultInput(review) {
  return {
    rating: review?.rating || '',
    review: review?.review || '',
    uploads: review?.uploads?.map((d) => ({
      id: d.id,
      url: d.url,
      asset_id: d.asset_id,
      name: d.name,
      size: d.size,
    })) || [],
  };
}

function ContentReviewForm({ data, onClose, onComplete }) {
  const doFetch = useFetch();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [input, setInput] = useState(generateDefaultInput(data.reviews?.[0]));
  const [uploading, setUploading] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState('');

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

  const handleChangeUploads = useCallback((newVal) => {
    setInput((oldState) => ({
      ...oldState,
      uploads: newVal,
    }));
  }, []);

  const handleSubmit = () => {
    // validation
    let errMsg = '';
    if (!input.rating) {
      errMsg = 'Please select your rating.';
    } else if (!input.review.trim()) {
      errMsg = 'Please write your review.';
    }
    if (errMsg) {
      setError(new Error(errMsg));
      return;
    }

    // save
    doSubmit();
  };

  const handleUploadStateChange = (isUploading) => {
    setUploading(isUploading);
  };

  const handleToggleLightbox = (e) => {
    e.preventDefault();
    setLightboxSrc(e.currentTarget.dataset.lightbox || '');
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
          Review *
        </Typography>
        <CInput
          multiline
          minRows={3}
          maxRows={6}
          placeholder="Write your review"
          name="review"
          required
          value={input.review}
          onChange={handleChange}
        />
      </Box>
      {/* @temp - hardcoded for NIVEA campaigns */}
      <Box mt={2}>
        <Box display="flex" alignItems="center" gap={1} mb={0.75}>
          <Typography
            component="div"
            fontSize="0.75em"
            fontWeight="300"
            ml={1}
          >
            Additional Challenge! (Optional)
          </Typography>
          <Box
            component="a"
            href="#"
            lineHeight="1"
            color="var(--color-300)"
            data-lightbox="/images/campaigns/sample-1.jpeg"
            onClick={handleToggleLightbox}
          >
            <CIcon name="info" size="1rem" />
          </Box>
        </Box>
        <Typography
          component="div"
          fontSize="0.875em"
          mx={1}
        >
          Hundreds have left their reviews! Join them now! Shoot a short video (5-10 seconds) sharing your experience with the product and receive an additional Watsons e-voucher code worth RM300. Use these e-vouchers to purchase any NIVEA product on Watsons online by entering the codes during checkout.
        </Typography>
      </Box>
      <Box mt={2}>
        <Typography
          component="div"
          fontSize="0.75em"
          fontWeight="300"
          mb={0.75}
          ml={1}
        >
          Upload
        </Typography>
        <CInputUpload
          value={input.uploads}
          max={1}
          extensions={['jpg', 'jpeg', 'png', 'webp', 'mp4', 'mov', '3gp']}
          maxsize={100}
          onChange={handleChangeUploads}
          onStateChange={handleUploadStateChange}
        />
      </Box>
      <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
        <CButton color="text" sx={{ color: 'text.light' }} onClick={onClose}>
          Cancel
        </CButton>
        <CLoadingButton
          variant="contained"
          disabled={uploading}
          loading={saving}
          onClick={handleSubmit}
        >
          Submit
        </CLoadingButton>
      </Box>

      <CLightbox
        src={lightboxSrc}
        onClose={handleToggleLightbox}
      />
    </DialogContent>
  );
}
