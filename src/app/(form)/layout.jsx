import IconPreloader from '@/components/layouts/IconPreloader.jsx';

export default function Layout({ children }) {
  return (
    <>
      {children}
      <IconPreloader />
    </>
  );
}
