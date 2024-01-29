'use client';

import {
  createContext, useState, useMemo, useCallback,
} from 'react';
import { useOnce } from '@/hooks/ui';
import { useFetch } from '@/hooks/fetcher';

function genData(data) {
  const props = [
    'id',
    'form_id',
    'name',
    'slug',
    'description',
    'intro_title',
    'intro_description',
    'presubmit_title',
    'presubmit_description',
    'postsubmit_title',
    'postsubmit_description',
    'background_url',
    'products',
    'form',
  ];
  return props.reduce((acc, key) => ({
    ...acc,
    [key]: data[key],
  }), {});
}

const initialState = {
  loading: true,
  saving: false,
  completed: false,
  theme: 'light',
  data: null,
  submission: null,
  newSubmission: false,
  formLayout: [],
  step: 0,
  input: {},
};

const FormContext = createContext(initialState);

export const FormProvider = ({
  slug,
  initData,
  children,
}) => {
  const doFetch = useFetch();

  const [input, setInput] = useState(initialState.input);
  const [loading, setLoading] = useState(initialState.loading);
  const [saving, setSaving] = useState(initialState.saving);
  const [completed, setCompleted] = useState(initialState.completed);
  const [theme] = useState(initData?.theme || initialState.theme);
  const [data, setData] = useState(genData(initData));
  const [submission, setSubmission] = useState(initData?.enrolments?.[0] || null);
  const [newSubmission, setNewSubmission] = useState(initialState.newSubmission);
  const [step, setStep] = useState(initialState.step);
  const [error, setError] = useState(null);
  const [validator, setValidator] = useState(null);

  const formLayout = useMemo(() => {
    return data?.form.fields.map((field) => {
      if (field.type === 'products') {
        return {
          ...field,
          options: data.products || [],
        };
      }
      if (field.type === 'select') {
        const options = field.options?.map((d) => ({
          id: d.label,
          key: d.key,
          name: d.label,
          sub: d.sublabel,
          image_url: d.image_url,
        })) || [];
        const hasImage = options.some((d) => d.image_url);
        return {
          ...field,
          options,
          // enable custom type `select_image`
          type: hasImage ? 'select_image' : 'select',
        };
      }
      return field;
    });
  }, [data]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await doFetch(`/v1/app/campaigns/${slug}`);
      if (result.code !== 200 || !result.data) {
        throw new Error('Something went wrong');
      }
      setData(genData(result.data));
      if (result.data.enrolments?.length) {
        setSubmission(result.data.enrolments[0]);
        setCompleted(true);
        setNewSubmission(false);
      }
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  }, [slug, doFetch]);

  const doSubmit = useCallback(async () => {
    setError(null);
    setValidator(null);
    setSaving(true);
    try {
      const formdata = {
        form_id: data.form_id,
        submissions: JSON.stringify(input),
      };
      const result = await doFetch(`/v1/app/campaigns/${slug}/enrolment`, {
        method: 'POST',
        data: formdata,
      });
      setCompleted(true);
      setNewSubmission(true);
      setSubmission(result.data);
    } catch (err) {
      if (err.response?.data?.code === 422) {
        setValidator(err.response.data.validator.reduce((acc, cur) => ({
          ...acc,
          [cur.field]: cur.msg,
        }), {}));
      } else {
        // eslint-disable-next-line no-console
        console.error(err);
      }
      setError(err);
    }
    setSaving(false);
  }, [slug, input, data.form_id, doFetch]);

  useOnce(() => {
    fetchData();
  });

  return (
    <FormContext.Provider value={{
      loading,
      saving,
      completed,
      theme,
      data,
      error,
      validator,
      submission,
      newSubmission,
      formLayout,
      step,
      setStep,
      input,
      setInput,
      doSubmit,
    }}>
      {children}
    </FormContext.Provider>
  );
};

export default FormContext;
