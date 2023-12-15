import { useContext } from 'react';
import FormContext from './context.jsx';

export function useContextState(state) {
  const context = useContext(FormContext);
  // array support
  if (Array.isArray(state)) {
    return state.map((s) => context[s]);
  }

  return context[state];
}

export function useStep() {
  const { step, setStep } = useContext(FormContext);

  return [step, setStep];
}

export function useInput() {
  const { input, setInput } = useContext(FormContext);

  return [input, setInput];
}

export function useSubmit() {
  const { doSubmit } = useContext(FormContext);

  return doSubmit;
}
