'use client';

import { useRef, useState, useMemo } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import Link from 'next/link';
import Image from 'next/image';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useUpdated } from '@/hooks/ui';
import CButton from '@/components/CButton.jsx';
import CIcon from '@/components/CIcon.jsx';
import CLoader from '@/components/CLoader.jsx';
import {
  useContextState, useStep, useInput, useSubmit,
} from './hooks';
import FormProgress from './FormProgress.jsx';
import StepIntro from './StepIntro.jsx';
import StepDynamic from './StepDynamic.jsx';
import StepSubmit from './StepSubmit.jsx';
import StepCompleted from './StepCompleted.jsx';
import styles from './FormLayout.module.css';

export default function FormLayout() {
  const $item = useRef(null);
  const [
    loading, completed, theme, formLayout, data,
  ] = useContextState([
    'loading', 'completed', 'theme', 'formLayout', 'data',
  ]);
  const [step, setStep] = useStep();
  const [input] = useInput();
  const doSubmit = useSubmit();

  const [mounted, setMounted] = useState(false);
  const [transition, setTransition] = useState('fadeRight');

  const transitionClassNames = useMemo(() => {
    const d = Object.keys(styles).reduce((acc, key) => {
      const segs = key.split('-');
      if (segs[0] === transition) {
        acc[segs[1]] = styles[key];
      }
      return acc;
    }, {});
    return d;
  }, [transition]);

  const getNextStep = (currStep, inc) => {
    // apply logic checking if field should display
    const nextStep = currStep + inc;
    const nextField = formLayout[nextStep - 1];
    if (nextField?.use_logic && nextField?.logic) {
      const isMatch = nextField.logic.every((l) => {
        if (!input[l.field]) {
          return false;
        }
        const comparedInput = Array.isArray(input[l.field]) ? input[l.field] : [input[l.field]];
        return comparedInput.includes(l.value);
      });
      if (!isMatch) {
        return getNextStep(currStep, inc + inc);
      }
    }
    return nextStep;
  };

  const handleNext = () => {
    setTransition('fadeRight');
    setTimeout(() => {
      setStep((state) => getNextStep(state, 1));
    }, 50);
  };

  const handlePrev = () => {
    setTransition('fadeLeft');
    setTimeout(() => {
      setStep((state) => getNextStep(state, -1));
    }, 50);
  };

  const handleSubmit = () => {
    doSubmit();
  };

  useUpdated(() => {
    if (!loading) {
      // enable fade-in effect on stepIntro
      setTimeout(() => {
        setMounted(true);
      }, 100);
    }
  }, [loading]);

  return (
    <>
      {/* background */}
      <Box
        position="fixed"
        top="0"
        left="0"
        width="100%"
        height="100%"
        sx={{
          pointerEvents: 'none',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundColor: theme === 'dark' ? '#000000' : '#ffffff',
          backgroundImage: data?.background_url ? `url(${data.background_url})` : null,
        }}
      />

      <Box position="relative" display="flex" flexDirection="column" height="100vh">
        <Header />
        <Box
          component="main"
          flexGrow="1"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          color={theme === 'dark' ? '#ffffff' : '#000000'}
          px={3}
        >
          {loading && <CLoader />}

          {!loading && (
            <SwitchTransition mode="out-in">
              <CSSTransition
                key={`${step}_${completed}`}
                nodeRef={$item}
                timeout={500}
                classNames={{ ...transitionClassNames }}
              >
                <Box ref={$item} width="100%" height="100%">
                  {/* status - complete */}
                  {completed && (
                    <StepCompleted
                      mounted={mounted}
                    />
                  )}

                  {/* form */}
                  {!completed && (
                    <>
                      {step === 0 && (
                        <StepIntro
                          mounted={mounted}
                          onNext={handleNext}
                        />
                      )}
                      {step > 0 && step <= formLayout.length && (
                        <StepDynamic
                          key={step}
                          step={step}
                          onPrev={handlePrev}
                          onNext={handleNext}
                        />
                      )}
                      {step > formLayout.length && (
                        <StepSubmit
                          onPrev={handlePrev}
                          onSubmit={handleSubmit}
                        />
                      )}
                    </>
                  )}
                </Box>
              </CSSTransition>
            </SwitchTransition>
          )}
        </Box>

        <FormProgress />
      </Box>
    </>
  );
}

function Header() {
  return (
    <Box
      component="header"
      height="6.25rem"
      flex="0 0 auto"
    >
      <Container
        maxWidth="xl"
        sx={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* back */}
        <Box
          position="absolute"
          sx={{
            left: '1.5rem',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          <CButton
            component={Link}
            href="/"
            // variant="outlined"
            color="text"
            size="small"
            startIcon={<CIcon name="chevron-left" />}
          >
            Back
          </CButton>
        </Box>
        {/* logo */}
        <Box>
          <Image src="/images/logo.png" alt="SamplingReview" width="60" height="60" />
        </Box>
      </Container>
    </Box>
  );
}
