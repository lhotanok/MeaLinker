import { Box, Button, ButtonGroup, Card, CardMedia, Grid } from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { LIGHTER_PRIMARY_COLOR, LIGHTER_SECONDARY_COLOR } from '../constants';

type ZoomableImageProps = {
  src: string;
  alt: string;
  actionButton?: JSX.Element;
  maxHeight?: number;
  maxWidth?: number;
  buttonGroupSize?: 'small' | 'medium' | 'large';
  buttonGroupPb?: number;
};

export default function ZoomableImage({
  src,
  alt,
  actionButton,
  maxHeight = 600,
  maxWidth,
  buttonGroupSize = 'small',
  buttonGroupPb,
}: ZoomableImageProps) {
  return (
    <Box>
      <TransformWrapper wheel={{ wheelDisabled: true }}>
        {({ zoomIn, zoomOut, resetTransform }) => (
          <Card elevation={0} sx={{ maxHeight, maxWidth }}>
            <Grid container>
              <Grid item xs pb={buttonGroupPb}>
                <ButtonGroup
                  disableElevation={true}
                  variant='contained'
                  color='inherit'
                  aria-label='button group'
                  size={buttonGroupSize}
                >
                  <Button
                    sx={{ backgroundColor: LIGHTER_SECONDARY_COLOR }}
                    onClick={() => zoomIn()}
                  >
                    <ZoomInIcon />
                  </Button>
                  <Button sx={{ backgroundColor: '#A2DFF9' }} onClick={() => zoomOut()}>
                    <ZoomOutIcon />
                  </Button>
                  <Button
                    sx={{ backgroundColor: LIGHTER_PRIMARY_COLOR }}
                    onClick={() => resetTransform()}
                  >
                    <ZoomOutMapIcon />
                  </Button>
                </ButtonGroup>
              </Grid>
              {actionButton && (
                <Grid item alignContent='right'>
                  {actionButton}
                </Grid>
              )}
            </Grid>
            <TransformComponent>
              <CardMedia component='img' image={src} alt={alt} />
            </TransformComponent>
          </Card>
        )}
      </TransformWrapper>
    </Box>
  );
}
