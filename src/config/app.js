const config = {
  // app
  name: process.env.NEXT_PUBLIC_NAME,
  url: process.env.NEXT_PUBLIC_URL,
  apiUrl: process.env.NEXT_PUBLIC_API,
  debug: process.env.NEXT_PUBLIC_DEBUG === 'true',
  // require OTP code when saving phone number (must match API PHONE_OTP_REQUIRED)
  phoneOtpRequired: process.env.NEXT_PUBLIC_PHONE_OTP_REQUIRED !== 'false',
  // formatter
  formatDate: 'd MMM yyyy',
  formatTime: 'HH:mm',
  formatDateTime: 'd MMM yyyy, HH:mm',
};

export default config;
