import {
  AppBar,
  Box,
  FormControl,
  FormHelperText,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import logoIcon from "../../assets/HERMES-ICON.svg";
import leftArrow from "../../assets/arrow-back.svg";
import icPassword from "../../assets/ic-password.svg";
import icEmailSent from "../../assets/ic-email-sent.svg";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "src/firebase/firebase";
import "./ForgetPassword.scss";
import { toast } from "react-toastify";
import React, { useState } from "react";

import * as Yup from "yup";
import { useFormik } from "formik";

const ForgetPassword = () => {
  const theme = useTheme();
  const [isPasswordResetScreenVisible, setIsPasswordResetScreenVisible] =
    useState(true);
  const [loading, setLoading] = useState(false);

  const forgetPasswordFormik = useFormik({
    initialValues: {
      email: "",
    },
    validateOnMount: true,
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .required("Veuillez entrer votre email")
        .matches(
          /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
          "Le courriel est invalide"
        ),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        sendPasswordResetEmail(auth, values.email)
          .then(() => {
            setIsPasswordResetScreenVisible(false);
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
            toast.error(`${err.message}`);
          });
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
    handleBlur,
    handleChange,
    submitForm,
  } = forgetPasswordFormik;

  return (
    <Box>
      <AppBar className="headerIcon" position="static">
        <Box className="icon">
          <img src={logoIcon} alt="" />
        </Box>
      </AppBar>
      {isPasswordResetScreenVisible && (
        <Box className="contentWrp">
          <Box className="passwordBox">
            <Box
              className="icon"
              sx={{
                mx: "auto",
                mb: 4,
              }}
            >
              <img src={icPassword} alt="" />
            </Box>
            <Typography
              variant="h3"
              className="passTextmain"
              sx={{ mb: 1 }}
            >
              Mot de passe oublié ?
            </Typography>

            <Typography
              component={"p"}
              className="passSubText"
              color={"textSecondary"}
              sx={{ mb: 3 }}
            >
              Saisissez l'adresse mail associée à votre compte et
              nous vous enverrons un lien pour réinitialiser votre
              mot de passe.
            </Typography>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <TextField
                id="outlined-basic"
                label="Adresse mail"
                variant="outlined"
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
            <LoadingButton
              endIcon={<img src={""} alt="" />}
              className="passButton"
              disabled={!isValid}
              color="primary"
              fullWidth
              variant="contained"
              loading={loading}
              onClick={submitForm}
            >
              Envoyer
            </LoadingButton>
            <Typography width={'100%'} mt={3} display={'flex'} gap={0.5} alignItems={'center'} justifyContent={'end'} color={'#212B36'} fontSize={'14px'}> <img src={leftArrow} alt="" /> retour à la page Connexion</Typography>

          </Box>
        </Box>

      )}
      {!isPasswordResetScreenVisible && (
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
            <Typography
              variant="h3"
              className="passTextmain"
              sx={{ mb: 1 }}
            >
              Réinitialisation de mot de passe
            </Typography>

            <Typography
              component={"p"}
              className="passSubText"
              color={"textSecondary"}
              sx={{ mb: 3 }}
            >
              Nous avons envoyé un e-mail de réinitialisation à
              votre adresse e-mail. Cliquez sur le lien pour
              mettre à jour votre mot de passe.
            </Typography>
            <Typography
              className="bottomText"
              component={"p"}
              color={"textPrimary"}
            >
              Vous n’avez rien reçu ?{" "}
              <Typography
                component={"a"}
                onClick={() =>
                  sendPasswordResetEmail(auth, values.email)
                    .then(() => {
                      return (
                        setIsPasswordResetScreenVisible(
                          false
                        ),
                        toast.success(
                          "Merci de consulter vos emails"
                        )
                      );
                    })
                    .catch((err) =>
                      toast.error(`${err.message}`)
                    )
                }
                sx={{
                  color: theme.palette.primary.main,
                  cursor: "pointer",
                }}
              >
                Envoyer à nouveau
              </Typography>{" "}
            </Typography>
          </Box>
        </Box>
      )}

      {/* <Box className="contentWrp">
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
            Réinitialisation de mot de passe /retour à la page Connexion
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
          </Box>
          <Button
            className="passButton"
            disabled
            color="primary"
            fullWidth
            variant="contained"
          >
            Réinitialiser le mot de passe
          </Button>
        </Box>
      </Box> */}
    </Box>
  );
};

export default ForgetPassword;
