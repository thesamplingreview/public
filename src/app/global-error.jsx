'use client';

import Error from './error.jsx';

export default function GlobalError(props) {
  return (
    <html>
      <body>
        <Error {...props} />
      </body>
    </html>
  );
}
