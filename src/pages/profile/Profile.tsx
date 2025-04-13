import React, { useState, useEffect } from "react";
import {
    AppBar,
    Avatar,
    Box,
    Button,
    Card,
    CircularProgress,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    Menu,
    MenuItem,
    Slide,
    TextField,
    Toolbar,
    Typography,
    useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Fichier from "../../assets/Fichier.svg";
import { useDispatch } from "react-redux";
import { addUser } from "src/store/slices/auth";
import LoadingButton from "@mui/lab/LoadingButton";
import AdviceCard from "./components/card/Card";
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import LogoutIcon from '@mui/icons-material/Logout';
import {
    collection,
    doc,
    getDocs,
    setDoc,
    where,
    query,
} from "firebase/firestore";
import { db } from "src/firebase/firebase";
import AddIcon from "@mui/icons-material/Add";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { auth } from "src/firebase/firebase";
import {
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword,
} from "firebase/auth";
import { useAppSelector } from "src/hooks/use-app-selector";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";
import "./profile.scss";
import "firebase/auth";
import { profiles } from "src/utils/constants/profileAvatars";
import { useLogout } from "src/hooks/shared";


const Transition = React.forwardRef(function Transition(
    props: any,
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Profile = () => {
    const theme = useTheme();
    const logout = useLogout();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorElProfile, setAnchorElProfile] = useState({});

    const [card, setCard] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isEntrepriseDataFetching, setIsEntrepriseDataFetching] =
        useState(false);
    const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
    const [allSettingFieldEnable, setAllSettingFieldEnable] = useState(false);
    const [isSecurityDialogOpen, setIsSecurityDialogOpen] = useState(false);
    const [allPasswordFieldEnable, setAllPasswordFieldEnable] = useState(false);
    const [passwordVisibility, setPasswordVisibility] = useState({
        oldPassword: false,
        newPassword: false,
        confirmNewPassword: false,
    });

    const user = useAppSelector((state) => state.auth.userData);

    const passwordFormik = useFormik({
        initialValues: {
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        },
        validationSchema: Yup.object().shape({
            oldPassword: Yup.string().required(
                "s'il vous plait entrez votre mot de passe"
            ),
            newPassword: Yup.string()
                .required("s'il vous plait entrez votre mot de passe")
                .trim()
                .min(8, "Un minimum de 8 caractères est requis")
                .matches(/[a-z]/, "Inclure un petit alphabet")
                .matches(/[A-Z]/, "Inclure l'alphabet majuscule")
                .matches(/[1-9]/, "Inclure des chiffres")
                .matches(/[!@#$%^&*()]/, "Inclure les caractères spéciaux")
                .required("Entrer le mot de passe"),
            confirmNewPassword: Yup.string()
                .trim()
                .oneOf(
                    [Yup.ref("newPassword")],
                    "é mot de passe ne correspond pas"
                )
                .required("Veuillez entrer le mot de passe"),
        }),
        onSubmit: async (values, { resetForm }) => {
            setLoading(true);
            try {
                const user = auth.currentUser;
                if (!user) {
                    return;
                }
                const credential = EmailAuthProvider.credential(
                    user?.email as string,
                    values.oldPassword
                );
                const loginUser: any = getAuth();
                reauthenticateWithCredential(loginUser?.currentUser, credential)
                    .then(() => {
                        return updatePassword(
                            loginUser?.currentUser,
                            values?.newPassword
                        );
                    })
                    .then(() => {
                        resetForm();
                        toast.success(
                            `Mettre à jour avec succès le mot de passe`
                        );
                        setLoading(false);
                        handleCloseSecurityPopup();
                    })
                    .catch((error) => {
                        setLoading(false);
                        toast.error(`${error.message}`);
                    });
            } catch (err) {
                toast.error(`Quelque chose s'est mal passé`);
            }
        },
    });

    const settingsFormik = useFormik({
        initialValues: {
            name1: "",
            name2: "",
            email: "",
            phone: "",
            avatar: 1,
        },
        validationSchema: Yup.object().shape({
            name1: Yup.string().required("Entrez votre nom"),
            name2: Yup.string().required("Entrez votre nom"),
            email: Yup.string()
                .matches(
                    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    "Email incorrect"
                )
                .required("Entrez votre Email"),
            phone: Yup.number()
                .lessThan(999999999, "Entrez un numéro de contact correct")
                .moreThan(100000000, "Entrez un numéro de contact correct")
                .typeError("Veuillez entrer un numéro")
                .required("Veuillez entrer le numéro de contact"),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            const collectionRef = doc(db, "user", user.uid);
            setDoc(collectionRef, values, { merge: true })
                .then(() => {
                    const newUser = {
                        ...user,
                        ...values,
                    };
                    dispatch(addUser({ ...newUser }));
                    handleCloseProfilePopup();
                    toast.success(`Données de profil mises à jour avec succès`);
                    setLoading(false);
                })
                .catch(() => {
                    toast.error(`Quelque chose s'est mal passé`);
                    setLoading(false);
                });
        },
    });

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        setAnchorEl(null);
        logout();
    };

    const handlePasswordVisibility = (field) => {
        setPasswordVisibility((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const getAllCollections = async () => {
        setIsEntrepriseDataFetching(true);
        const q = query(
            collection(db, "enterprise"),
            where("userId", "==", user?.uid)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const formattedData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                value: doc.data(),
            }));
            setCard(formattedData);
        }
        setIsEntrepriseDataFetching(false);
    };

    const handlePriFill = async () => {
        settingsFormik.setValues({ ...user });
    };

    const handleSelectProfileMenu = () => {
        setAnchorEl(null);
        setIsSettingsDialogOpen(true);
        handlePriFill();
    };

    const handleCloseProfilePopup = () => {
        setIsSettingsDialogOpen(false);
        setAllSettingFieldEnable(false);
    };

    const handleSelectSecurityMenu = () => {
        setAnchorEl(null);
        setIsSecurityDialogOpen(true);
    };

    const handleCloseSecurityPopup = () => {
        setIsSecurityDialogOpen(false);
        setAllPasswordFieldEnable(false);
        passwordFormik.resetForm()
    };

    const handleSubmitProfilePopup = () => {
        if (!allSettingFieldEnable) {
            setAllSettingFieldEnable(true);
            return;
        } else {
            settingsFormik.submitForm();
        }
    };

    const handleSubmitSecurityPopup = () => {
        if (!allPasswordFieldEnable) {
            setAllPasswordFieldEnable(true);
            return;
        } else {
            passwordFormik.submitForm();
        }
    };

    useEffect(() => {
        getAllCollections();
        handlePriFill();
    }, []);
    

    return (
        <Box className="profilePage">
            <Box className="dashboardWrap">
                <AppBar className="AppBar" position="static">
                    <Toolbar
                        disableGutters
                        sx={{ justifyContent: "space-between" }}
                    >
                        <Box
                            className="logo"
                            sx={{
                                cursor: "pointer",
                            }}
                            onClick={() => navigate("/")}
                        >
                            <img src={Fichier} alt="" />
                        </Box>
                        <Box>
                            <Avatar
                                alt=""
                                src={
                                    user
                                        ? profiles[user.avatar - 1].image
                                        : profiles[0].image
                                }
                                onClick={handleClick}
                                sx={{ cursor: "pointer" }}
                            />
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={handleSelectProfileMenu}>
                                    <PersonIcon sx={{ mr: 1.2 }} />
                                    Paramètres
                                </MenuItem>
                                <MenuItem onClick={handleSelectSecurityMenu}>
                                    <LockIcon sx={{ mr: 1.2 }} />
                                    Sécurité
                                </MenuItem>
                                <MenuItem onClick={handleLogout} sx={{ color: theme.palette.error.main }}>
                                    <LogoutIcon sx={{ mr: 1.2 }} />
                                    Déconnexion
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Toolbar>
                </AppBar>
                <Box className="dashboardData">
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid
                                    item
                                    lg={12}
                                    sx={{
                                        "& .MuiGrid-container": {
                                            "& .MuiGrid-item": {
                                                "& .MuiPaper-elevation": {
                                                    height: "100%",
                                                    maxHeight: "300px",
                                                },
                                            },
                                        },
                                    }}
                                >
                                    <Grid container spacing={2}>
                                        <Grid item lg={6}>
                                            <Card
                                                className="priceCard"
                                                sx={{
                                                    background:
                                                        "linear-gradient(112deg, rgb(79 157 255 / 20%) 66%, rgb(0 78 174 / 20%) 150%)",
                                                }}
                                            >
                                                <Typography
                                                    variant="h3"
                                                    sx={{
                                                        color: theme.palette
                                                            .primary.darker,
                                                    }}
                                                >
                                                    Bienvenue{" "}
                                                    {`${user.name1} ${user.name2}`}
                                                </Typography>
                                                <Typography
                                                    component={"span"}
                                                    sx={{
                                                        color: theme.palette
                                                            .primary.darker,
                                                    }}
                                                >
                                                    Nos clients augmente en
                                                    moyenne leur valorisation de
                                                    30% en suivant les conseils
                                                    de nos experts.
                                                </Typography>
                                                <Button
                                                    sx={{
                                                        backgroundColor:
                                                            theme.palette
                                                                .primary.main,
                                                    }}
                                                    className="cardButton"
                                                    variant="contained"
                                                    onClick={() =>
                                                        navigate("/valuation")
                                                    }
                                                >
                                                    Commencer
                                                </Button>
                                            </Card>
                                        </Grid>
                                        <Grid item lg={3}>
                                            <Card
                                                className="VotreCard"
                                                sx={{
                                                    background:
                                                        "linear-gradient(163deg, #A9DBFC 0%, #75ABE2 20%, #1653B4 100%)",
                                                    position: "relative",
                                                }}
                                            >
                                                <Typography
                                                    component={"span"}
                                                    color={"white"}
                                                >
                                                    HERMES et ses partenaires spécialisés vous accompagnent dans divers domaines stratégiques, afin de maximiser la valeur de votre entreprise.
                                                </Typography>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ mt: 6 }}>
                        <Grid item sm={12}>
                            <Box className="dashboardPageHeader" sx={{ mb: 2 }}>
                                <Box className="dashboardTitle">
                                    <Typography
                                        variant="h4"
                                        sx={{
                                            color: theme.palette.text.primary,
                                        }}
                                    >
                                        Vos valorisations
                                    </Typography>
                                </Box>
                                <Box className="dashboardActionButton">
                                    <Button
                                        color="secondary"
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={() => navigate("/valuation")}
                                    >
                                        Calculer ma valorisation
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item sm={12}>
                            <Grid container spacing={2}>
                                {card.length > 0 ? (
                                    <>
                                        {card.map((data: any, index) => {
                                            return (
                                                <AdviceCard
                                                    key={index}
                                                    data={data}
                                                    index={index}
                                                    anchorEl={anchorElProfile}
                                                    setAnchorEl={setAnchorElProfile}
                                                    getAllCollections={getAllCollections}
                                                />
                                            );
                                        })}
                                    </>
                                ) : (
                                    <>
                                        {isEntrepriseDataFetching ? (
                                            <Box
                                                sx={{
                                                    width: "100%",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <CircularProgress />
                                            </Box>
                                        ) : (
                                            <Typography
                                                sx={{ paddingLeft: "16px" }}
                                            >
                                                Aucune donnée disponible
                                            </Typography>
                                        )}
                                    </>
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
                <Dialog
                    open={isSettingsDialogOpen}
                    fullWidth
                    maxWidth="sm"
                    TransitionComponent={Transition}
                    keepMounted
                    className="profileModel"
                    onClose={handleCloseProfilePopup}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle className="dialogHeading">
                        <Typography> Paramètres </Typography>
                    </DialogTitle>

                    <DialogContent className="dialogContent">
                        <Grid container spacing={2}>
                            <Grid item lg={12} sx={{ mb: 2 }}>
                                <Box
                                    className="profileBoxList"
                                    sx={{
                                        border: `1px solid ${theme.palette.grey["300"]}`,
                                    }}
                                >
                                    {profiles.map((profile) => (
                                        <Box key={profile.id}>
                                            <Box
                                                sx={{
                                                    borderRadius: "50%",
                                                    border:
                                                        settingsFormik.values
                                                            .avatar ===
                                                            profile.id
                                                            ? `5px dashed ${theme.palette.primary.main}`
                                                            : "5px dashed transparent",
                                                    overflow: "hidden",
                                                    width: 80,
                                                    height: 80,
                                                    cursor: "pointer",
                                                    "&:hover": {
                                                        backgroundColor:
                                                            "#f5f5f5",
                                                    },
                                                }}
                                                onClick={() => {
                                                    if (!allSettingFieldEnable)
                                                        return;
                                                    settingsFormik.setFieldValue(
                                                        "avatar",
                                                        profile.id
                                                    );
                                                }}
                                            >
                                                <img
                                                    src={profile.image}
                                                    alt={profile.name}
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover",
                                                    }}
                                                />
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1}>
                            <Grid item lg={6} md={4}>
                                <FormControl fullWidth>
                                    <TextField
                                        fullWidth
                                        disabled={!allSettingFieldEnable}
                                        label="Nom"
                                        name="name1"
                                        // defaultValue={"Nom"}
                                        id="outlined-uncontrolled"
                                        value={settingsFormik.values.name1}
                                        onChange={settingsFormik.handleChange}
                                        onBlur={settingsFormik.handleBlur}
                                        error={
                                            settingsFormik.touched.name1 &&
                                            !!settingsFormik.errors.name1
                                        }
                                        margin="normal"
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                "& fieldset": {
                                                    borderStyle: "dashed",
                                                },
                                            },
                                            marginTop: "4px",
                                        }}
                                    />
                                    {settingsFormik.touched.name1 &&
                                        !!settingsFormik.errors.name1 && (
                                            <FormHelperText error>
                                                {typeof settingsFormik.errors
                                                    .name1 === "string"
                                                    ? settingsFormik.errors
                                                        .name1
                                                    : JSON.stringify(
                                                        settingsFormik.errors
                                                            .name1
                                                    )}
                                            </FormHelperText>
                                        )}
                                </FormControl>
                            </Grid>
                            <Grid item lg={6} md={4}>
                                <FormControl fullWidth>
                                    <TextField
                                        fullWidth
                                        disabled={!allSettingFieldEnable}
                                        label="Prénom"
                                        name="name2"
                                        // defaultValue={"Prénom"}
                                        value={settingsFormik.values.name2}
                                        onChange={settingsFormik.handleChange}
                                        onBlur={settingsFormik.handleBlur}
                                        error={
                                            settingsFormik.touched.name2 &&
                                            !!settingsFormik.errors.name2
                                        }
                                        margin="normal"
                                        sx={{
                                            "& .MuiOutlinedInput-root:has(.Mui-disabled)":
                                            {
                                                "& fieldset": {
                                                    borderStyle: "dashed",
                                                },
                                            },
                                            marginTop: "4px",
                                        }}
                                    />
                                    {settingsFormik.touched.name2 &&
                                        !!settingsFormik.errors.name2 && (
                                            <FormHelperText error>
                                                {typeof settingsFormik.errors
                                                    .name2 === "string"
                                                    ? settingsFormik.errors
                                                        .name2
                                                    : JSON.stringify(
                                                        settingsFormik.errors
                                                            .name2
                                                    )}
                                            </FormHelperText>
                                        )}
                                </FormControl>
                            </Grid>
                            <Grid item lg={6} md={4}>
                                <FormControl fullWidth>
                                    <TextField
                                        fullWidth
                                        disabled={!allSettingFieldEnable}
                                        label="Téléphone"
                                        name="phone"
                                        // defaultValue={"Téléphone"}
                                        value={settingsFormik.values.phone}
                                        onChange={settingsFormik.handleChange}
                                        onBlur={settingsFormik.handleBlur}
                                        error={
                                            settingsFormik.touched.phone &&
                                            !!settingsFormik.errors.phone
                                        }
                                        margin="normal"
                                        sx={{
                                            "& .MuiOutlinedInput-root:has(.Mui-disabled)":
                                            {
                                                "& fieldset": {
                                                    borderStyle: "dashed",
                                                },
                                            },
                                            marginTop: "4px",
                                        }}
                                    />
                                    {settingsFormik.touched.phone &&
                                        !!settingsFormik.errors.phone && (
                                            <FormHelperText error>
                                                {typeof settingsFormik.errors
                                                    .phone === "string"
                                                    ? settingsFormik.errors
                                                        .phone
                                                    : JSON.stringify(
                                                        settingsFormik.errors
                                                            .phone
                                                    )}
                                            </FormHelperText>
                                        )}
                                </FormControl>
                            </Grid>
                            <Grid item lg={6} md={4}>
                                <FormControl fullWidth>
                                    <TextField
                                        fullWidth
                                        disabled={true}
                                        label="Email"
                                        name="email"
                                        // defaultValue={"Email"}
                                        value={settingsFormik.values.email}
                                        onChange={settingsFormik.handleChange}
                                        onBlur={settingsFormik.handleBlur}
                                        error={
                                            settingsFormik.touched.email &&
                                            !!settingsFormik.errors.email
                                        }
                                        margin="normal"
                                        sx={{
                                            "& .MuiOutlinedInput-root:has(.Mui-disabled)":
                                            {
                                                "& fieldset": {
                                                    borderStyle: "dashed",
                                                },
                                            },
                                            marginTop: "4px",
                                        }}
                                    />
                                    {settingsFormik.touched.email &&
                                        !!settingsFormik.errors.email && (
                                            <FormHelperText error>
                                                {typeof settingsFormik.errors
                                                    .email === "string"
                                                    ? settingsFormik.errors
                                                        .email
                                                    : JSON.stringify(
                                                        settingsFormik.errors
                                                            .name1
                                                    )}
                                            </FormHelperText>
                                        )}
                                </FormControl>
                            </Grid>
                        </Grid>
                    </DialogContent>

                    <DialogActions className="modelButton">
                        <LoadingButton
                            loading={loading}
                            size="medium"
                            variant="contained"
                            onClick={handleSubmitProfilePopup}
                            sx={{
                                backgroundColor: theme.palette.primary.main,
                                color: "white",
                            }}
                        >
                            {!allSettingFieldEnable
                                ? "Modifier"
                                : "Enregistrer"}
                        </LoadingButton>

                        <LoadingButton
                            endIcon={<img src={""} alt="" />}
                            variant="outlined"
                            sx={{
                                border: `1px solid ${theme.palette.primary.main}`,
                                color: theme.palette.primary.main,
                            }}
                            size="medium"
                            onClick={() => setIsSettingsDialogOpen(false)}
                        >
                            Retour
                        </LoadingButton>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={isSecurityDialogOpen}
                    fullWidth
                    maxWidth="sm"
                    TransitionComponent={Transition}
                    keepMounted
                    className="profileModel"
                    onClose={handleCloseSecurityPopup}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle className="dialogHeading">
                        <Typography> Sécurité </Typography>
                    </DialogTitle>

                    <DialogContent className="dialogContent">
                        <Grid container spacing={2}>
                            <Grid item lg={12}>
                                <FormControl fullWidth sx={{ pt: 2 }}>
                                    <TextField
                                        disabled={!allPasswordFieldEnable}
                                        size="medium"
                                        label="Mot de passe"
                                        name="oldPassword"
                                        value={
                                            passwordFormik.values.oldPassword
                                        }
                                        onChange={passwordFormik.handleChange}
                                        onBlur={passwordFormik.handleBlur}
                                        error={
                                            passwordFormik.touched
                                                .oldPassword &&
                                            !!passwordFormik.errors.oldPassword
                                        }
                                        type={
                                            passwordVisibility.oldPassword
                                                ? "text"
                                                : "password"
                                        }
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() =>
                                                            handlePasswordVisibility(
                                                                "oldPassword"
                                                            )
                                                        }
                                                        edge="end"
                                                    >
                                                        {passwordVisibility.oldPassword ? (
                                                            <VisibilityOff />
                                                        ) : (
                                                            <Visibility />
                                                        )}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            "& .MuiOutlinedInput-root:has(.Mui-disabled)":
                                            {
                                                "& fieldset": {
                                                    borderStyle: "dashed",
                                                },
                                            },
                                        }}
                                    />
                                    {passwordFormik.touched.oldPassword &&
                                        !!passwordFormik.errors.oldPassword && (
                                            <FormHelperText error>
                                                {
                                                    passwordFormik.errors
                                                        .oldPassword
                                                }
                                            </FormHelperText>
                                        )}
                                </FormControl>
                            </Grid>
                            <Grid item lg={12}>
                                <FormControl fullWidth>
                                    <TextField
                                        disabled={!allPasswordFieldEnable}
                                        name="newPassword"
                                        value={
                                            passwordFormik.values.newPassword
                                        }
                                        onChange={passwordFormik.handleChange}
                                        onBlur={passwordFormik.handleBlur}
                                        error={
                                            passwordFormik.touched
                                                .newPassword &&
                                            !!passwordFormik.errors.newPassword
                                        }
                                        size="medium"
                                        type={
                                            passwordVisibility.newPassword
                                                ? "text"
                                                : "password"
                                        }
                                        label="Nouveau mot de passe"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() =>
                                                            handlePasswordVisibility(
                                                                "newPassword"
                                                            )
                                                        }
                                                        edge="end"
                                                    >
                                                        {passwordVisibility.newPassword ? (
                                                            <VisibilityOff />
                                                        ) : (
                                                            <Visibility />
                                                        )}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            "& .MuiOutlinedInput-root:has(.Mui-disabled)":
                                            {
                                                "& fieldset": {
                                                    borderStyle: "dashed",
                                                },
                                            },
                                        }}
                                    />
                                    {passwordFormik.touched.newPassword &&
                                        !!passwordFormik.errors.newPassword && (
                                            <FormHelperText error>
                                                {
                                                    passwordFormik.errors
                                                        .newPassword
                                                }
                                            </FormHelperText>
                                        )}
                                </FormControl>
                            </Grid>
                            <Grid item lg={12}>
                                <FormControl fullWidth>
                                    <TextField
                                        disabled={!allPasswordFieldEnable}
                                        size="medium"
                                        label="Confirmer le nouveau mot de passe"
                                        name="confirmNewPassword"
                                        value={
                                            passwordFormik.values
                                                .confirmNewPassword
                                        }
                                        onChange={passwordFormik.handleChange}
                                        onBlur={passwordFormik.handleBlur}
                                        error={
                                            passwordFormik.touched
                                                .confirmNewPassword &&
                                            !!passwordFormik.errors
                                                .confirmNewPassword
                                        }
                                        placeholder="Nouveau mot de passe"
                                        type={
                                            passwordVisibility.confirmNewPassword
                                                ? "text"
                                                : "password"
                                        }
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() =>
                                                            handlePasswordVisibility(
                                                                "confirmNewPassword"
                                                            )
                                                        }
                                                        edge="end"
                                                    >
                                                        {passwordVisibility.confirmNewPassword ? (
                                                            <VisibilityOff />
                                                        ) : (
                                                            <Visibility />
                                                        )}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            "& .MuiOutlinedInput-root:has(.Mui-disabled)":
                                            {
                                                "& fieldset": {
                                                    borderStyle: "dashed",
                                                },
                                            },
                                        }}
                                    />
                                    {passwordFormik.touched
                                        .confirmNewPassword &&
                                        !!passwordFormik.errors
                                            .confirmNewPassword && (
                                            <FormHelperText error>
                                                {
                                                    passwordFormik.errors
                                                        .confirmNewPassword
                                                }
                                            </FormHelperText>
                                        )}
                                </FormControl>
                            </Grid>
                        </Grid>
                    </DialogContent>

                    <DialogActions className="modelButton">
                        <LoadingButton
                            loading={loading}
                            type="submit"
                            onClick={handleSubmitSecurityPopup}
                            size="medium"
                            variant="contained"
                            sx={{
                                backgroundColor: theme.palette.primary.main,
                                color: "white",
                            }}
                        >
                            {!allPasswordFieldEnable
                                ? "Modifier"
                                : "Enregistrer"}
                        </LoadingButton>
                        <Button
                            variant="outlined"
                            onClick={handleCloseSecurityPopup}
                            sx={{
                                border: `1px solid ${theme.palette.primary.main}`,
                                color: theme.palette.primary.main,
                            }}
                            size="medium"
                        >
                            Retour
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
};

export default Profile;
