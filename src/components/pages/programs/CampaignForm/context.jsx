'use client';

import { createContext, useState, useMemo } from 'react';
import { useOnce } from '@/hooks/ui';

// using cookies
const initialState = {
  loading: true,
  saving: false,
  data: null,
  formLayout: [],
  step: 0,
  input: {},
};

const FormContext = createContext(initialState);

export const FormProvider = ({
  initData,
  children,
}) => {
  const [input, setInput] = useState(initialState.input);
  const [loading, setLoading] = useState(initialState.loading);
  const [saving, setSaving] = useState(initialState.saving);
  const [step, setStep] = useState(initialState.step);

  const formLayout = useMemo(() => {
    return initData.form.fields.map((field) => {
      if (field.type === 'products') {
        return {
          ...field,
          options: initData.products || [],
        };
      }
      if (field.type === 'select') {
        return {
          ...field,
          options: field.options?.split('\n').map((v) => ({
            id: v,
            name: v,
          })) || [],
        };
      }
      return field;
    });
  }, [initData]);

  useOnce(() => {
    // should I refetch data?
    setLoading(false);
  });

  return (
    <FormContext.Provider value={{
      loading,
      saving,
      data: initData,
      formLayout,
      step,
      setStep,
      input,
      setInput,
    }}>
      {children}
    </FormContext.Provider>
  );
};

export default FormContext;
