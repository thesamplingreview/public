const config = {
  // app
  name: process.env.NEXT_PUBLIC_NAME,
  url: process.env.NEXT_PUBLIC_URL,
  apiUrl: process.env.NEXT_PUBLIC_API,
  debug: process.env.NEXT_PUBLIC_DEBUG === 'true',
  // formatter
  formatDate: 'd MMM yyyy',
  formatTime: 'HH:mm',
  formatDateTime: 'd MMM yyyy, HH:mm',
};

export default config;
