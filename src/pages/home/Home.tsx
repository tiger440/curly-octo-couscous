import {
    Box,
    Button,
    Container,
    Grid,
    Link,
    Typography,
    useTheme,
} from "@mui/material";
import "./home.scss";
import sinscrire from "../../assets/hermes-icon.png";
import banner from "../../assets/hero-front-2.png";
import enterprice from "../../assets/enterprice-img.svg";
import develope from "../../assets/develope-img.svg";
import logo from "../../assets/footer-logo.svg";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import Header from "./components/Header";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <div>
            <Container maxWidth="xl">
                <Header />
            </Container>
            {/* Banner section */}
            <Box className="bannerSection">
                <Container maxWidth="xl">
                    <Grid container spacing={2}>
                        <Grid zIndex={2} item xl={6} lg={6} md={12}>
                            <Box className="bannerTitle">
                                <Typography
                                    variant="h2"
                                    sx={{
                                        color: theme.palette.primary.darker,
                                    }}
                                >
                                    Mais combien vaut <br /> mon entreprise ?
                                </Typography>
                                <Typography
                                    sx={{
                                        color: theme.palette.primary.darker,
                                    }}
                                >
                                    Avec Hermès, effectuez la valorisation{" "}
                                    <br />
                                    de votre entreprise gratuitement.
                                </Typography>
                                <Button
                                  variant="contained"
                                  color="secondary"
                                  sx={{
                                      borderRadius: '100px',
                                      paddingInline: '30px',
                                      fontWeight: '500'
                                  }}
                                   
                                    onClick={() => navigate("/valuation")}
                                >
                                    Effectuer ma valorisation
                                    <img src={sinscrire} alt="img" />
                                </Button>
                            </Box>
                        </Grid>
                        <Grid
                            item
                            xl={6}
                            lg={6}
                            md={12}
                            className="bannerImgCard"
                        >
                            <Box className="bannerImg">
                                <img src={banner} alt="img" />
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
                <Box className="shadowBox"></Box>
            </Box>

            {/* Enterprice Section */}
            <Box className="enterpriseSection">
                <Container>
                    <Grid container spacing={2}>
                        <Grid item lg={6} md={6}>
                            <Box className="enterpriseTitle">
                                <Typography
                                    variant="h2"
                                    sx={{
                                        color: theme.palette.primary.darker,
                                    }}
                                >
                                    Connaître la valeur
                                    <br />
                                    de son entreprise,
                                    <br />
                                    une nécessité pour tous
                                    <br /> les chefs d’entreprise.
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item lg={6} md={6}>
                            <Box className="enterpriseBtn">
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: theme.palette.primary.dark,
                                    }}
                                >
                                    Facile.&nbsp;
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: theme.palette.info.dark,
                                    }}
                                >
                                    Rapide.&nbsp;
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: theme.palette.secondary.main,
                                    }}
                                >
                                    Gratuit.
                                </Typography>
                                <Typography
                                    sx={{
                                        color: theme.palette.common.black,
                                    }}
                                >
                                    Avec Hermès, effectuez la valorisation{" "}
                                    <br />
                                    de votre entreprise en quelques clics.
                                </Typography>
                                <Button
                                     variant="contained"
                                     color="secondary"
                                     sx={{
                                         borderRadius: '100px',
                                         paddingInline: '30px',
                                         fontWeight: '500'
                                     }}
                                    onClick={() => navigate("/valuation")}
                                >
                                    {" "}
                                    C’est parti !{" "}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                    <Box className='enterpriceImageContainer'>
                        <img src={enterprice} alt="img" />
                    </Box>
                </Container>
                <Box className="enterpriseShape"></Box>
            </Box>

            {/*  Develope Section*/}
            <Box className="developeSection">
                <Container>
                    <Box className="developeTitle">
                        <Typography
                            variant="h2"
                            className="titleText"
                            sx={{
                                color: theme.palette.primary.darker,
                            }}
                        >
                            Un outil développé aux côtés d’expert-comptables,
                            d’entrepreneurs et d’investisseurs.
                        </Typography>
                        <Typography
                            className="subtitleText"
                            sx={{
                                color: theme.palette.common.black,
                            }}
                        >
                            Inscrivez-vous gratuitement sur Hermès pour
                            bénéficiez d’une valorisation encore plus poussée.
                        </Typography>
                        <Button
                            variant="contained"
                            color="secondary"
                            sx={{
                                borderRadius: '100px',
                                paddingInline: '30px',
                                fontWeight: '500'
                            }}
                            onClick={() => navigate("/signup")}
                        >
                            M’inscrire
                        </Button>
                    </Box>
                    <Box className='developeImageContainer'>
                        <img src={develope} alt="img" />
                    </Box>
                </Container>
            </Box>

            <Box className="footerSection">
                <Container maxWidth="xl">
                    <Grid container spacing={2}>
                        <Grid item lg={3} md={6}>
                            <Box className="footerCard">
                                <Typography
                                    sx={{
                                        color: theme.palette.common.black,
                                    }}
                                >
                                    C’est vraiment bien et on a une valorisation
                                    super rapidement !
                                </Typography>
                                <Button
                                    sx={{
                                        color: theme.palette.primary.darker,
                                    }}
                                >
                                    Antoine, M CONSEIL
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item lg={3} md={6}>
                            <Box className="footerCard">
                                <Typography
                                    sx={{
                                        color: theme.palette.common.black,
                                    }}
                                >
                                    On m’a fait une offre de rachat. J’ai pu
                                    vérifier avec Hermès si la proposition était
                                    sérieuse. Super pratique.
                                </Typography>
                                <Button
                                    sx={{
                                        color: theme.palette.primary.darker,
                                    }}
                                >
                                    Jonathan, Galerie Goldshteyn-Saatort
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item lg={3} md={6}>
                            <Box className="footerCard">
                                <Typography
                                    sx={{
                                        color: theme.palette.common.black,
                                    }}
                                >
                                    Hermès me permet de me tenir au courant des
                                    valorisations de mes différentes boites
                                    plusieurs fois par an.
                                </Typography>
                                <Button
                                    sx={{
                                        color: theme.palette.primary.darker,
                                    }}
                                >
                                    Mickael, entrepreneur & investisseur
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item lg={3} md={6}>
                            <Box className="footerCard">
                                <Typography
                                    sx={{
                                        color: theme.palette.common.black,
                                    }}
                                >
                                    Un très bon outil, facile à utiliser et qui
                                    donne des réponses claires.
                                </Typography>
                                <Button
                                    sx={{
                                        color: theme.palette.primary.darker,
                                    }}
                                >
                                    Alexandra, entrepreneuse
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
                <Box
                    className="footerBottomBar"
                    sx={{
                        background: theme.palette.primary.main,
                    }}
                >
                    <Container maxWidth="xl">
                        <Box className="footerDetail">
                            <Box>
                                <img src={logo} alt="img" />
                            </Box>
                            <Box className="footerLink">
                                <Box className="callDetail">
                                    <Link
                                        sx={{
                                            fontSize: "14px",
                                            fontWeight: 'light',
                                            color: theme.palette.primary
                                                .contrastText,
                                            "&:hover": {
                                                color: theme.palette.primary
                                                    .contrastText,
                                            },
                                        }}
                                    >
                                        <CallOutlinedIcon /> 01 23 45 67 89
                                    </Link>
                                    <Link
                                        sx={{
                                            fontSize: "14px",
                                            fontWeight: 'light',
                                            color: theme.palette.primary
                                                .contrastText,
                                            "&:hover": {
                                                color: theme.palette.primary
                                                    .contrastText,
                                            },
                                        }}
                                    >
                                        {" "}
                                        <MailOutlineIcon /> contact@hermes.fr
                                    </Link>
                                </Box>
                                <Box className="footerMenu">
                                    <Typography
                                        sx={{
                                            color: theme.palette.primary
                                                .contrastText,
                                            fontSize: "14px",
                                            "&:hover": {
                                                color: theme.palette.primary
                                                    .contrastText,
                                            },
                                        }}
                                    >
                                        Accueil
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: theme.palette.primary
                                                .contrastText,
                                            fontSize: "14px",
                                            "&:hover": {
                                                color: theme.palette.primary
                                                    .contrastText,
                                            },
                                        }}
                                    >
                                        Je veux proposer la solution à mes
                                        clients !
                                    </Typography>
                                </Box>
                                <Box>
                                    <Button
                                        sx={{
                                            backgroundColor:
                                                theme.palette.secondary.main,
                                            color: theme.palette.primary
                                                .contrastText,
                                        }}
                                        onClick={() => navigate("/login")}
                                    >
                                        Se connecter
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        sx={{
                                            borderRadius: '100px',
                                            paddingInline: '30px',
                                            fontWeight: '500'
                                        }}
                                        onClick={() => navigate("/signup")} >
                                        S’inscrire
                                        <img src={sinscrire} alt="img" />
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </Container>
                </Box>
                <Box
                    className="legalNoticeCard"
                    sx={{
                        backgroundColor: theme.palette.primary.darker,
                    }}
                >
                    <Typography
                        sx={{
                            color: theme.palette.primary.contrastText,
                        }}
                    >
                        Mentions légales et politique de confidentialité.
                    </Typography>
                    <Typography
                        sx={{
                            color: theme.palette.primary.contrastText,
                        }}
                    >
                        {" "}
                        Développé par{" "}
                        <Link
                            sx={{
                                color: theme.palette.primary.contrastText,
                                cursor: "pointer",
                            }}
                            onClick={() =>
                                window.location.replace(
                                    "https:///studio-cocy.fr"
                                )
                            }
                        >
                            {" "}
                            l’Agence COCY
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </div>
    );
};

export default Home;
