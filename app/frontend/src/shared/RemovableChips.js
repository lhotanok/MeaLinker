import React from 'react';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export default function RemovableChips(props) {
  const { chips, onRemove } = props;
  const [removableChips, setRemovableChips] = React.useState(chips);
  console.log(`Chips: ${JSON.stringify(chips)}`);

  const handleRemove = (chipToRemove) => () => {
    setRemovableChips((chips) =>
      chips.filter((chip) => chip.key !== chipToRemove.key),
    );
    onRemove(chipToRemove);
  };

  const listItems = removableChips.map((data) => {
    return (
      <Grid item key={data.key}>
        <Chip
          color='secondary'
          label={data.label}
          onDelete={handleRemove(data)}
        />
      </Grid>
    );
  });

  console.log(`List items: ${listItems.length}`);

  return (
    <Container maxWidth='md'>
      <Grid container spacing={1.5} justifyContent='center'>
        {listItems}
      </Grid>
    </Container>
  );
}
