import { m } from 'framer-motion';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Image from 'src/components/image';
import { Card, CardProps } from '@mui/material';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import { varFade, MotionContainer } from 'src/components/animate';
import Carousel, { useCarousel, CarouselDots, CarouselArrows } from '../../../../components/carousel';
import './ourPartnerSlider.scss'


type ItemProps = {
    id: string;
    title: string;
    coverUrl: string;
    description: string;
}

interface Props extends CardProps {
    list: ItemProps[];
}

type CarouselItemProps = {
    item: ItemProps;
    active?: boolean;
};

function CarouselItem({ item, active }: CarouselItemProps) {
    const theme = useTheme();

    const { coverUrl, title, description } = item;

    const renderImg = (
        <Image
            alt={title}
            src={coverUrl ?? ''}
            overlay={`linear-gradient(to bottom, ${alpha(theme.palette.grey[900], 0)} 0%, ${theme.palette.grey[900]
                } 75%)`}

            sx={{
                width: 1,
                height: 415,
                // height:"100%"
            }}
        />
    );

    return (
        <MotionContainer action animate={active} sx={{ position: 'relative', height: "100%" }}>
            <Stack
                spacing={1}
                sx={{
                    p: 3,
                    width: 1,
                    bottom: 0,
                    zIndex: 9,
                    textAlign: 'left',
                    position: 'absolute',
                    color: 'common.white',
                    // height:'100%',
                }}
            >
                <m.div variants={varFade().inRight}>
                    <Typography variant="overline" sx={{ color: 'primary.light' }}>
                        Nos partenaires
                    </Typography>
                </m.div>

                <m.div variants={varFade().inRight}>
                    <Link color="inherit" underline="none" sx={{ '&:hover': { color: 'inherit' } }}>
                        <Typography variant="h5" noWrap>
                            {title}
                        </Typography>
                    </Link>
                </m.div>

                <m.div variants={varFade().inRight}>
                    <Typography variant="body2" noWrap>
                        {description}
                    </Typography>
                </m.div>
            </Stack>

            {renderImg}
        </MotionContainer>
    );
}


const OurPartnerSlider = ({ list, ...other }: Props) => {
    const carousel = useCarousel({
        speed: 800,
        autoplay: true,
        ...CarouselDots({
            sx: {
                top: 16,
                left: 16,
                position: 'absolute',
                color: 'primary.light',
            },
        }),
    });

    return (
        <Card {...other} className='cardWrp' sx={{ height: "100%" }}>
            <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings} >
                {list.map((app, index) => (
                    <CarouselItem key={app.id} item={app} active={index === carousel.currentIndex} />
                ))}
            </Carousel>

            <CarouselArrows
                onNext={carousel.onNext}
                onPrev={carousel.onPrev}
                sx={{ top: 8, right: 8, position: 'absolute', color: 'common.white' }}
            />
        </Card>
    );
}

export default OurPartnerSlider