import React from 'react';

import { Box, Button, ButtonGroup, Card, CardMedia } from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

type ZoomableImageProps = {
  src: string;
  alt: string;
  scale?: number;
  positionX?: number;
  positionY?: number;
};

export default function ZoomableImage({
  src,
  alt,
  scale = 1,
  positionX = 0,
  positionY = 0,
}: ZoomableImageProps) {
  return (
    <TransformWrapper
      initialScale={scale}
      initialPositionX={positionX}
      initialPositionY={positionY}
    >
      {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
        <Card elevation={0} sx={{ backgroundColor: 'WhiteSmoke' }}>
          <Box
            className='tools'
            width='100%'
            height='100%'
            display='flex'
            justifyContent='right'
            alignItems='right'
          >
            <ButtonGroup variant='contained' color='inherit' aria-label='button group'>
              <Button size='large' onClick={() => zoomIn()}>
                <ZoomInIcon color='primary' />
              </Button>
              <Button size='large' onClick={() => zoomOut()}>
                <ZoomOutIcon color='primary' />
              </Button>
              <Button size='large' onClick={() => resetTransform()}>
                <ZoomOutMapIcon color='primary' />
              </Button>
            </ButtonGroup>
          </Box>
          <TransformComponent>
            <CardMedia component='img' image={src} alt={alt} />
          </TransformComponent>
        </Card>
      )}
    </TransformWrapper>
  );
}
