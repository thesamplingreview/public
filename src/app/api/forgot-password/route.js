import { NextResponse } from 'next/server';
import { getEjsTemplate } from '@/helpers/template';
import config from '@/config/app';

function genEndpoint(url) {
  return `${config.apiUrl}${url}`;
}

function genAppKey() {
  return process.env.API_KEY;
}

async function postResetToken(body) {
  // request reset token
  const endpoint = genEndpoint('/v1/auth/password/reset-token');
  // eslint-disable-next-line no-console
  console.log('POST: ', endpoint);

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'app-key': genAppKey(),
    },
    body: new URLSearchParams(body),
  });
  const result = await response.json();
  if (result.code !== 200 || !result.data?.token) {
    const err = new Error(result.error || 'Server error');
    err.validator = result.validator || null;
    throw err;
  }

  return result.data;
}

async function postSendResetEmail(data) {
  // request reset token
  const endpoint = genEndpoint('/v1/utils/send-email');
  // eslint-disable-next-line no-console
  console.log('POST: ', endpoint);

  const contentData = {
    ...data,
    reset_url: `${config.url}/reset-password/${data.token}`,
  };
  const contentHtml = getEjsTemplate('reset-password', contentData);

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'app-key': genAppKey(),
    },
    body: new URLSearchParams({
      to: data.email,
      subject: '[TEST] Password Reset',
      content: contentHtml,
      use_html: true,
    }),
  });
  const result = await response.json();
  if (result.code !== 200) {
    const err = new Error(result.error || 'Server error');
    err.validator = result.validator || null;
    throw err;
  }

  return result.data;
}

export async function POST(request) {
  try {
    const body = await request.json();

    // request reset token
    const resetResult = await postResetToken(body);
    // send email
    await postSendResetEmail(resetResult);

    return NextResponse.json({
      code: 200,
      data: 'ok',
    });
  } catch (err) {
    return NextResponse.json({
      code: 500,
      error: err.message,
      validator: err.validator || null,
    });
  }
}
