import { Stack, Typography } from '@mui/material';

type IngredientAmountProps = {
  amount: string;
};

export default function IngredientAmount({ amount }: IngredientAmountProps) {
  const formattedAmount = (
    <Stack direction='row' spacing={0.5}>
      {(amount || '').split(' ').map((amountFragment, index) => (
        <Typography fontSize={index === 0 ? 'medium' : 'small'} color='primary'>
          {amountFragment}
        </Typography>
      ))}
    </Stack>
  );

  return formattedAmount;
}
