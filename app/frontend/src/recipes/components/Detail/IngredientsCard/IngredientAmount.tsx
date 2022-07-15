import { Stack, Typography } from '@mui/material';

type IngredientAmountProps = {
  amount: string;
  amountValue?: number;
};

export default function IngredientAmount({ amount }: IngredientAmountProps) {
  const amountFragments = (amount || '').split(' ').map((amountFragment, index) => (
    <Typography key={index} fontSize={index === 0 ? 'medium' : 'small'} color='primary'>
      {amountFragment}
    </Typography>
  ));

  const formattedAmount = (
    <Stack direction='row' spacing={0.5}>
      {amountFragments}
    </Stack>
  );

  return formattedAmount;
}
