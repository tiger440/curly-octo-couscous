import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    OutlinedInput,
    Tooltip,
    Typography,
    useTheme,
    TooltipProps,
} from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import endIcon from "../../../../assets/end-icon.svg";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import { useDispatch } from "react-redux";
import { addRatingData } from "src/store/slices/enterpriseForm";
import { useAppSelector } from "src/hooks/use-app-selector";
import { useEffect } from "react";
import { RatingDetails } from "src/utils/types/enterpriseForm";
import NumberFormatCustom from "../NumberFormatCustom";
import { styled } from "@mui/material/styles";

const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
    '& .MuiTooltip-tooltip': {
        backgroundColor: '#f5f5f5',
        color: '#000000',
        fontSize: '0.875rem',
        padding: '8px 12px',
        maxWidth: 500,
        border: '1px solid #e0e0e0',
    },
}));

const Step3 = ({ handleNextStep }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { ratingDetails } = useAppSelector((state) => state.enterpriseForm);
    const formik = useFormik({
        initialValues: {
            VNCOfNonActiveFixedAssets: "",
            realValueOfProperties: "",
            equity: "",
            dividendDistributionsNp1: "",
        } as RatingDetails,
        validateOnMount: true,
        validationSchema: Yup.object().shape({
            VNCOfNonActiveFixedAssets: Yup.number()
                .typeError("Doit être un numéro")
                .required("VNC est requis"),
            realValueOfProperties: Yup.number()
                .typeError("Doit être un numéro")
                .required("Valeur réelle des propriétés requise"),
            equity: Yup.number()
                .typeError("Doit être un numéro")
                .required("Équité requis"),
            dividendDistributionsNp1: Yup.number()
                .typeError("Doit être un numéro")
                .required("Distributions de dividendes requises"),
        }),
        onSubmit: (values) => {
            dispatch(
                addRatingData({
                    ...values,
                })
            );
            handleNextStep();
        },
    });

    const {
        values,
        touched,
        errors,
        isValid,
        handleBlur,
        handleChange,
        submitForm,
        setValues,
    } = formik;

    useEffect(() => {
        if (Object.keys(ratingDetails).length > 0) {
            setValues({
                ...ratingDetails,
            });
        }
    }, [ratingDetails]);

    return (
        <>
            <Box
                className="stepperData"
                sx={{ backgroundColor: theme.palette.grey["0"] }}
            >
                <Box className="titleTop">
                    <Typography variant="h4" sx={{ color: "primary.main" }}>
                        Évaluation de la société
                    </Typography>
                    <Typography>
                        Afin de garantir la fiabilité de la valorisation,
                        veuillez répondre aux questions suivantes de manière la
                        plus objective possible
                    </Typography>
                </Box>
                <Box className="formBox" component="form">
                    <Grid container spacing={2}>
                        <Grid item xl={4} lg={4} md={12} xs={12}>
                            <Typography
                                variant="h5"
                                color="textPrimary"
                                className="formLabel"
                            >
                                VNC des immobilisations hors activité
                                <StyledTooltip
                                    className="tooltip"
                                    title={<div>
                                        La VNC des immobilisations hors activité concerne :<br/><br/>
                                        Éléments concernés :<br/>
                                        • Biens immobiliers non exploités<br/>
                                        • Participations financières<br/>
                                        • Brevets non utilisés<br/><br/>
                                        Importance :<br/>
                                        • Impact sur la valorisation<br/>
                                        • Actifs potentiellement cessibles<br/>
                                        • Ressources non opérationnelles
                                    </div>}
                                    placement="right"
                                >
                                    <InfoRoundedIcon
                                        className="tooltipIcon"
                                        sx={{
                                            color: theme.palette.grey["500"],
                                        }}
                                        fontSize="small"
                                    />
                                </StyledTooltip>
                            </Typography>
                            <Typography
                                variant="caption"
                                color={"textSecondary"}
                            >
                                (biens immos, participation, brevet) (clôture N)
                            </Typography>
                        </Grid>
                        <Grid item xl={8} lg={8} md={12} xs={12}>
                            <FormControl fullWidth>
                                <InputLabel
                                    error={
                                        touched.VNCOfNonActiveFixedAssets &&
                                        !!errors.VNCOfNonActiveFixedAssets
                                    }
                                >
                                    VNC des immobilisations hors activité
                                </InputLabel>
                                <OutlinedInput
                                    inputComponent={NumberFormatCustom}
                                    label=" VNC des immobilisations hors activité"
                                    size="medium"
                                    fullWidth
                                    type="number"
                                    name="VNCOfNonActiveFixedAssets"
                                    value={values.VNCOfNonActiveFixedAssets}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={
                                        touched.VNCOfNonActiveFixedAssets &&
                                        !!errors.VNCOfNonActiveFixedAssets
                                    }
                                />
                                {touched.VNCOfNonActiveFixedAssets &&
                                    !!errors.VNCOfNonActiveFixedAssets && (
                                        <FormHelperText error>
                                            {errors.VNCOfNonActiveFixedAssets}
                                        </FormHelperText>
                                    )}

                                {/* <FormHelperText
                      id="component-helper-text"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        color: theme.palette.warning.main,
                      }}
                    >
                      <Tooltip title="Add" placement="top">
                        <InfoRoundedIcon fontSize="small" />
                      </Tooltip>
                      Caption text, description, notification
                    </FormHelperText> */}
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ mt: 3 }}>
                        <Grid item xl={4} lg={4} md={12} xs={12}>
                            <Typography
                                variant="h5"
                                color="textPrimary"
                                className="formLabel"
                            >
                                Valeur réelle des immos hors activité
                            </Typography>
                            <Typography
                                variant="caption"
                                color={"textSecondary"}
                            >
                                (biens immos, participation, brevet) (clôture N)
                            </Typography>
                        </Grid>
                        <Grid item xl={8} lg={8} md={12} xs={12}>
                            <FormControl fullWidth>
                                <InputLabel
                                    error={
                                        touched.realValueOfProperties &&
                                        !!errors.realValueOfProperties
                                    }
                                >
                                    Valeur réelle des immos hors activité
                                </InputLabel>
                                <OutlinedInput
                                    inputComponent={NumberFormatCustom}
                                    label="Valeur réelle des immos hors activité"
                                    size="medium"
                                    fullWidth
                                    type="number"
                                    name="realValueOfProperties"
                                    value={values.realValueOfProperties}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={
                                        touched.realValueOfProperties &&
                                        !!errors.realValueOfProperties
                                    }
                                />
                                {touched.realValueOfProperties &&
                                    !!errors.realValueOfProperties && (
                                        <FormHelperText error>
                                            {errors.realValueOfProperties}
                                        </FormHelperText>
                                    )}

                                {/* <FormHelperText
                      id="component-helper-text"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        color: theme.palette.warning.main,
                      }}
                    >
                      <Tooltip title="Add" placement="top">
                        <InfoRoundedIcon fontSize="small" />
                      </Tooltip>
                      Caption text, description, notification
                    </FormHelperText> */}
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ mt: 3 }}>
                        <Grid item xl={4} lg={4} md={12} xs={12}>
                            <Typography
                                variant="h5"
                                color="textPrimary"
                                className="formLabel"
                            >
                                Capitaux propres
                                <StyledTooltip
                                    className="tooltip"
                                    title={<div>
                                        Les capitaux propres représentent :<br/><br/>
                                        Composition :<br/>
                                        • Capital social<br/>
                                        • Réserves accumulées<br/>
                                        • Résultats non distribués<br/><br/>
                                        Importance :<br/>
                                        • Mesure la solidité financière<br/>
                                        • Indique la valeur comptable<br/>
                                        • Base pour l'évaluation
                                    </div>}
                                    placement="right"
                                >
                                    <InfoRoundedIcon
                                        className="tooltipIcon"
                                        sx={{
                                            color: theme.palette.grey["500"],
                                        }}
                                        fontSize="small"
                                    />
                                </StyledTooltip>
                            </Typography>
                            <Typography
                                variant="caption"
                                color={"textSecondary"}
                            >
                                clôture N
                            </Typography>
                        </Grid>
                        <Grid item xl={8} lg={8} md={12} xs={12}>
                            <FormControl fullWidth>
                                <InputLabel
                                    error={touched.equity && !!errors.equity}
                                >
                                    Capitaux propres
                                </InputLabel>
                                <OutlinedInput
                                    inputComponent={NumberFormatCustom}
                                    label="Capitaux propres"
                                    size="medium"
                                    fullWidth
                                    type="number"
                                    name="equity"
                                    value={values.equity}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.equity && !!errors.equity}
                                />
                                {touched.equity && !!errors.equity && (
                                    <FormHelperText error>
                                        {errors.equity}
                                    </FormHelperText>
                                )}

                                {/* <FormHelperText
                      id="component-helper-text"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        color: theme.palette.error.main
                      }}
                    >
                      <Tooltip title="Add" placement="top">
                        <InfoRoundedIcon fontSize="small" />
                      </Tooltip>
                      Caption text, description, notification
                    </FormHelperText> */}
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ mt: 3 }}>
                        <Grid item xl={4} lg={4} md={12} xs={12}>
                            <Typography
                                variant="h5"
                                color="textPrimary"
                                className="formLabel"
                            >
                                Dividendes à retraiter
                                <StyledTooltip
                                    className="tooltip"
                                    title={<div>
                                        Les dividendes à retraiter concernent :<br/><br/>
                                        Impact :<br/>
                                        • Réduction de la valeur d'entreprise<br/>
                                        • Ajustement nécessaire post-clôture<br/>
                                        • Effet sur la trésorerie<br/><br/>
                                        Importance du retraitement :<br/>
                                        • Évaluation plus précise<br/>
                                        • Prise en compte des distributions<br/>
                                        • Cohérence temporelle
                                    </div>}
                                    placement="right"
                                >
                                    <InfoRoundedIcon
                                        className="tooltipIcon"
                                        sx={{
                                            color: theme.palette.grey["500"],
                                        }}
                                        fontSize="small"
                                    />
                                </StyledTooltip>
                            </Typography>
                            <Typography
                                variant="caption"
                                color={"textSecondary"}
                            >
                                Distributions de dividendes depuis l'ouverture
                                N+1 (clôture N)
                            </Typography>
                        </Grid>
                        <Grid item xl={8} lg={8} md={12} xs={12}>
                            <FormControl fullWidth>
                                <InputLabel
                                    error={
                                        touched.dividendDistributionsNp1 &&
                                        !!errors.dividendDistributionsNp1
                                    }
                                >
                                    Distributions de dividendes depuis
                                    l'ouverture N+1
                                </InputLabel>
                                <OutlinedInput
                                    inputComponent={NumberFormatCustom}
                                    label="Distributions de dividendes depuis l'ouverture N+1"
                                    size="medium"
                                    fullWidth
                                    type="number"
                                    name="dividendDistributionsNp1"
                                    value={values.dividendDistributionsNp1}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={
                                        touched.dividendDistributionsNp1 &&
                                        !!errors.dividendDistributionsNp1
                                    }
                                />
                                {touched.dividendDistributionsNp1 &&
                                    !!errors.dividendDistributionsNp1 && (
                                        <FormHelperText error>
                                            {errors.dividendDistributionsNp1}
                                        </FormHelperText>
                                    )}
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>
                <Box className="formFooter">
                    <Button
                        endIcon={<img src={endIcon} alt="" />}
                        variant="contained"
                        color="secondary"
                        onClick={submitForm}
                        disabled={!isValid}
                    >
                        Suivant
                    </Button>
                </Box>
            </Box>
        </>
    );
};

export default Step3;
