import { Button, ButtonGroup, Card, CardMedia, Grid } from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import React from 'react';
import FlexBox from './FlexBox';

type ZoomableImageProps = {
  src: string;
  alt: string;
  actionButton?: JSX.Element;
};

export default function ZoomableImage({ src, alt, actionButton }: ZoomableImageProps) {
  return (
    <TransformWrapper wheel={{ wheelDisabled: true }}>
      {({ zoomIn, zoomOut, resetTransform }) => (
        <Card elevation={0} sx={{ maxHeight: 600 }}>
          <Grid container>
            <Grid item xs>
              <ButtonGroup
                disableElevation={true}
                variant='contained'
                color='inherit'
                aria-label='button group'
              >
                <Button sx={{ backgroundColor: '#82b692' }} onClick={() => zoomIn()}>
                  <ZoomInIcon />
                </Button>
                <Button sx={{ backgroundColor: '#A2DFF9' }} onClick={() => zoomOut()}>
                  <ZoomOutIcon />
                </Button>
                <Button
                  sx={{ backgroundColor: '#ff6d75' }}
                  onClick={() => resetTransform()}
                >
                  <ZoomOutMapIcon />
                </Button>
              </ButtonGroup>
            </Grid>
            <Grid item xs alignContent='right'>
              <FlexBox alignment='right'>
                {actionButton ? actionButton : <React.Fragment />}
              </FlexBox>
            </Grid>
          </Grid>
          <TransformComponent>
            <CardMedia component='img' image={src} alt={alt} />
          </TransformComponent>
        </Card>
      )}
    </TransformWrapper>
  );
}
