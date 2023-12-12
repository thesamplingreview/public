'use client';

import { useRef, useState, useMemo } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import Image from 'next/image';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CButton from '@/components/CButton.jsx';
import CIcon from '@/components/CIcon.jsx';
import CLoader from '@/components/CLoader.jsx';
import { useContextState, useStep, useInput } from './hooks';
import FormProgress from './FormProgress.jsx';
import StepIntro from './StepIntro.jsx';
import StepDynamic from './StepDynamic.jsx';
import styles from './FormLayout.module.css';

export default function FormLayout() {
  const $item = useRef(null);
  const loading = useContextState('loading');
  const [step, setStep] = useStep();
  const [input] = useInput();

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

  const handleBack = () => {
    setTransition('fadeLeft');
    setTimeout(() => {
      setStep((state) => (state - 1));
    }, 50);
  };

  const temp = () => {
    console.log(input);
  };

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Header
        hideBack={step === 0}
        onBack={handleBack}
      />
      <Box
        component="main"
        flexGrow="1"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        py={6}
        px={3}
      >
        {loading && <CLoader />}

        {!loading && (
          <SwitchTransition mode="out-in">
            <CSSTransition
              key={step}
              nodeRef={$item}
              timeout={500}
              classNames={{ ...transitionClassNames }}
            >
              <Box
                ref={$item}
                width="40rem"
                maxWidth="100%"
                mx="auto"
              >
                {step === 0 && (
                  <StepIntro onNext={handleNext} />
                )}
                {step !== 0 && (
                  <StepDynamic
                    key={step}
                    step={step}
                    onNext={handleNext}
                  />
                )}
              </Box>
            </CSSTransition>
          </SwitchTransition>
        )}
      </Box>

      <CButton onClick={temp}>check state</CButton>

      <FormProgress />
    </Box>
  );
}

function Header({ hideBack, onBack }) {
  return (
    <Box
      component="header"
      height="6.25rem"
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
        {!hideBack && (
          <Box
            position="absolute"
            sx={{
              left: '1.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            <CButton
              variant="outlined"
              color="text"
              size="small"
              startIcon={<CIcon name="chevron-left" />}
              onClick={onBack}
            >
              Back
            </CButton>
          </Box>
        )}
        {/* logo */}
        <Box>
          <Image src="/images/logo.png" alt="SamplingReview" width="60" height="60" />
        </Box>
      </Container>
    </Box>
  );
}
