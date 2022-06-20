import { Avatar, Card, CardContent, CardHeader } from '@mui/material';

const InfoCard: React.FC<{
  title: string;
  content: JSX.Element;
  subheader?: string;
  iconSrc?: string;
}> = ({ title, subheader, iconSrc, content }) => {
  return (
    <Card raised>
      <CardHeader
        title={title}
        subheader={subheader}
        titleTypographyProps={{ component: 'h2', variant: 'h5' }}
        avatar={
          <Avatar
            variant='square'
            src={iconSrc}
            alt={title}
            sx={{ width: 50, height: 50 }}
          />
        }
      />
      <CardContent>{content}</CardContent>
    </Card>
  );
};

export default InfoCard;
