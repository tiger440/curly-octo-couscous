import { Box, FormControl, FormHelperText, IconButton, InputAdornment, TextField, Tooltip, Typography, useTheme } from "@mui/material";
import { auth } from "src/firebase/firebase";
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import icEmailSent from "../../assets/ic-email-sent.svg";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "./ResetPassword.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";


const ResetPassword = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const resetPasswordFormik = useFormik({
        initialValues: {
            password: "",
            confirmPassword: "",
        },
        validateOnMount: true,
        validationSchema: Yup.object().shape({
            password: Yup.string().required("s'il vous plait entrez votre mot de passe").trim()
                .min(8, "Un minimum de 8 caractères est requis")
                .matches(/[a-z]/, "Inclure un alphabet non majuscule")
                .matches(/[A-Z]/, "Inclure un alphabet majuscule")
                .matches(/[1-9]/, "Inclure des chiffres")
                .matches(/[!@#$%^&*()]/, "Inclure les caractères spéciaux")
                .required("Veuillez entrer le mot de passe"),
            confirmPassword: Yup.string().trim().oneOf([Yup.ref('password')], "é mot de passe ne correspond pas").required("Veuillez entrer le mot de passe")
        }),
        onSubmit: async (values, { setStatus, setSubmitting }) => {
            const useSearchParams = new URLSearchParams(window.location.search);
            const oobCode = useSearchParams.get('oobCode');

            if (oobCode) {
                try {
                    setLoading(true)
                    await verifyPasswordResetCode(auth, oobCode);
                    await confirmPasswordReset(auth, oobCode, values.password).then(() => navigate('/login'));
                    setLoading(false)
                } catch (error) {
                    setLoading(false)
                    setStatus("Error resetting password. Please try again.");
                    toast.error(`${error.message}`);
                }
            }
            setSubmitting(false);
        }
    })

    const { values, errors, touched, isValid, handleBlur, handleChange, submitForm } = resetPasswordFormik


    const handleTogglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    }
    const handleToggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword((prevShowPassword) => !prevShowPassword);
    }


    return (
        <div>
            <Box>
                <Box className="contentWrp">
                    <Box className="passwordBox">
                        <Box
                            className="icon"
                            sx={{
                                mx: "auto",
                                mb: 4,
                            }}
                        >
                            <img src={icEmailSent} alt="" />
                        </Box>
                        <Typography variant="h3" className="passTextmain" sx={{ mb: 1 }}>
                            Réinitialisation de mot de passe
                        </Typography>

                        <Typography
                            component={"p"}
                            className="passSubText"
                            color={"textSecondary"}
                            sx={{ mb: 3 }}
                        >
                            Définissez votre nouveau mot de passe afin de pouvoir utiliser notre
                            plateforme.
                        </Typography>
                        <Box>
                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <TextField
                                    size="medium"
                                    label="Mot de passe"
                                    name="password"
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.password && !!errors.password}
                                    type={showPassword ? "text" : "password"}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleTogglePasswordVisibility}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
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
                                <FormHelperText
                                    id="component-helper-text"
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                    }}
                                >
                                    <Tooltip
                                        title="Add"
                                        placement="top"
                                        sx={{ color: theme.palette.text.secondary }}
                                    >
                                        <InfoRoundedIcon fontSize="small" />
                                    </Tooltip>
                                    <Typography variant="caption">
                                        Le mot de passe doit contenir au minimum 8 caractères dont un
                                        chiffre, une majuscule et un caractère spécial.
                                    </Typography>
                                </FormHelperText>
                            </FormControl>
                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <TextField
                                    size="medium"
                                    label="Confirmez le nouveau mot de passe"
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={values.confirmPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.confirmPassword && !!errors.confirmPassword}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleToggleConfirmPasswordVisibility}
                                                    edge="end"
                                                >
                                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                {/* <FormHelperText
                                    id="component-helper-text"
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                    }}
                                    >
                                    <Tooltip
                                        title="Add"
                                        placement="top"
                                        sx={{ color: theme.palette.text.secondary }}
                                    >
                                        <InfoRoundedIcon fontSize="small" />
                                    </Tooltip>
                                    <Typography variant="caption">
                                        Le mot de passe doit contenir au minimum 8 caractères dont un
                                        chiffre, une majuscule et un caractère spécial.
                                    </Typography>
                                    </FormHelperText> */}
                                {touched.confirmPassword && !!errors.confirmPassword && (
                                    <FormHelperText error>
                                        {errors.confirmPassword}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Box>
                        <LoadingButton
                            className="passButton"
                            disabled={!isValid}
                            color="primary"
                            onClick={submitForm}
                            fullWidth
                            variant="contained"
                            loading={loading}
                        >
                            Réinitialiser le mot de passe
                        </LoadingButton>
                    </Box>
                </Box>
            </Box>
        </div>
    )
}

export default ResetPassword
