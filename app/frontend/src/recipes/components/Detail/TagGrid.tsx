import { Grid, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

type TagGridProps = {
  tags: string[];
};

export default function TagGrid({ tags }: TagGridProps) {
  const navigate = useNavigate();

  return (
    <Grid container spacing={1} mt={2}>
      {tags.filter((tag) => !tag.includes('...')).map((tag) => (
        <Grid item key={tag}>
          <Chip
            label={tag}
            component='a'
            clickable
            onClick={() => {
              navigate(`/recipes?tags=${encodeURI(tag)}`);
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
