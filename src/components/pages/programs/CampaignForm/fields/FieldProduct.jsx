'use client';

import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useInput } from '../hooks';
import FieldAction from '../comps/FieldAction.jsx';

export default function FieldProduct({
  field,
  name,
  value,
  onChange,
  onPrev,
  onNext,
}) {
  const [input] = useInput();

  const isNextable = useMemo(() => {
    if (field.mandatory) {
      return Boolean(value);
    }
    return true;
  }, [field.mandatory, value]);

  const filteredProducts = useMemo(() => {
    return field.options.filter((product) => {
      const { filterable, config } = product.campaign_products || {};
      if (!filterable) {
        return true;
      }

      const getFilters = (obj) => {
        return Object.keys(obj).reduce((acc, key) => {
          if (Array.isArray(obj[key]) && obj[key].length > 0) {
            acc.push({
              key,
              values: obj[key],
            });
          }
          return acc;
        }, []);
      };

      let isMatch = false;

      // or conditions (match either one)
      const orFilters = getFilters(config.or || {});
      isMatch = orFilters.some(({ key, values }) => values.includes(input[key]));
      if (isMatch) {
        return true;
      }

      // and conditions (must match all)
      const andFilters = getFilters(config.and || {});
      isMatch = andFilters.length === 0 ? false : andFilters.every(({ key, values }) => values.includes(input[key]));

      return isMatch;
    });
  }, [field.options, input]);

  const handleSelect = (opt) => {
    onChange({
      name,
      value: opt.id,
    });
  };

  return (
    <>
      <Box width="50rem" maxWidth="100%" mx="auto" flexGrow="1" mb={6}>
        <Grid container justifyContent="center" spacing={3}>
          {filteredProducts.map((opt) => (
            <Grid key={opt.id} xs={6} md={3}>
              <ProductItem
                item={opt}
                value={value}
                onClick={handleSelect}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      <FieldAction
        disabled={!isNextable}
        onPrev={onPrev}
        onNext={onNext}
      />
    </>
  );
}

function ProductItem({ item, value, onClick }) {
  const productImage = useMemo(() => {
    return item.image_url || '/images/product-placeholder.svg';
  }, [item.image_url]);

  const handleClick = () => {
    onClick(item);
  };

  return (
    <Button
      color="text"
      sx={[
        {
          position: 'relative',
          width: '100%',
          height: '100%',
          boxShadow: '0 1px 3px rgba(0,0,0,.15)',
          bgcolor: '#fff',
          border: '1px solid transparent',
          borderRadius: '1rem',
          textAlign: 'center',
          flexDirection: 'column',
          fontSize: '0.875rem',
          px: 2,
          py: 3,
          transition: 'all .3s',
          '&:hover': {
            bgcolor: '#fff',
            boxShadow: '0 3px 6px rgba(0,0,0,.25)',
            transform: 'translateY(-2px)',
          },
        },
        item.id === value && ((theme) => ({
          color: theme.palette.primary.main,
          borderColor: theme.palette.primary.main,
          outline: `1px solid ${theme.palette.primary.main}`,
          '&:hover': {
            borderColor: theme.palette.primary.main,
          },
        })),
      ]}
      onClick={handleClick}
    >
      <Box
        display="flex"
        alignItems="flex-end"
        width="6rem"
        height="6rem"
        mb={2}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={productImage}
          alt={item.name}
          width="80"
          height="80"
          style={{ width: '100%', height: 'auto' }}
        />
      </Box>
      <Typography
        variant="h6"
        fontSize="1em"
        fontWeight="500"
        color="text.main"
        lineHeight="1.35"
      >
        {item.name}
      </Typography>
      <Typography
        component="div"
        variant="body2"
        fontSize="0.875em"
        color="text.light"
        lineHeight="1.35"
      >
        by {item.brand}
      </Typography>
    </Button>
  );
}
