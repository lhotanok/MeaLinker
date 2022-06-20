import { Avatar } from '@mui/material';

type IngredientIconProps = {
  alt: string;
  src?: string;
  size?: number;
  backgroundColor?: string;
};

export default function ImageIcon({
  alt,
  src,
  size,
  backgroundColor,
}: IngredientIconProps) {
  return (
    <Avatar src={src} alt={alt} sx={{ backgroundColor, width: size, height: size }}>
      {!src && alt}
    </Avatar>
  );
}
