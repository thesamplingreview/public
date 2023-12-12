'use client';

import { FormProvider } from './context.jsx';
import FormLayout from './FormLayout.jsx';

export default function CampaignForm({ data }) {
  return (
    <FormProvider initData={data}>
      <FormLayout />
    </FormProvider>
  );
}
