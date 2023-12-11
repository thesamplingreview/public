import CButton from '@/components/CButton.jsx';
import CLoader from '@/components/CLoader.jsx';

export default function CLoadingButton({
  loading,
  children,
  ...props
}) {
  return (
    <CButton
      {...props}
      startIcon={loading ? <CLoader p={0} size="1em" /> : props.startIcon}
      disabled={loading || props.disabled}
    >
      {children}
    </CButton>
  );
}
