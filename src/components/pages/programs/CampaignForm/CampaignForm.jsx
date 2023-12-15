'use client';

import { FormProvider } from './context.jsx';
import FormLayout from './FormLayout.jsx';

export default function CampaignForm({ slug, data }) {
  return (
    <FormProvider slug={slug} initData={data}>
      <FormLayout />
    </FormProvider>
  );
}
