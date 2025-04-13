import React, { useEffect, useState } from "react";
import {
    Avatar,
    Box,
    Button,
    Card,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    Link,
    Slide,
    TextField,
    Typography,
    useTheme,
    CircularProgress,
    Divider,
} from "@mui/material";
import HeaderSection from "../header/header";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { db } from "src/firebase/firebase";
import profileIcon from "../../assets/C-icon.svg";
import AddIcon from "@mui/icons-material/Add";
import "./result.scss";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearFormData } from "src/store/slices/enterpriseForm";
import { getFinancialAdvices } from "src/utils/methods/getFinancialAdvices";
import AdviceCard from "./components/advice-card/AdviceCard";
import { getDoc, doc } from "firebase/firestore";
import { useSearchParams } from "react-router-dom";
import { downloadPDF } from "../../utils/PDF/pdf";
import { getTotalValuationDiffUsingExtraFinancials } from "src/utils/methods/getTotalValuationDiffUsingExtraFinancials";

// const ITEM_HEIGHT = 48;

const Transition = React.forwardRef(function Transition(
    props: any,
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export const convertToThousands = (num: number) => {
    if (Math.abs(num) < 1000) {
        return num.toLocaleString('fr-FR').split(',')[0];
    } else {
        const thousands = Math.round(num / 1000);
        return thousands.toLocaleString('fr-FR').split(',')[0] + ' K';
    }
};

const sectionOrder = [
    { title: "organization", value: "Organisation" },
    { title: "positioning", value: "Positionnement" },
    { title: "innovation", value: "Innovation" },
    { title: "quality", value: "Qualité" },
    { title: "strategie", value: "Stratégie RSE" },
];

const Result = () => {
    const [result, setResult] = useState<any>({});
    const [anchorEl, setAnchorEl] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [financialAdvices, setFinancialAdvices] = useState<any>([]);

    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const enterpriseId = searchParams.get("enterpriseId");

    const handlePriFill = async () => {
        if (enterpriseId) {
            const docRef = doc(db, "enterprise", enterpriseId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setResult(docSnap?.data());
            }
        }
    };

    useEffect(() => {
        if (!enterpriseId) {
            return navigate("/valuation");
        }
        handlePriFill();
    }, []);

    const handleModelClickOpen = () => {
        dispatch(clearFormData());
        navigate(`/valuation?type=${enterpriseId}`);
    };

    const handleModelClose = () => {
        setIsModalOpen(false);
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const downloadResultPDF = () => {
        downloadPDF(
            financialAdvices,
            result?.enterpriseData,
            result?.results?.totalValuation,
            convertToThousands,
            result.capital,
            result.enterpriseName
        );
    };

    useEffect(() => {
        if (result?.financialCriteria) {
            const tmpAdvices = getFinancialAdvices(result?.financialCriteria);
            setFinancialAdvices(tmpAdvices);
        }
    }, [result]);

    return (
        <>
            {!result?.financialCriteria ? (
                <CircularProgress className="loader" />
            ) : (
                <Box className="resultPage">
                    <Box className="dashboardWrap">
                        <HeaderSection
                            setAnchorEl={setAnchorEl}
                            anchorEl={anchorEl}
                        />
                        <Box className="resultPage">
                            <Box className="dashboardData">
                                <Grid container spacing={2}>
                                    <Grid item lg={12} sx={{ mb: 1, mt: 4 }}>
                                        <Box className="dashboardTitle">
                                            <Typography variant="h4">
                                                Vos résultats
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid container spacing={2}>
                                            <Grid item lg={9}>
                                                <Grid
                                                    container
                                                    spacing={2}
                                                // sx={{
                                                //     maxHeight: "400px",
                                                // }}
                                                >
                                                    <Grid
                                                        item
                                                        lg={7}
                                                        sx={{ height: "100%" }}
                                                    >
                                                        <Card
                                                            className="priceCard"
                                                            sx={{
                                                                background:
                                                                    "linear-gradient(112deg, rgb(79 157 255 / 20%) 66%, rgb(0 78 174 / 20%) 150%)",
                                                            }}
                                                        >
                                                            <Typography
                                                                component="span"
                                                                sx={{
                                                                    color: theme
                                                                        .palette
                                                                        .primary
                                                                        .darker,
                                                                }}
                                                            >
                                                                La valeur de votre entreprise s'élève à
                                                            </Typography>
                                                            <Typography
                                                                variant="h2"
                                                                sx={{
                                                                    color: theme.palette.primary.darker,
                                                                    fontWeight: '600'
                                                                }}
                                                            >
                                                                {result?.results
                                                                    ?.totalValuation
                                                                    ? `${convertToThousands(
                                                                        result
                                                                            ?.results
                                                                            ?.totalValuation
                                                                    )}€`
                                                                    : "0 €"}
                                                            </Typography>
                                                            <Typography
                                                                component="span"
                                                                sx={{
                                                                    color: theme
                                                                        .palette
                                                                        .grey[
                                                                        "600"
                                                                    ],
                                                                }}
                                                                className="variationText"
                                                            >
                                                                +/- 10% d'écart type
                                                            </Typography>
                                                            <Typography
                                                                sx={{ 
                                                                    color: theme.palette.primary.darker,
                                                                    fontSize: '1.125rem',
                                                                    mt: 1,
                                                                    fontWeight: '500'
                                                                }}
                                                            >
                                                                Entre {result?.results?.totalValuation 
                                                                    ? `${convertToThousands(Math.round(result.results.totalValuation * 0.9))}€` 
                                                                    : "0 €"} et {result?.results?.totalValuation 
                                                                    ? `${convertToThousands(Math.round(result.results.totalValuation * 1.1))}€` 
                                                                    : "0 €"}
                                                            </Typography>
                                                            <Typography
                                                                color="grey"
                                                                component="p"
                                                                fontSize={'8px'}
                                                            >
                                                                Ce résultat de valorisation est fourni à titre indicatif et ne constitue pas
une garantie de la valeur réelle de l'entreprise, laquelle peut varier en fonction de
nombreux facteurs externes et internes, notamment du marché.
                                                            </Typography>
                                                        </Card>
                                                        <Card
                                                            variant="outlined"
                                                            className="downloadPDF"
                                                            sx={{
                                                                border: `1px solid ${theme.palette.grey["500"]}`,
                                                            }}
                                                        >
                                                            <Box
                                                                className="downloadText"
                                                                mr={5}
                                                            >
                                                                Récuperez le
                                                                récapitulatif de
                                                                votre
                                                                valorisation en
                                                                PDF&nbsp;:
                                                            </Box>
                                                            <Button
                                                                variant="contained"
                                                                className="downloadButton"
                                                                startIcon={
                                                                    <CloudDownloadIcon />
                                                                }
                                                                sx={{
                                                                    backgroundColor:
                                                                        theme
                                                                            .palette
                                                                            .primary
                                                                            .lighter,
                                                                    color: theme
                                                                        .palette
                                                                        .text
                                                                        .primary,
                                                                    "&:hover": {
                                                                        backgroundColor:
                                                                            theme
                                                                                .palette
                                                                                .primary
                                                                                .light,
                                                                    },
                                                                }}
                                                                onClick={
                                                                    downloadResultPDF
                                                                }
                                                            >
                                                                Télécharger
                                                            </Button>
                                                        </Card>
                                                    </Grid>
                                                    <Grid item lg={5}>
                                                        <Card
                                                            className="VotreCard"
                                                            sx={{
                                                                background:
                                                                    "linear-gradient(163deg, #A9DBFC 0%, #75ABE2 40%, #1653B4 100%)",
                                                                position:
                                                                    "relative",
                                                                height: "calc(100% - 180px)",
                                                            }}
                                                        >
                                                            <Typography
                                                                color="white"
                                                                variant="h5"
                                                            >
                                                                HERMES et ses partenaires spécialisés vous accompagnent dans divers domaines
                                                                stratégiques, afin de maximiser la valeur de votre entreprise.
                                                            </Typography>
                                                        </Card>
                                                        <Card
                                                            variant="outlined"
                                                            className="entrepriseCard"
                                                            sx={{
                                                                height: "164px",
                                                            }}
                                                        >
                                                            <Box
                                                                className="profile"
                                                                sx={{
                                                                    borderBottom: `1px dashed ${theme.palette.grey["300"]}`,
                                                                }}
                                                            >
                                                                <Box className="profileImage">
                                                                    <Avatar
                                                                        sx={{
                                                                            bgcolor:
                                                                                'black'
                                                                        }}
                                                                        variant="rounded"
                                                                    >
                                                                        <img
                                                                            src={
                                                                                profileIcon
                                                                            }
                                                                            alt=""
                                                                        />
                                                                    </Avatar>
                                                                </Box>
                                                                <Box className="profileText">
                                                                    <Typography
                                                                        variant="h6"
                                                                        sx={{
                                                                            color: theme
                                                                                .palette
                                                                                .text
                                                                                .primary,
                                                                        }}
                                                                    >
                                                                        {!result?.enterpriseName ||
                                                                            result?.enterpriseName ===
                                                                            ""
                                                                            ? "Nom entreprise"
                                                                            : result?.enterpriseName}
                                                                    </Typography>
                                                                    <Typography
                                                                        component="p"
                                                                        sx={{
                                                                            color: theme
                                                                                .palette
                                                                                .text
                                                                                .disabled,
                                                                        }}
                                                                    >
                                                                        En
                                                                        activité
                                                                        depuis
                                                                        le :{" "}
                                                                        <Typography component="span">
                                                                            {result
                                                                                ?.enterpriseData
                                                                                ?.uniteLegale
                                                                                ?.dateCreationUniteLegale ??
                                                                                "NA"}
                                                                        </Typography>
                                                                    </Typography>
                                                                </Box>
                                                            </Box>

                                                            {/* <IconButton
                            aria-label="more"
                            className="cardMenu"
                            id="long-button"
                            aria-controls={open ? "long-menu" : undefined}
                            aria-expanded={open ? "true" : undefined}
                            aria-haspopup="true"
                            onClick={handleClick}
                          >
                            <MoreVertIcon />
                          </IconButton>
                          <Menu
                            id="long-menu"
                            MenuListProps={{
                              "aria-labelledby": "long-button",
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            PaperProps={{
                              style: {
                                maxHeight: ITEM_HEIGHT * 4.5,
                                width: "20ch",
                              },
                            }}
                          >
                            {options.map((option) => (
                              <MenuItem
                                key={option}
                                selected={option === "Pyxis"}
                                onClick={handleClose}
                              >
                                {option}
                              </MenuItem>
                            ))}
                          </Menu> */}

                                                            <Box className="capitalBox">
                                                                <Button
                                                                    color="primary"
                                                                    variant="contained"
                                                                    className="capitalBtn"
                                                                >
                                                                    Capital de{" "}
                                                                    {result?.capital ??
                                                                        0}{" "}
                                                                    €
                                                                </Button>
                                                                <Typography
                                                                    component="p"
                                                                    sx={{
                                                                        color: theme
                                                                            .palette
                                                                            .text
                                                                            .disabled,
                                                                    }}
                                                                >
                                                                    Siège social
                                                                    :{" "}
                                                                    <Typography component="span">
                                                                        {/* Paris, France */}{" "}
                                                                        NA
                                                                    </Typography>
                                                                </Typography>
                                                            </Box>
                                                        </Card>
                                                    </Grid>

                                                    {/* <Grid item lg={5}></Grid> */}
                                                </Grid>
                                            </Grid>
                                            <Grid
                                                item
                                                lg={3}
                                                sx={{ height: "400px" }}
                                            >
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} sx={{ mt: 6 }}>
                                    <Grid item lg={12}>
                                        <Box
                                            className="dashboardPageHeader"
                                            sx={{ mb: 1 }}
                                        >
                                            <Box className="dashboardTitle">
                                                <Typography
                                                    variant="h4"
                                                    sx={{
                                                        color: theme.palette
                                                            .text.primary,
                                                    }}
                                                >
                                                    Pour augmenter la valeur de votre entreprise
                                                </Typography>
                                            </Box>
                                            <Box className="dashboardActionButton">
                                                <Button
                                                    sx={{ ml: 3 }}
                                                    color="secondary"
                                                    variant="contained"
                                                    startIcon={<AddIcon />}
                                                    onClick={
                                                        handleModelClickOpen
                                                    }
                                                >
                                                    Calculer une nouvelle
                                                    valorisation
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Grid>
                                    <Grid item lg={12}>
                                        {sectionOrder.map((section) => {
                                            const adviceData = financialAdvices[section.title];

                                            if (adviceData?.length > 0) {
                                                return (
                                                    <div key={section.title} className="GridGroupContainer">
                                                        <h3 style={{ fontWeight: '500' }}>{section.value}</h3>
                                                        <Grid container spacing={2}>
                                                            {adviceData?.map((advice, index) => {
                                                                const answers = {
                                                                    ...result.financialCriteria,
                                                                    [section.title]: {
                                                                        ...result.financialCriteria[section.title] ?? {},
                                                                        [advice.subCriteriaKey]: 'oui'  // Find value if answer is "oui"
                                                                    }
                                                                }
                                                                const diff = getTotalValuationDiffUsingExtraFinancials(answers, result.results)
                                                                return (
                                                                    <Grid item lg={6} key={index}>
                                                                        <AdviceCard
                                                                            title={advice.title}
                                                                            description={advice.description}
                                                                            data={advice}
                                                                            positiveDiff={diff > 0 ? diff : null}
                                                                        />
                                                                    </Grid>
                                                                )
                                                            }
                                                            )}
                                                        </Grid>
                                                        <Divider className="dvdr" sx={{ borderBottom: "1px dashed #dfe3e8", }} />
                                                    </div>
                                                );
                                            }
                                        })}
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>

                        <Dialog
                            open={isModalOpen}
                            fullWidth
                            maxWidth="sm"
                            TransitionComponent={Transition}
                            keepMounted
                            className="modelDialog"
                            onClose={handleModelClose}
                            aria-describedby="alert-dialog-slide-description"
                        >
                            <DialogTitle className="dialogHeading">
                                <Typography variant="h5">
                                    {" "}
                                    Connectez-vous à Hermes{" "}
                                </Typography>
                                <Typography
                                    component="p"
                                    sx={{ color: theme.palette.text.primary }}
                                >
                                    Nouvel utilisateur ?
                                    <Typography
                                        component="span"
                                        sx={{
                                            color: theme.palette.primary.main,
                                        }}
                                    >
                                        {" "}
                                        Créer un compte
                                    </Typography>
                                </Typography>
                            </DialogTitle>
                            <DialogContent className="dialogContent">
                                <Grid container spacing={2}>
                                    <Grid item lg={12}>
                                        <FormControl fullWidth>
                                            <TextField
                                                fullWidth
                                                label="Adresse mail"
                                                variant="outlined"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item lg={12}>
                                        <FormControl fullWidth sx={{ mb: 2 }}>
                                            <TextField
                                                // endAdornment={
                                                //   <InputAdornment position="end">
                                                //     <IconButton
                                                //       aria-label="toggle password visibility"
                                                //       edge="end"
                                                //     >
                                                //       <VisibilityOff />
                                                //     </IconButton>
                                                //   </InputAdornment>
                                                // }
                                                label="Password"
                                                type="password"
                                                variant="outlined"
                                                inputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                edge="end"
                                                            >
                                                                <VisibilityOff />
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item lg={6}>
                                        <FormControl fullWidth sx={{ mb: 2 }}>
                                            <TextField
                                                label="Nom"
                                                type="text"
                                                variant="outlined"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item lg={6}>
                                        <FormControl fullWidth sx={{ mb: 2 }}>
                                            <TextField
                                                label="Prénom"
                                                type="text"
                                                variant="outlined"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item lg={12}>
                                        <FormControl fullWidth sx={{ mb: 2 }}>
                                            <TextField
                                                label="Adresse mail"
                                                type="text"
                                                variant="outlined"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item lg={12}>
                                        <FormControl fullWidth sx={{ mb: 2 }}>
                                            <TextField
                                                label="Téléphone"
                                                type="text"
                                                variant="outlined"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item lg={12}>
                                        <FormControl fullWidth sx={{ mb: 2 }}>
                                            <TextField
                                                label="Mot de passe"
                                                variant="outlined"
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                // endAdornment={
                                                //   <InputAdornment position="end">
                                                //     <IconButton
                                                //       aria-label="toggle password visibility"
                                                //       onClick={handleClickShowPassword}
                                                //       onMouseDown={handleMouseDownPassword}
                                                //       edge="end"
                                                //     >
                                                //       {showPassword ? <VisibilityOff /> : <Visibility />}
                                                //     </IconButton>
                                                //   </InputAdornment>
                                                // }

                                                inputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={
                                                                    handleClickShowPassword
                                                                }
                                                                onMouseDown={
                                                                    handleMouseDownPassword
                                                                }
                                                                edge="end"
                                                            >
                                                                {showPassword ? (
                                                                    <VisibilityOff />
                                                                ) : (
                                                                    <Visibility />
                                                                )}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Box className="forgotPass">
                                    <Link
                                        href="#"
                                        rel="noopener noreferrer"
                                        sx={{
                                            color: theme.palette.text.primary,
                                        }}
                                    >
                                        Mot de passe oublié ?
                                    </Link>
                                </Box>
                            </DialogContent>

                            <DialogActions className="modelButton">
                                <Button
                                    onClick={handleModelClose}
                                    fullWidth
                                    size="large"
                                    variant="contained"
                                    sx={{
                                        backgroundColor:
                                            theme.palette.primary.main,
                                        color: "white",
                                    }}
                                >
                                    Se connecter
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                </Box>
            )}
        </>
    );
};

export default Result;
