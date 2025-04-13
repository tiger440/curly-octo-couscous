import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LoadingButton from "@mui/lab/LoadingButton";
import {
    Box,
    FormControl,
    FormHelperText,
    Grid,
    TextField,
    Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
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
import "./login.scss";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { userData } = useAppSelector((state) => state.auth);

    const loginDataFormik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validateOnMount: true,
        validationSchema: Yup.object().shape({
            email: Yup.string()
                .required("Veuillez entrer votre email")
                .matches(
                    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    "Le courriel est invalide"
                ),
            password: Yup.string()
                .trim()
                .required("s'il vous plait entrez votre mot de passe"),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            await signInWithEmailAndPassword(
                auth,
                values.email,
                values.password
            )
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
                    toast.error(`${err.message}`);
                });
        },
    });

    const {
        values,
        errors,
        touched,
        isValid,
        handleBlur,
        handleChange,
        submitForm,
    } = loginDataFormik;

    useEffect(() => {
        if (userData) {
            navigate("/valuation");
        }
    }, [userData]);

    return (
        <Box className="formWrp">
            <Box className="formBox" component="form">
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
                            <Typography variant="h3">
                                Connexion à Hermes
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid className="signUpFieldContainer" item md={12}>
                        <FormControl fullWidth>
                            <TextField
                                size="medium"
                                name="email"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                label="Adresse mail"
                                error={touched.email && !!errors.email}
                            />
                            {touched.email && !!errors.email && (
                                <FormHelperText error>
                                    {errors.email}
                                </FormHelperText>
                            )}
                        </FormControl>
                    </Grid>
                    <Grid className="signUpFieldContainer" item lg={12}>
                        <FormControl fullWidth>
                            <TextField
                                size="medium"
                                name="password"
                                label="Mot de passe"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                type={showPassword ? "text" : "password"}
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
                                error={touched.password && !!errors.password}
                            />
                            {touched.password && !!errors.password && (
                                <FormHelperText error>
                                    {errors.password}
                                </FormHelperText>
                            )}
                        </FormControl>
                    </Grid>
                    <Grid item className="signUpFieldContainer" lg={12}>
                        <Typography
                            color={"textPrimary"}
                            className="forgotPass"
                            component={Link}
                            to="/signup"
                        >
                            {" "}
                            Vous n'avez pas encore de compte ?{" "}
                        </Typography>
                        <Typography
                            color={"textPrimary"}
                            className="forgotPass"
                            component={Link}
                            to="/forget-password"
                        >
                            {" "}
                            Mot de passe oublié ?{" "}
                        </Typography>
                    </Grid>
                    <Grid item className="signUpFieldContainer" lg={12}>
                        <LoadingButton
                            endIcon={<img src={""} alt="" />}
                            fullWidth
                            className="loginButton"
                            variant="contained"
                            onClick={submitForm}
                            color="primary"
                            loading={loading}
                            disabled={!isValid}
                        >
                            <Box className="content">
                                <Typography>Connexion</Typography>
                                <ChevronRightIcon />
                            </Box>
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Box>
            <Box className="formImage">
                <img src={loginBG} alt="" />
            </Box>
        </Box>
    );
};

export default Login;
