import { Grid, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

type TagGridProps = {
  tags: string[];
  category: string;
};

export default function TagGrid({ tags = [], category = '' }: TagGridProps) {
  const chipNames = [...tags, category]
    .filter((name) => name)
    .filter((tag) => !tag.includes('...'));

  const navigate = useNavigate();

  return (
    <Grid container spacing={1} mt={2}>
      {chipNames.map((name) => (
        <Grid item key={name}>
          <Chip
            label={name}
            component='a'
            clickable
            onClick={() => {
              navigate(`/recipes?tags=${encodeURI(name)}`);
              setTimeout(() => {
                window.scrollTo(0, 0);
              }, 50);
            }}
          />
        </Grid>
      ))}
    </Grid>
  );
}
