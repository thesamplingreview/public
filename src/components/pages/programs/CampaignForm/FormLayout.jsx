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
import { useContextState, useStep, useSubmit } from './hooks';
import FormProgress from './FormProgress.jsx';
import StepIntro from './StepIntro.jsx';
import StepDynamic from './StepDynamic.jsx';
import StepSubmit from './StepSubmit.jsx';
import StepCompleted from './StepCompleted.jsx';
import styles from './FormLayout.module.css';

export default function FormLayout() {
  const $item = useRef(null);
  const [
    loading, completed, formLayout,
  ] = useContextState([
    'loading', 'completed', 'formLayout',
  ]);
  const [step, setStep] = useStep();
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

  const handleNext = () => {
    setTransition('fadeRight');
    setTimeout(() => {
      setStep((state) => (state + 1));
    }, 50);
  };

  const handlePrev = () => {
    setTransition('fadeLeft');
    setTimeout(() => {
      setStep((state) => (state - 1));
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
    <Box display="flex" flexDirection="column" height="100vh">
      <Header />
      <Box
        component="main"
        flexGrow="1"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
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
              <Box ref={$item} height="100%" mx="auto">
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
  );
}

function Header() {
  return (
    <Box
      component="header"
      height="6.25rem"
      flex="0 0 auto"
      bgcolor="#fff"
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
