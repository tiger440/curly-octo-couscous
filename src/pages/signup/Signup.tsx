import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LoadingButton from "@mui/lab/LoadingButton";
import {
    Box,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
    collection,
    doc,
    getDocs,
    query,
    setDoc,
    where,
} from "firebase/firestore";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth, db } from "src/firebase/firebase";
import { useAppSelector } from "src/hooks/use-app-selector";
import { addUser } from "src/store/slices/auth";
import * as Yup from "yup";
import logo from "../../assets/Fichier.svg";
import loginBG from "../../assets/login-bg.png";
import "./signup.scss";

const selectMenuOptions = [
    {
        label: "Veuillez choisir une fonction",
        value: "Veuillez choisir une fonction",
    },
    {
        label: "Dirigeant ou employé de la société",
        value: "Dirigeant ou employé de la société",
    },
    {
        label: "Expert-comptable ou Conseil",
        value: "Expert-comptable ou Conseil",
    },
];

const Signup = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { userData } = useAppSelector((state) => state.auth);
    const signupDataFormik = useFormik({
        initialValues: {
            name1: "",
            name2: "",
            function: "",
            email: "",
            phone: "",
            password: "",
        },
        validateOnMount: true,
        validationSchema: Yup.object().shape({
            name1: Yup.string().required("Entrez votre nom"),
            name2: Yup.string().required("Entrez votre Prénom"),
            function: Yup.string().required("Veuillez sélectionner une option"),
            email: Yup.string()
                .matches(
                    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    "Le courriel est invalide"
                )
                .required("Veuillez entrer votre email"),
            phone: Yup.number()
                .lessThan(999999999, "Entrez un numéro de contact correct")
                .moreThan(100000000, "Entrez un numéro de contact correct")
                .typeError("Veuillez entrer un numéro")
                .required("Veuillez entrer le numéro de contact"),
            password: Yup.string()
                .trim()
                .required("s'il vous plait entrez votre mot de passe")
                .min(8, "Un minimum de 8 caractères est requis")
                .matches(/[a-z]/, "Inclure un alphabet non majuscule")
                .matches(/[A-Z]/, "Inclure un alphabet majuscule")
                .matches(/[1-9]/, "Inclure des chiffres")
                .matches(/[!@#$%^&*()]/, "Inclure les caractères spéciaux")
                .required("Veuillez entrer le mot de passe"),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const res = await createUserWithEmailAndPassword(
                    auth,
                    values.email,
                    values.password
                );
                if (res) {
                    const collectionRef = doc(collection(db, "user"));
                    const value: any = {
                        ...values,
                        avatar: 1,
                    };
                    delete value.password;
                    setDoc(collectionRef, value)
                        .then(async () => {
                            const q = query(
                                collection(db, "user"),
                                where("email", "==", values.email)
                            );
                            const querySnapshot = await getDocs(q);
                            if (querySnapshot.docs[0]) {
                                const userData = querySnapshot.docs[0].data();
                                dispatch(
                                    addUser({
                                        ...userData,
                                        uid: querySnapshot.docs[0].id,
                                    })
                                );
                                setLoading(false);
                                navigate("/valuation");
                            }
                        })
                        .catch((err) => {
                            setLoading(false);
                            console.log(err);
                        });
                }
            } catch (err) {
                setLoading(false);
                toast.error(`${err.message}`);
            }
        },
    });

    const {
        values,
        errors,
        touched,
        isValid,
        submitForm,
        handleBlur,
        handleChange,
    } = signupDataFormik;

    useEffect(() => {
        if (userData) {
            navigate("/valuation");
        }
    }, [userData]);

    return (
        <Box className="formWrp">
            <Box className="formBox" component="form">
                <Box className="container">
                    <Grid spacing={2} container>
                        <Grid item lg={12}>
                            <Box
                                className="logoBox"
                                sx={{
                                    cursor: "pointer",
                                }}
                                onClick={() => navigate("/")}
                            >
                                <img src={logo} alt="logo" />
                            </Box>
                        </Grid>
                        <Grid item lg={12}>
                            <Box className="formTitleText">
                                <Typography variant="h3" sx={{ mb: 2 }}>
                                    Inscrivez-vous à Hermes
                                </Typography>
                                <Typography component={"p"}>
                                    Vous avez déja un compte ?
                                    <Typography
                                        component={Link}
                                        to="/login"
                                        color={"primary"}
                                    >
                                        {" "}
                                        {/* <Link to="/login"> Connexion </Link> */}
                                        Connexion
                                    </Typography>{" "}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid className="signUpFieldContainer" item md={6}>
                            <FormControl fullWidth>
                                <TextField
                                    fullWidth
                                    size="medium"
                                    label="Nom"
                                    name="name1"
                                    value={values.name1}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.name1 && !!errors.name1}
                                />
                            </FormControl>
                        </Grid>
                        <Grid className="signUpFieldContainer" item md={6}>
                            <FormControl fullWidth>
                                <TextField
                                    fullWidth
                                    size="medium"
                                    label="Prénom"
                                    name="name2"
                                    value={values.name2}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.name2 && !!errors.name2}
                                />
                            </FormControl>
                        </Grid>
                        {touched.name1 && !!errors.name1 && (
                            <FormHelperText error>
                                {errors.name1}
                            </FormHelperText>
                        )}
                        {touched.name2 && !!errors.name2 && (
                            <FormHelperText error>
                                {errors.name2}
                            </FormHelperText>
                        )}
                        <Grid className="signUpFieldContainer" item lg={12}>
                            <FormControl fullWidth>
                                <InputLabel
                                    id="demo-simple-select-label"
                                    error={
                                        touched.function && !!errors.function
                                    }
                                >
                                    Fonction
                                </InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Fonction"
                                    name="function"
                                    value={values.function}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={
                                        touched.function && !!errors.function
                                    }
                                >
                                    {selectMenuOptions.map((option) => (
                                        <MenuItem
                                            key={option.label}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {touched.function && !!errors.function && (
                                    <FormHelperText error>
                                        {errors.function}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid className="signUpFieldContainer" item lg={12}>
                            <FormControl fullWidth>
                                <TextField
                                    className="signUpField"
                                    size="medium"
                                    label="Adresse mail"
                                    name="email"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.email && !!errors.email}
                                />
                                {touched.email && !!errors.email && (
                                    <FormHelperText error>
                                        {errors.email}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item className="signUpFieldContainer" lg={12}>
                            <FormControl fullWidth>
                                <TextField
                                    className="signUpField"
                                    size="medium"
                                    type="number"
                                    label="Téléphone"
                                    name="phone"
                                    value={values.phone}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.phone && !!errors.phone}
                                />
                                {touched.phone && !!errors.phone && (
                                    <FormHelperText error>
                                        {errors.phone}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item className="signUpFieldContainer" lg={12}>
                            <FormControl fullWidth>
                                <TextField
                                    size="medium"
                                    label="Mot de passe"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={
                                        touched.password && !!errors.password
                                    }
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() =>
                                                        setShowPassword(
                                                            !showPassword
                                                        )
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
                                {touched.password && !!errors.password && (
                                    <FormHelperText error>
                                        {errors.password}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid className="signUpFieldContainer" item lg={12}>
                            <LoadingButton
                                endIcon={<img src={""} alt="" />}
                                fullWidth
                                className="signUpBtn"
                                variant="contained"
                                color="primary"
                                onClick={submitForm}
                                disabled={!isValid}
                                loading={loading}
                            >
                                <Typography>Créer mon compte</Typography>
                            </LoadingButton>
                        </Grid>
                        <Grid item lg={12}>
                            <Typography
                                className="signUpBottomText"
                                color={"textSecondary"}
                            >
                                En m’inscrivant, j’accepte les{" "}
                                <Typography
                                    component={"a"}
                                    color={"textPrimary"}
                                    sx={{ cursor: "pointer" }}
                                >
                                    Conditions d’utilisation et la politique de
                                    confidentialité.
                                </Typography>
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Box className="formImage">
                <img src={loginBG} alt="" />
            </Box>
        </Box>
    );
};

export default Signup;
