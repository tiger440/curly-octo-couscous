import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Tooltip,
    Typography,
    useTheme,
    TooltipProps,
} from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import endIcon from "../../../../assets/end-icon.svg";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import {
    addEbidtaData,
    addGoodwillData,
} from "src/store/slices/enterpriseForm";
import { useAppSelector } from "src/hooks/use-app-selector";
import { useEffect } from "react";
import { Retraitement, YearsDataType } from "src/utils/types/enterpriseForm";
import NumberFormatCustom from "../NumberFormatCustom";
import styled from "@emotion/styled";

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

const Step2 = ({ handleNextStep }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { hasGoodwill, ebidtaDetails } = useAppSelector((state) => state.enterpriseForm);

    //==> Yup-formik validation <==
    const goodwillDataFormik = useFormik({
        initialValues: {
            goodwill: {
                n: "",
                n1: "",
                n2: "",
            } as YearsDataType,
            ebidta: {
                achats: {
                    n: "",
                    n1: "",
                    n2: "",
                },
                chargesExternes: {
                    n: "",
                    n1: "",
                    n2: "",
                },
                chargesDuPersonnel: {
                    n: "",
                    n1: "",
                    n2: "",
                },
                autresChargesExploitation: {
                    n: "",
                    n1: "",
                    n2: "",
                },
            },
        },
        validateOnMount: true,
        validationSchema: Yup.object().shape({
            goodwill: Yup.object().shape({
                n: Yup.number()
                    .typeError("Doit être un numéro")
                    .required("Champs requis"),
                n1: Yup.number()
                    .typeError("Doit être un numéro")
                    .required("Champs requis"),
                n2: Yup.number()
                    .typeError("Doit être un numéro")
                    .required("Champs requis"),
            }),
            ebidta: Yup.object().shape({
                achats: Yup.object().shape({
                    n: Yup.number()
                        .typeError("Doit être un numéro")
                        .required("Champs requis"),
                    n1: Yup.number()
                        .typeError("Doit être un numéro")
                        .required("Champs requis"),
                    n2: Yup.number()
                        .typeError("Doit être un numéro")
                        .required("Champs requis"),
                }),
                chargesExternes: Yup.object().shape({
                    n: Yup.number()
                        .typeError("Doit être un numéro")
                        .required("Champs requis"),
                    n1: Yup.number()
                        .typeError("Doit être un numéro")
                        .required("Champs requis"),
                    n2: Yup.number()
                        .typeError("Doit être un numéro")
                        .required("Champs requis"),
                }),
                chargesDuPersonnel: Yup.object().shape({
                    n: Yup.number()
                        .typeError("Doit être un numéro")
                        .required("Champs requis"),
                    n1: Yup.number()
                        .typeError("Doit être un numéro")
                        .required("Champs requis"),
                    n2: Yup.number()
                        .typeError("Doit être un numéro")
                        .required("Champs requis"),
                }),
                autresChargesExploitation: Yup.object().shape({
                    n: Yup.number()
                        .typeError("Doit être un numéro")
                        .required("Champs requis"),
                    n1: Yup.number()
                        .typeError("Doit être un numéro")
                        .required("Champs requis"),
                    n2: Yup.number()
                        .typeError("Doit être un numéro")
                        .required("Champs requis"),
                }),
            }),
        }),

        onSubmit: (values) => {
            dispatch(
                addGoodwillData({
                    ...values,
                })
            );
        },
    });

    const restatementEbidtaFormik = useFormik({
        initialValues: {
            retraitement: {
                remuneration: {
                    n: "",
                    n1: "",
                    n2: "",
                },
                normalRemuneration: {
                    n: "",
                    n1: "",
                    n2: "",
                },
            } as Retraitement,
        },
        validateOnMount: true,
        validationSchema: Yup.object().shape({
            retraitement: Yup.object().shape({
                remuneration: Yup.object().shape({
                    n: Yup.number()
                        .typeError("Doit être un numéro")
                        .required("Champs requis"),
                    n1: Yup.number()
                        .typeError("Doit être un numéro")
                        .required("Champs requis"),
                    n2: Yup.number()
                        .typeError("Doit être un numéro")
                        .required("Champs requis"),
                }),
                normalRemuneration: Yup.object().shape({
                    n: Yup.number()
                        .typeError("Doit être un numéro")
                        .required("Champs requis"),
                    n1: Yup.number()
                        .typeError("Doit être un numéro")
                        .required("Champs requis"),
                    n2: Yup.number()
                        .typeError("Doit être un numéro")
                        .required("Champs requis"),
                }),
            }),
        }),
        onSubmit: (values) => {
            dispatch(
                addEbidtaData({
                    ...values,
                })
            );
            handleNextStep();
        },
    });

    useEffect(() => {
        if (Object.keys(ebidtaDetails).length > 0) {
            if (ebidtaDetails.goodwill && ebidtaDetails.ebidta) {
                goodwillDataFormik.setValues({
                    goodwill: { ...ebidtaDetails.goodwill },
                    ebidta: { ...ebidtaDetails.ebidta } as any,
                });
            }

            if (ebidtaDetails.retraitement) {
                restatementEbidtaFormik.setValues({
                    retraitement: { ...ebidtaDetails.retraitement },
                });
            }
        }
    }, [ebidtaDetails]);


    return (
        <>
            {!hasGoodwill && (
                <Box
                    className="stepperData"
                    sx={{ backgroundColor: theme.palette.grey["0"] }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box className="titleTop">
                                <Typography
                                    variant="h4"
                                    sx={{ color: "primary.main" }}
                                >
                                    Évaluation fonds de commerce - Visualisation des données brutes
                                </Typography>
                                <Typography>
                                    Veuillez controler les données qui ont été récupérées du FEC.
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item lg={12} xs={12}>
                            <Box className="formBox" component="form">
                                <Grid container spacing={2}>
                                    <Grid item xl={4} lg={4} md={12} xs={12}>
                                        <Typography
                                            variant="h5"
                                            color="textPrimary"
                                            className="formLabel"
                                        >
                                            Calcul de l'EBIDTA
                                            <StyledTooltip
                                                className="tooltip"
                                                title={<div>
                                                    L'EBITDA est un indicateur clé de performance :<br/><br/>
                                                    Il mesure :<br/>
                                                    • La rentabilité opérationnelle pure<br/>
                                                    • La performance avant éléments financiers<br/>
                                                    • La capacité à générer du cash<br/><br/>
                                                    Avantages :<br/>
                                                    • Comparaison entre entreprises facilitée<br/>
                                                    • Vision claire de la performance<br/>
                                                    • Indépendant du mode de financement
                                                </div>}
                                                placement="right"
                                            >
                                                <InfoRoundedIcon
                                                    className="tooltipIcon"
                                                    sx={{
                                                        color: theme.palette
                                                            .grey["500"],
                                                    }}
                                                    fontSize="small"
                                                />
                                            </StyledTooltip>
                                        </Typography>
                                        
                                    </Grid>
                                    <Grid item xl={8} lg={8} md={12} xs={12}>
                                        <Grid container spacing={2}>
                                        <Grid
                                                item
                                                xl={12}
                                                lg={12}
                                                md={12}
                                                xs={12}
                                            >
                                                <Typography
                                                    className="customLabel"
                                                    color={"textSecondary"}
                                                >
                                                    Chiffre d'affaires
                                                </Typography>
                                            </Grid>
                                            <Grid
                                                item
                                                xl={4}
                                                lg={4}
                                                md={12}
                                                xs={12}
                                            >
                                                <FormControl fullWidth>
                                                    <InputLabel
                                                        error={
                                                            goodwillDataFormik
                                                                .touched
                                                                .goodwill?.n &&
                                                            !!goodwillDataFormik
                                                                .errors.goodwill
                                                                ?.n
                                                        }
                                                    >
                                                        N
                                                    </InputLabel>
                                                    <OutlinedInput
                                                        inputComponent={
                                                            NumberFormatCustom
                                                        }
                                                        fullWidth
                                                        label="N"
                                                        size="medium"
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                €
                                                            </InputAdornment>
                                                        }
                                                        type="number"
                                                        name="goodwill.n"
                                                        value={
                                                            goodwillDataFormik
                                                                .values.goodwill
                                                                .n
                                                        }
                                                        onChange={(...a) => {
                                                            goodwillDataFormik.handleChange(
                                                                ...a
                                                            );
                                                        }}
                                                        onBlur={
                                                            goodwillDataFormik.handleBlur
                                                        }
                                                        error={
                                                            goodwillDataFormik
                                                                .touched
                                                                .goodwill?.n &&
                                                            !!goodwillDataFormik
                                                                .errors.goodwill
                                                                ?.n
                                                        }
                                                    />
                                                    {goodwillDataFormik.touched
                                                        .goodwill?.n &&
                                                        !!goodwillDataFormik
                                                            .errors.goodwill
                                                            ?.n && (
                                                            <FormHelperText
                                                                error
                                                            >
                                                                {
                                                                    goodwillDataFormik
                                                                        .errors
                                                                        .goodwill
                                                                        .n
                                                                }
                                                            </FormHelperText>
                                                        )}
                                                </FormControl>
                                            </Grid>
                                            <Grid
                                                item
                                                xl={4}
                                                lg={4}
                                                md={12}
                                                xs={12}
                                            >
                                                <FormControl fullWidth>
                                                    <InputLabel
                                                        error={
                                                            goodwillDataFormik
                                                                .touched
                                                                .goodwill?.n1 &&
                                                            !!goodwillDataFormik
                                                                .errors.goodwill
                                                                ?.n1
                                                        }
                                                    >
                                                        N-1
                                                    </InputLabel>
                                                    <OutlinedInput
                                                        inputComponent={
                                                            NumberFormatCustom
                                                        }
                                                        fullWidth
                                                        label="N-1"
                                                        size="medium"
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                €
                                                            </InputAdornment>
                                                        }
                                                        type="number"
                                                        name="goodwill.n1"
                                                        value={
                                                            goodwillDataFormik
                                                                .values.goodwill
                                                                .n1
                                                        }
                                                        onChange={
                                                            goodwillDataFormik.handleChange
                                                        }
                                                        onBlur={
                                                            goodwillDataFormik.handleBlur
                                                        }
                                                        error={
                                                            goodwillDataFormik
                                                                .touched
                                                                .goodwill?.n1 &&
                                                            !!goodwillDataFormik
                                                                .errors.goodwill
                                                                ?.n1
                                                        }
                                                    />
                                                    {goodwillDataFormik.touched
                                                        .goodwill?.n1 &&
                                                        !!goodwillDataFormik
                                                            .errors.goodwill
                                                            ?.n1 && (
                                                            <FormHelperText
                                                                error
                                                            >
                                                                {
                                                                    goodwillDataFormik
                                                                        .errors
                                                                        .goodwill
                                                                        .n1
                                                                }
                                                            </FormHelperText>
                                                        )}
                                                </FormControl>
                                            </Grid>
                                            <Grid
                                                item
                                                xl={4}
                                                lg={4}
                                                md={12}
                                                xs={12}
                                            >
                                                
                                                <FormControl fullWidth>
                                                    <InputLabel
                                                        error={
                                                            goodwillDataFormik
                                                                .touched
                                                                .goodwill?.n2 &&
                                                            !!goodwillDataFormik
                                                                .errors.goodwill
                                                                ?.n2
                                                        }
                                                    >
                                                        N-2
                                                    </InputLabel>
                                                    <OutlinedInput
                                                        inputComponent={
                                                            NumberFormatCustom
                                                        }
                                                        fullWidth
                                                        label="N-2"
                                                        size="medium"
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                €
                                                            </InputAdornment>
                                                        }
                                                        type="number"
                                                        name="goodwill.n2"
                                                        value={
                                                            goodwillDataFormik
                                                                .values.goodwill
                                                                .n2
                                                        }
                                                        onChange={
                                                            goodwillDataFormik.handleChange
                                                        }
                                                        onBlur={
                                                            goodwillDataFormik.handleBlur
                                                        }
                                                        error={
                                                            goodwillDataFormik
                                                                .touched
                                                                .goodwill?.n2 &&
                                                            !!goodwillDataFormik
                                                                .errors.goodwill
                                                                ?.n2
                                                        }
                                                    />
                                                    {goodwillDataFormik.touched
                                                        .goodwill?.n2 &&
                                                        !!goodwillDataFormik
                                                            .errors.goodwill
                                                            ?.n2 && (
                                                            <FormHelperText
                                                                error
                                                            >
                                                                {
                                                                    goodwillDataFormik
                                                                        .errors
                                                                        .goodwill
                                                                        .n2
                                                                }
                                                            </FormHelperText>
                                                        )}
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} sx={{ mt: 3 }}>
                                    <Grid item xl={4} lg={4} md={12} xs={12}>
                                        
                                    </Grid>
                                    <Grid item xl={8} lg={8} md={12} xs={12}>
                                        <Grid container spacing={2}>
                                            <Grid
                                                item
                                                xl={12}
                                                lg={12}
                                                md={12}
                                                xs={12}
                                            >
                                                <Typography
                                                    className="customLabel"
                                                    color={"textSecondary"}
                                                >
                                                    Achats
                                                </Typography>
                                            </Grid>
                                            <Grid
                                                item
                                                xl={4}
                                                lg={4}
                                                md={12}
                                                xs={12}
                                            >
                                                <FormControl fullWidth>
                                                    <InputLabel
                                                        error={
                                                            goodwillDataFormik
                                                                .touched.ebidta
                                                                ?.achats?.n &&
                                                            !!goodwillDataFormik
                                                                .errors.ebidta
                                                                ?.achats?.n
                                                        }
                                                    >
                                                        N
                                                    </InputLabel>
                                                    <OutlinedInput
                                                        inputComponent={
                                                            NumberFormatCustom
                                                        }
                                                        fullWidth
                                                        label="N"
                                                        size="medium"
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                €
                                                            </InputAdornment>
                                                        }
                                                        type="number"
                                                        name="ebidta.achats.n"
                                                        value={
                                                            goodwillDataFormik
                                                                .values.ebidta
                                                                .achats?.n ?? ""
                                                        }
                                                        onChange={
                                                            goodwillDataFormik.handleChange
                                                        }
                                                        onBlur={
                                                            goodwillDataFormik.handleBlur
                                                        }
                                                        error={
                                                            goodwillDataFormik
                                                                .touched.ebidta
                                                                ?.achats?.n &&
                                                            !!goodwillDataFormik
                                                                .errors.ebidta
                                                                ?.achats?.n
                                                        }
                                                    />
                                                    {goodwillDataFormik.touched
                                                        .ebidta?.achats?.n &&
                                                        !!goodwillDataFormik
                                                            .errors.ebidta
                                                            ?.achats?.n && (
                                                            <FormHelperText
                                                                error
                                                            >
                                                                {
                                                                    goodwillDataFormik
                                                                        .errors
                                                                        .ebidta
                                                                        ?.achats
                                                                        ?.n
                                                                }
                                                            </FormHelperText>
                                                        )}
                                                </FormControl>
                                            </Grid>
                                            <Grid
                                                item
                                                xl={4}
                                                lg={4}
                                                md={12}
                                                xs={12}
                                            >
                                                <FormControl fullWidth>
                                                    <InputLabel
                                                        error={
                                                            goodwillDataFormik
                                                                .touched.ebidta
                                                                ?.achats?.n1 &&
                                                            !!goodwillDataFormik
                                                                .errors.ebidta
                                                                ?.achats?.n1
                                                        }
                                                    >
                                                        N-1
                                                    </InputLabel>
                                                    <OutlinedInput
                                                        inputComponent={
                                                            NumberFormatCustom
                                                        }
                                                        fullWidth
                                                        label="N-1"
                                                        size="medium"
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                €
                                                            </InputAdornment>
                                                        }
                                                        type="number"
                                                        name="ebidta.achats.n1"
                                                        value={
                                                            goodwillDataFormik
                                                                .values.ebidta
                                                                .achats.n1
                                                        }
                                                        onChange={
                                                            goodwillDataFormik.handleChange
                                                        }
                                                        onBlur={
                                                            goodwillDataFormik.handleBlur
                                                        }
                                                        error={
                                                            goodwillDataFormik
                                                                .touched.ebidta
                                                                ?.achats?.n1 &&
                                                            !!goodwillDataFormik
                                                                .errors.ebidta
                                                                ?.achats?.n1
                                                        }
                                                    />
                                                    {goodwillDataFormik.touched
                                                        .ebidta?.achats?.n1 &&
                                                        !!goodwillDataFormik
                                                            .errors.ebidta
                                                            ?.achats?.n1 && (
                                                            <FormHelperText
                                                                error
                                                            >
                                                                {
                                                                    goodwillDataFormik
                                                                        .errors
                                                                        .ebidta
                                                                        ?.achats
                                                                        ?.n1
                                                                }
                                                            </FormHelperText>
                                                        )}
                                                </FormControl>
                                            </Grid>
                                            <Grid
                                                item
                                                xl={4}
                                                lg={4}
                                                md={12}
                                                xs={12}
                                            >
                                                <FormControl fullWidth>
                                                    <InputLabel
                                                        error={
                                                            goodwillDataFormik
                                                                .touched.ebidta
                                                                ?.achats?.n2 &&
                                                            !!goodwillDataFormik
                                                                .errors.ebidta
                                                                ?.achats?.n2
                                                        }
                                                    >
                                                        N-2
                                                    </InputLabel>
                                                    <OutlinedInput
                                                        inputComponent={
                                                            NumberFormatCustom
                                                        }
                                                        fullWidth
                                                        label="N-2"
                                                        size="medium"
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                €
                                                            </InputAdornment>
                                                        }
                                                        type="number"
                                                        name="ebidta.achats.n2"
                                                        value={
                                                            goodwillDataFormik
                                                                .values.ebidta
                                                                .achats.n2
                                                        }
                                                        onChange={
                                                            goodwillDataFormik.handleChange
                                                        }
                                                        onBlur={
                                                            goodwillDataFormik.handleBlur
                                                        }
                                                        error={
                                                            goodwillDataFormik
                                                                .touched.ebidta
                                                                ?.achats?.n2 &&
                                                            !!goodwillDataFormik
                                                                .errors.ebidta
                                                                ?.achats?.n2
                                                        }
                                                    />
                                                    {goodwillDataFormik.touched
                                                        .ebidta?.achats?.n2 &&
                                                        !!goodwillDataFormik
                                                            .errors.ebidta
                                                            ?.achats?.n2 && (
                                                            <FormHelperText
                                                                error
                                                            >
                                                                {
                                                                    goodwillDataFormik
                                                                        .errors
                                                                        .ebidta
                                                                        ?.achats
                                                                        ?.n2
                                                                }
                                                            </FormHelperText>
                                                        )}
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                        <Grid
                                            container
                                            spacing={2}
                                            sx={{ mt: 2 }}
                                        >
                                            <Grid item xs={12}>
                                                <Typography
                                                    className="customLabel"
                                                    color={"textSecondary"}
                                                >
                                                    Charges externes
                                                </Typography>
                                            </Grid>
                                            <Grid
                                                item
                                                xl={4}
                                                lg={4}
                                                md={12}
                                                xs={12}
                                            >
                                                <FormControl fullWidth>
                                                    <InputLabel
                                                        error={
                                                            goodwillDataFormik
                                                                .touched.ebidta
                                                                ?.chargesExternes
                                                                ?.n &&
                                                            !!goodwillDataFormik
                                                                .errors.ebidta
                                                                ?.chargesExternes
                                                                ?.n
                                                        }
                                                    >
                                                        N
                                                    </InputLabel>
                                                    <OutlinedInput
                                                        inputComponent={
                                                            NumberFormatCustom
                                                        }
                                                        fullWidth
                                                        label="N"
                                                        size="medium"
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                €
                                                            </InputAdornment>
                                                        }
                                                        type="number"
                                                        name="ebidta.chargesExternes.n"
                                                        value={
                                                            goodwillDataFormik
                                                                .values.ebidta
                                                                .chargesExternes
                                                                .n
                                                        }
                                                        onChange={
                                                            goodwillDataFormik.handleChange
                                                        }
                                                        onBlur={
                                                            goodwillDataFormik.handleBlur
                                                        }
                                                        error={
                                                            goodwillDataFormik
                                                                .touched.ebidta
                                                                ?.chargesExternes
                                                                ?.n &&
                                                            !!goodwillDataFormik
                                                                .errors.ebidta
                                                                ?.chargesExternes
                                                                ?.n
                                                        }
                                                    />
                                                    {goodwillDataFormik.touched
                                                        .ebidta?.chargesExternes
                                                        ?.n &&
                                                        !!goodwillDataFormik
                                                            .errors.ebidta
                                                            ?.chargesExternes
                                                            ?.n && (
                                                            <FormHelperText
                                                                error
                                                            >
                                                                {
                                                                    goodwillDataFormik
                                                                        .errors
                                                                        .ebidta
                                                                        ?.chargesExternes
                                                                        ?.n
                                                                }
                                                            </FormHelperText>
                                                        )}
                                                </FormControl>
                                            </Grid>
                                            <Grid
                                                item
                                                xl={4}
                                                lg={4}
                                                md={12}
                                                xs={12}
                                            >
                                                <FormControl fullWidth>
                                                    <InputLabel
                                                        error={
                                                            goodwillDataFormik
                                                                .touched.ebidta
                                                                ?.chargesExternes
                                                                ?.n1 &&
                                                            !!goodwillDataFormik
                                                                .errors.ebidta
                                                                ?.chargesExternes
                                                                ?.n1
                                                        }
                                                    >
                                                        N-1
                                                    </InputLabel>
                                                    <OutlinedInput
                                                        inputComponent={
                                                            NumberFormatCustom
                                                        }
                                                        fullWidth
                                                        label="N-1"
                                                        size="medium"
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                €
                                                            </InputAdornment>
                                                        }
                                                        type="number"
                                                        name="ebidta.chargesExternes.n1"
                                                        value={
                                                            goodwillDataFormik
                                                                .values.ebidta
                                                                .chargesExternes
                                                                .n1
                                                        }
                                                        onChange={
                                                            goodwillDataFormik.handleChange
                                                        }
                                                        onBlur={
                                                            goodwillDataFormik.handleBlur
                                                        }
                                                        error={
                                                            goodwillDataFormik
                                                                .touched.ebidta
                                                                ?.chargesExternes
                                                                ?.n1 &&
                                                            !!goodwillDataFormik
                                                                .errors.ebidta
                                                                ?.chargesExternes
                                                                ?.n1
                                                        }
                                                    />
                                                    {goodwillDataFormik.touched
                                                        .ebidta?.chargesExternes
                                                        ?.n1 &&
                                                        !!goodwillDataFormik
                                                            .errors.ebidta
                                                            ?.chargesExternes
                                                            ?.n1 && (
                                                            <FormHelperText
                                                                error
                                                            >
                                                                {
                                                                    goodwillDataFormik
                                                                        .errors
                                                                        .ebidta
                                                                        ?.chargesExternes
                                                                        ?.n1
                                                                }
                                                            </FormHelperText>
                                                        )}
                                                </FormControl>
                                            </Grid>
                                            <Grid
                                                item
                                                xl={4}
                                                lg={4}
                                                md={12}
                                                xs={12}
                                            >
                                                <FormControl fullWidth>
                                                    <InputLabel
                                                        error={
                                                            goodwillDataFormik
                                                                .touched.ebidta
                                                                ?.chargesExternes
                                                                ?.n2 &&
                                                            !!goodwillDataFormik
                                                                .errors.ebidta
                                                                ?.chargesExternes
                                                                ?.n2
                                                        }
                                                    >
                                                        N-2
                                                    </InputLabel>
                                                    <OutlinedInput
                                                        inputComponent={
                                                            NumberFormatCustom
                                                        }
                                                        fullWidth
                                                        label="N-2"
                                                        size="medium"
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                €
                                                            </InputAdornment>
                                                        }
                                                        type="number"
                                                        name="ebidta.chargesExternes.n2"
                                                        value={
                                                            goodwillDataFormik
                                                                .values.ebidta
                                                                .chargesExternes
                                                                .n2
                                                        }
                                                        onChange={
                                                            goodwillDataFormik.handleChange
                                                        }
                                                        onBlur={
                                                            goodwillDataFormik.handleBlur
                                                        }
                                                        error={
                                                            goodwillDataFormik
                                                                .touched.ebidta
                                                                ?.chargesExternes
                                                                ?.n2 &&
                                                            !!goodwillDataFormik
                                                                .errors.ebidta
                                                                ?.chargesExternes
                                                                ?.n2
                                                        }
                                                    />
                                                    {goodwillDataFormik.touched
                                                        .ebidta?.chargesExternes
                                                        ?.n2 &&
                                                        !!goodwillDataFormik
                                                            .errors.ebidta
                                                            ?.chargesExternes
                                                            ?.n2 && (
                                                            <FormHelperText
                                                                error
                                                            >
                                                                {
                                                                    goodwillDataFormik
                                                                        .errors
                                                                        .ebidta
                                                                        ?.chargesExternes
                                                                        ?.n2
                                                                }
                                                            </FormHelperText>
                                                        )}
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                        <Grid
                                            container
                                            spacing={2}
                                            sx={{ mt: 2 }}
                                        >
                                            <Grid item xs={12}>
                                                <Typography
                                                    className="customLabel"
                                                    color={"textSecondary"}
                                                >
                                                    Charges du personnel
                                                </Typography>
                                            </Grid>
                                            <Grid
                                                item
                                                xl={4}
                                                lg={4}
                                                md={12}
                                                xs={12}
                                            >
                                                <FormControl fullWidth>
                                                    <InputLabel
                                                        error={
                                                            goodwillDataFormik
                                                                .touched.ebidta
                                                                ?.chargesDuPersonnel
                                                                ?.n &&
                                                            !!goodwillDataFormik
                                                                .errors.ebidta
                                                                ?.chargesDuPersonnel
                                                                ?.n
                                                        }
                                                    >
                                                        N
                                                    </InputLabel>
                                                    <OutlinedInput
                                                        inputComponent={
                                                            NumberFormatCustom
                                                        }
                                                        fullWidth
                                                        label="N"
                                                        size="medium"
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                €
                                                            </InputAdornment>
                                                        }
                                                        type="number"
                                                        name="ebidta.chargesDuPersonnel.n"
                                                        value={
                                                            goodwillDataFormik
                                                                .values.ebidta
                                                                .chargesDuPersonnel
                                                                .n
                                                        }
                                                        onChange={
                                                            goodwillDataFormik.handleChange
                                                        }
                                                        onBlur={
                                                            goodwillDataFormik.handleBlur
                                                        }
                                                        error={
                                                            goodwillDataFormik
                                                                .touched.ebidta
                                                                ?.chargesDuPersonnel
                                                                ?.n &&
                                                            !!goodwillDataFormik
                                                                .errors.ebidta
                                                                ?.chargesDuPersonnel
                                                                ?.n
                                                        }
                                                    />
                                                    {goodwillDataFormik.touched
                                                        .ebidta
                                                        ?.chargesDuPersonnel
                                                        ?.n &&
                                                        !!goodwillDataFormik
                                                            .errors.ebidta
                                                            ?.chargesDuPersonnel
                                                            ?.n && (
                                                            <FormHelperText
                                                                error
                                                            >
                                                                {
                                                                    goodwillDataFormik
                                                                        .errors
                                                                        .ebidta
                                                                        ?.chargesDuPersonnel
                                                                        ?.n
                                                                }
                                                            </FormHelperText>
                                                        )}
                                                </FormControl>
                                            </Grid>
                                            <Grid
                                                item
                                                xl={4}
                                                lg={4}
                                                md={12}
                                                xs={12}
                                            >
                                                <FormControl fullWidth>
                                                    <InputLabel
                                                        error={
                                                            goodwillDataFormik
                                                                .touched.ebidta
                                                                ?.chargesDuPersonnel
                                                                ?.n1 &&
                                                            !!goodwillDataFormik
                                                                .errors.ebidta
                                                                ?.chargesDuPersonnel
                                                                ?.n1
                                                        }
                                                    >
                                                        N-1
                                                    </InputLabel>
                                                    <OutlinedInput
                                                        inputComponent={
                                                            NumberFormatCustom
                                                        }
                                                        fullWidth
                                                        label="N-1"
                                                        size="medium"
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                €
                                                            </InputAdornment>
                                                        }
                                                        type="number"
                                                        name="ebidta.chargesDuPersonnel.n1"
                                                        value={
                                                            goodwillDataFormik
                                                                .values.ebidta
                                                                .chargesDuPersonnel
                                                                .n1
                                                        }
                                                        onChange={
                                                            goodwillDataFormik.handleChange
                                                        }
                                                        onBlur={
                                                            goodwillDataFormik.handleBlur
                                                        }
                                                        error={
                                                            goodwillDataFormik
                                                                .touched.ebidta
                                                                ?.chargesDuPersonnel
                                                                ?.n1 &&
                                                            !!goodwillDataFormik
                                                                .errors.ebidta
                                                                ?.chargesDuPersonnel
                                                                ?.n1
                                                        }
                                                    />
                                                    {goodwillDataFormik.touched
                                                        .ebidta
                                                        ?.chargesDuPersonnel
                                                        ?.n1 &&
                                                        !!goodwillDataFormik
                                                            .errors.ebidta
                                                            ?.chargesDuPersonnel
                                                            ?.n1 && (
                                                            <FormHelperText
                                                                error
                                                            >
                                                                {
                                                                    goodwillDataFormik
                                                                        .errors
                                                                        .ebidta
                                                                        ?.chargesDuPersonnel
                                                                        ?.n1
                                                                }
                                                            </FormHelperText>
                                                        )}
                                                </FormControl>
                                            </Grid>
                                            <Grid
                                                item
                                                xl={4}
                                                lg={4}
                                                md={12}
                                                xs={12}
                                            >
                                                <FormControl fullWidth>
                                                    <InputLabel
                                                        error={
                                                            goodwillDataFormik
                                                                .touched.ebidta
                                                                ?.chargesDuPersonnel
                                                                ?.n2 &&
                                                            !!goodwillDataFormik
                                                                .errors.ebidta
                                                                ?.chargesDuPersonnel
                                                                ?.n2
                                                        }
                                                    >
                                                        N-2
                                                    </InputLabel>
                                                    <OutlinedInput
                                                        inputComponent={
                                                            NumberFormatCustom
                                                        }
                                                        fullWidth
                                                        label="N-2"
                                                        size="medium"
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                €
                                                            </InputAdornment>
                                                        }
                                                        type="number"
                                                        name="ebidta.chargesDuPersonnel.n2"
                                                        value={
                                                            goodwillDataFormik
                                                                .values.ebidta
                                                                .chargesDuPersonnel
                                                                .n2
                                                        }
                                                        onChange={
                                                            goodwillDataFormik.handleChange
                                                        }
                                                        onBlur={
                                                            goodwillDataFormik.handleBlur
                                                        }
                                                        error={
                                                            goodwillDataFormik
                                                                .touched.ebidta
                                                                ?.chargesDuPersonnel
                                                                ?.n2 &&
                                                            !!goodwillDataFormik
                                                                .errors.ebidta
                                                                ?.chargesDuPersonnel
                                                                ?.n2
                                                        }
                                                    />
                                                    {goodwillDataFormik.touched
                                                        .ebidta
                                                        ?.chargesDuPersonnel
                                                        ?.n2 &&
                                                        !!goodwillDataFormik
                                                            .errors.ebidta
                                                            ?.chargesDuPersonnel
                                                            ?.n2 && (
                                                            <FormHelperText
                                                                error
                                                            >
                                                                {
                                                                    goodwillDataFormik
                                                                        .errors
                                                                        .ebidta
                                                                        ?.chargesDuPersonnel
                                                                        ?.n2
                                                                }
                                                            </FormHelperText>
                                                        )}
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                        <Grid
                                            container
                                            spacing={2}
                                            sx={{ mt: 2 }}
                                        >
                                            <Grid item xs={12}>
                                                <Typography
                                                    className="customLabel"
                                                    color={"textSecondary"}
                                                >
                                                    Autres charges
                                                    d'exploitation
                                                </Typography>
                                            </Grid>
                                            <Grid
                                                item
                                                xl={4}
                                                lg={4}
                                                md={12}
                                                xs={12}
                                            >
                                                <FormControl fullWidth>
                                                    <InputLabel
                                                        error={
                                                            goodwillDataFormik
                                                                .touched.ebidta
                                                                ?.autresChargesExploitation
                                                                ?.n &&
                                                            !!goodwillDataFormik
                                                                .errors.ebidta
                                                                ?.autresChargesExploitation
                                                                ?.n
                                                        }
                                                    >
                                                        N
                                                    </InputLabel>
                                                    <OutlinedInput
                                                        inputComponent={
                                                            NumberFormatCustom
                                                        }
                                                        fullWidth
                                                        label="N"
                                                        size="medium"
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                €
                                                            </InputAdornment>
                                                        }
                                                        type="number"
                                                        name="ebidta.autresChargesExploitation.n"
                                                        value={
                                                            goodwillDataFormik
                                                                .values.ebidta
                                                                .autresChargesExploitation
                                                                .n
                                                        }
                                                        onChange={
                                                            goodwillDataFormik.handleChange
                                                        }
                                                        onBlur={
                                                            goodwillDataFormik.handleBlur
                                                        }
                                                        error={
                                                            goodwillDataFormik
                                                                .touched.ebidta
                                                                ?.autresChargesExploitation
                                                                ?.n &&
                                                            !!goodwillDataFormik
                                                                .errors.ebidta
                                                                ?.autresChargesExploitation
                                                                ?.n
                                                        }
                                                    />
                                                    {goodwillDataFormik.touched
                                                        .ebidta
                                                        ?.autresChargesExploitation
                                                        ?.n &&
                                                        !!goodwillDataFormik
                                                            .errors.ebidta
                                                            ?.autresChargesExploitation
                                                            ?.n && (
                                                            <FormHelperText
                                                                error
                                                            >
                                                                {
                                                                    goodwillDataFormik
                                                                        .errors
                                                                        .ebidta
                                                                        ?.autresChargesExploitation
                                                                        ?.n
                                                                }
                                                            </FormHelperText>
                                                        )}
                                                </FormControl>
                                            </Grid>
                                            <Grid
                                                item
                                                xl={4}
                                                lg={4}
                                                md={12}
                                                xs={12}
                                            >
                                                <FormControl fullWidth>
                                                    <InputLabel
                                                        error={
                                                            goodwillDataFormik
                                                                .touched.ebidta
                                                                ?.autresChargesExploitation
                                                                ?.n1 &&
                                                            !!goodwillDataFormik
                                                                .errors.ebidta
                                                                ?.autresChargesExploitation
                                                                ?.n1
                                                        }
                                                    >
                                                        N-1
                                                    </InputLabel>
                                                    <OutlinedInput
                                                        inputComponent={
                                                            NumberFormatCustom
                                                        }
                                                        fullWidth
                                                        label="N-1"
                                                        size="medium"
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                €
                                                            </InputAdornment>
                                                        }
                                                        type="number"
                                                        name="ebidta.autresChargesExploitation.n1"
                                                        value={
                                                            goodwillDataFormik
                                                                .values.ebidta
                                                                .autresChargesExploitation
                                                                .n1
                                                        }
                                                        onChange={
                                                            goodwillDataFormik.handleChange
                                                        }
                                                        onBlur={
                                                            goodwillDataFormik.handleBlur
                                                        }
                                                        error={
                                                            goodwillDataFormik
                                                                .touched.ebidta
                                                                ?.autresChargesExploitation
                                                                ?.n1 &&
                                                            !!goodwillDataFormik
                                                                .errors.ebidta
                                                                ?.autresChargesExploitation
                                                                ?.n1
                                                        }
                                                    />
                                                    {goodwillDataFormik.touched
                                                        .ebidta
                                                        ?.autresChargesExploitation
                                                        ?.n1 &&
                                                        !!goodwillDataFormik
                                                            .errors.ebidta
                                                            ?.autresChargesExploitation
                                                            ?.n1 && (
                                                            <FormHelperText
                                                                error
                                                            >
                                                                {
                                                                    goodwillDataFormik
                                                                        .errors
                                                                        .ebidta
                                                                        ?.autresChargesExploitation
                                                                        ?.n1
                                                                }
                                                            </FormHelperText>
                                                        )}
                                                </FormControl>
                                            </Grid>
                                            <Grid
                                                item
                                                xl={4}
                                                lg={4}
                                                md={12}
                                                xs={12}
                                            >
                                                <FormControl fullWidth>
                                                    <InputLabel
                                                        error={
                                                            goodwillDataFormik
                                                                .touched.ebidta
                                                                ?.autresChargesExploitation
                                                                ?.n2 &&
                                                            !!goodwillDataFormik
                                                                .errors.ebidta
                                                                ?.autresChargesExploitation
                                                                ?.n2
                                                        }
                                                    >
                                                        N-2
                                                    </InputLabel>
                                                    <OutlinedInput
                                                        inputComponent={
                                                            NumberFormatCustom
                                                        }
                                                        fullWidth
                                                        label="N-2"
                                                        size="medium"
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                €
                                                            </InputAdornment>
                                                        }
                                                        type="number"
                                                        name="ebidta.autresChargesExploitation.n2"
                                                        value={
                                                            goodwillDataFormik
                                                                .values.ebidta
                                                                .autresChargesExploitation
                                                                .n2
                                                        }
                                                        onChange={
                                                            goodwillDataFormik.handleChange
                                                        }
                                                        onBlur={
                                                            goodwillDataFormik.handleBlur
                                                        }
                                                        error={
                                                            goodwillDataFormik
                                                                .touched.ebidta
                                                                ?.autresChargesExploitation
                                                                ?.n2 &&
                                                            !!goodwillDataFormik
                                                                .errors.ebidta
                                                                ?.autresChargesExploitation
                                                                ?.n2
                                                        }
                                                    />
                                                    {goodwillDataFormik.touched
                                                        .ebidta
                                                        ?.autresChargesExploitation
                                                        ?.n2 &&
                                                        !!goodwillDataFormik
                                                            .errors.ebidta
                                                            ?.autresChargesExploitation
                                                            ?.n2 && (
                                                            <FormHelperText
                                                                error
                                                            >
                                                                {
                                                                    goodwillDataFormik
                                                                        .errors
                                                                        .ebidta
                                                                        ?.autresChargesExploitation
                                                                        ?.n2
                                                                }
                                                            </FormHelperText>
                                                        )}
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box className="formFooter">
                                <Button
                                    endIcon={<img src={endIcon} alt="" />}
                                    variant="contained"
                                    color="secondary"
                                    onClick={goodwillDataFormik.submitForm}
                                    disabled={!goodwillDataFormik.isValid}
                                >
                                    Suivant
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            )}

            {hasGoodwill && (
                <Box
                    className="stepperData"
                    sx={{ backgroundColor: theme.palette.grey["0"] }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box className="titleTop">
                                <Typography
                                    variant="h4"
                                    sx={{ color: "primary.main" }}
                                >
                                    Retraitement de l'EBIDTA
                                </Typography>
                                <Typography>
                                Lors du calcul de l'EBITDA, un retraitement de la rémunération chargée du ou des dirigeants peut être effectué pour obtenir une vision plus représentative de la rentabilité opérationnelle de l'entreprise si cette rémunération est inhabituelement élevée ou faible par rapport au marché.
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item lg={12} xs={12}>
                            <Box className="formBox" component="form">
                                <Grid container spacing={2}>
                                    <Grid item xl={4} lg={4} md={12} xs={12}>
                                        <Typography
                                            variant="h5"
                                            color="textPrimary"
                                            className="formLabel"
                                        >
                                            Retraitement de l'EBIDTA
                                            <StyledTooltip
                                                className="tooltip"
                                                title={<div>
                                                    Le retraitement de l'EBITDA permet :<br/><br/>
                                                    Objectifs :<br/>
                                                    • Normaliser les charges de personnel<br/>
                                                    • Ajuster les rémunérations inhabituelles<br/>
                                                    • Refléter la réalité économique<br/><br/>
                                                    Impact :<br/>
                                                    • Vision plus juste de la rentabilité<br/>
                                                    • Comparabilité améliorée<br/>
                                                    • Évaluation plus précise
                                                </div>}
                                                placement="right"
                                            >
                                                <InfoRoundedIcon
                                                    className="tooltipIcon"
                                                    sx={{
                                                        color: theme.palette
                                                            .grey["500"],
                                                    }}
                                                    fontSize="small"
                                                />
                                            </StyledTooltip>
                                        </Typography>
                                    </Grid>
                                    <Grid item xl={8} lg={8} md={12} xs={12}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Typography
                                                    className="customLabel"
                                                    color={"textSecondary"}
                                                >
                                                    + Coût rémunération du
                                                    dirigeant
                                                </Typography>
                                                <Typography
                                            variant="caption"
                                            color={"textSecondary"}
                                        >
                                            Veuiller vérifier que le montant indiqué correspond à la rémunération chargée du ou des dirigeants
                                        </Typography>
                                            </Grid>

                                            <Grid
                                                item
                                                xl={4}
                                                lg={4}
                                                md={12}
                                                xs={12}
                                            >
                                                <FormControl fullWidth>
                                                    <InputLabel
                                                        error={
                                                            restatementEbidtaFormik
                                                                .touched
                                                                .retraitement
                                                                ?.remuneration
                                                                ?.n &&
                                                            !!restatementEbidtaFormik
                                                                .errors
                                                                .retraitement
                                                                ?.remuneration
                                                                ?.n
                                                        }
                                                    >
                                                        N
                                                    </InputLabel>
                                                    <OutlinedInput
                                                        inputComponent={
                                                            NumberFormatCustom
                                                        }
                                                        fullWidth
                                                        label="N"
                                                        size="medium"
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                €
                                                            </InputAdornment>
                                                        }
                                                        type="number"
                                                        name="retraitement.remuneration.n"
                                                        value={
                                                            restatementEbidtaFormik
                                                                .values
                                                                .retraitement
                                                                .remuneration.n
                                                        }
                                                        onChange={
                                                            restatementEbidtaFormik.handleChange
                                                        }
                                                        onBlur={
                                                            restatementEbidtaFormik.handleBlur
                                                        }
                                                        error={
                                                            restatementEbidtaFormik
                                                                .touched
                                                                .retraitement
                                                                ?.remuneration
                                                                ?.n &&
                                                            !!restatementEbidtaFormik
                                                                .errors
                                                                .retraitement
                                                                ?.remuneration
                                                                ?.n
                                                        }
                                                    />
                                                    {restatementEbidtaFormik
                                                        .touched.retraitement
                                                        ?.remuneration?.n &&
                                                        !!restatementEbidtaFormik
                                                            .errors.retraitement
                                                            ?.remuneration
                                                            ?.n && (
                                                            <FormHelperText
                                                                error
                                                            >
                                                                {
                                                                    restatementEbidtaFormik
                                                                        .errors
                                                                        .retraitement
                                                                        ?.remuneration
                                                                        ?.n
                                                                }
                                                            </FormHelperText>
                                                        )}
                                                </FormControl>
                                            </Grid>
                                            <Grid
                                                item
                                                xl={4}
                                                lg={4}
                                                md={12}
                                                xs={12}
                                            >
                                                <FormControl fullWidth>
                                                    <InputLabel
                                                        error={
                                                            restatementEbidtaFormik
                                                                .touched
                                                                .retraitement
                                                                ?.remuneration
                                                                ?.n1 &&
                                                            !!restatementEbidtaFormik
                                                                .errors
                                                                .retraitement
                                                                ?.remuneration
                                                                ?.n1
                                                        }
                                                    >
                                                        N-1
                                                    </InputLabel>
                                                    <OutlinedInput
                                                        inputComponent={
                                                            NumberFormatCustom
                                                        }
                                                        fullWidth
                                                        label="N-1"
                                                        size="medium"
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                €
                                                            </InputAdornment>
                                                        }
                                                        type="number"
                                                        name="retraitement.remuneration.n1"
                                                        value={
                                                            restatementEbidtaFormik
                                                                .values
                                                                .retraitement
                                                                .remuneration.n1
                                                        }
                                                        onChange={
                                                            restatementEbidtaFormik.handleChange
                                                        }
                                                        onBlur={
                                                            restatementEbidtaFormik.handleBlur
                                                        }
                                                        error={
                                                            restatementEbidtaFormik
                                                                .touched
                                                                .retraitement
                                                                ?.remuneration
                                                                ?.n1 &&
                                                            !!restatementEbidtaFormik
                                                                .errors
                                                                .retraitement
                                                                ?.remuneration
                                                                ?.n1
                                                        }
                                                    />
                                                    {restatementEbidtaFormik
                                                        .touched.retraitement
                                                        ?.remuneration?.n1 &&
                                                        !!restatementEbidtaFormik
                                                            .errors.retraitement
                                                            ?.remuneration
                                                            ?.n1 && (
                                                            <FormHelperText
                                                                error
                                                            >
                                                                {
                                                                    restatementEbidtaFormik
                                                                        .errors
                                                                        .retraitement
                                                                        ?.remuneration
                                                                        ?.n1
                                                                }
                                                            </FormHelperText>
                                                        )}
                                                </FormControl>
                                            </Grid>
                                            <Grid
                                                item
                                                xl={4}
                                                lg={4}
                                                md={12}
                                                xs={12}
                                            >
                                                <FormControl fullWidth>
                                                    <InputLabel
                                                        error={
                                                            restatementEbidtaFormik
                                                                .touched
                                                                .retraitement
                                                                ?.remuneration
                                                                ?.n2 &&
                                                            !!restatementEbidtaFormik
                                                                .errors
                                                                .retraitement
                                                                ?.remuneration
                                                                ?.n2
                                                        }
                                                    >
                                                        N-2
                                                    </InputLabel>
                                                    <OutlinedInput
                                                        inputComponent={
                                                            NumberFormatCustom
                                                        }
                                                        label="N-2"
                                                        size="medium"
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                €
                                                            </InputAdornment>
                                                        }
                                                        fullWidth
                                                        type="number"
                                                        name="retraitement.remuneration.n2"
                                                        value={
                                                            restatementEbidtaFormik
                                                                .values
                                                                .retraitement
                                                                .remuneration.n2
                                                        }
                                                        onChange={
                                                            restatementEbidtaFormik.handleChange
                                                        }
                                                        onBlur={
                                                            restatementEbidtaFormik.handleBlur
                                                        }
                                                        error={
                                                            restatementEbidtaFormik
                                                                .touched
                                                                .retraitement
                                                                ?.remuneration
                                                                ?.n2 &&
                                                            !!restatementEbidtaFormik
                                                                .errors
                                                                .retraitement
                                                                ?.remuneration
                                                                ?.n2
                                                        }
                                                    />
                                                    {restatementEbidtaFormik
                                                        .touched.retraitement
                                                        ?.remuneration?.n2 &&
                                                        !!restatementEbidtaFormik
                                                            .errors.retraitement
                                                            ?.remuneration
                                                            ?.n2 && (
                                                            <FormHelperText
                                                                error
                                                            >
                                                                {
                                                                    restatementEbidtaFormik
                                                                        .errors
                                                                        .retraitement
                                                                        ?.remuneration
                                                                        ?.n2
                                                                }
                                                            </FormHelperText>
                                                        )}
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                        <Grid
                                            container
                                            spacing={2}
                                            sx={{ mt: 2 }}
                                        >
                                            <Grid item xs={12}>
                                                <Typography
                                                    className="customLabel"
                                                    color={"textSecondary"}
                                                >
                                                    - Coût rémunération normal
                                                    d'un dirigeant
                                                </Typography>
                                                <Typography
                                            variant="caption"
                                            color={"textSecondary"}
                                        >
                                            Indiquer la rémunération chargée de marché pour le ou les postes gérés par les dirigeants
                                        </Typography>
                                            </Grid>

                                            <Grid
                                                item
                                                xl={4}
                                                lg={4}
                                                md={12}
                                                xs={12}
                                            >
                                                <FormControl fullWidth>
                                                    <InputLabel
                                                        error={
                                                            restatementEbidtaFormik
                                                                .touched
                                                                .retraitement
                                                                ?.normalRemuneration
                                                                ?.n &&
                                                            !!restatementEbidtaFormik
                                                                .errors
                                                                .retraitement
                                                                ?.normalRemuneration
                                                                ?.n
                                                        }
                                                    >
                                                        N
                                                    </InputLabel>
                                                    <OutlinedInput
                                                        inputComponent={
                                                            NumberFormatCustom
                                                        }
                                                        fullWidth
                                                        label="N"
                                                        size="medium"
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                €
                                                            </InputAdornment>
                                                        }
                                                        type="number"
                                                        name="retraitement.normalRemuneration.n"
                                                        value={
                                                            restatementEbidtaFormik
                                                                .values
                                                                .retraitement
                                                                .normalRemuneration
                                                                .n
                                                        }
                                                        onChange={
                                                            restatementEbidtaFormik.handleChange
                                                        }
                                                        onBlur={
                                                            restatementEbidtaFormik.handleBlur
                                                        }
                                                        error={
                                                            restatementEbidtaFormik
                                                                .touched
                                                                .retraitement
                                                                ?.normalRemuneration
                                                                ?.n &&
                                                            !!restatementEbidtaFormik
                                                                .errors
                                                                .retraitement
                                                                ?.normalRemuneration
                                                                ?.n
                                                        }
                                                    />
                                                    {restatementEbidtaFormik
                                                        .touched.retraitement
                                                        ?.normalRemuneration
                                                        ?.n &&
                                                        !!restatementEbidtaFormik
                                                            .errors.retraitement
                                                            ?.normalRemuneration
                                                            ?.n && (
                                                            <FormHelperText
                                                                error
                                                            >
                                                                {
                                                                    restatementEbidtaFormik
                                                                        .errors
                                                                        .retraitement
                                                                        ?.normalRemuneration
                                                                        ?.n
                                                                }
                                                            </FormHelperText>
                                                        )}
                                                </FormControl>
                                            </Grid>
                                            <Grid
                                                item
                                                xl={4}
                                                lg={4}
                                                md={12}
                                                xs={12}
                                            >
                                                <FormControl fullWidth>
                                                    <InputLabel
                                                        error={
                                                            restatementEbidtaFormik
                                                                .touched
                                                                .retraitement
                                                                ?.normalRemuneration
                                                                ?.n1 &&
                                                            !!restatementEbidtaFormik
                                                                .errors
                                                                .retraitement
                                                                ?.normalRemuneration
                                                                ?.n1
                                                        }
                                                    >
                                                        N-1
                                                    </InputLabel>
                                                    <OutlinedInput
                                                        inputComponent={
                                                            NumberFormatCustom
                                                        }
                                                        fullWidth
                                                        label="N-1"
                                                        size="medium"
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                €
                                                            </InputAdornment>
                                                        }
                                                        type="number"
                                                        name="retraitement.normalRemuneration.n1"
                                                        value={
                                                            restatementEbidtaFormik
                                                                .values
                                                                .retraitement
                                                                .normalRemuneration
                                                                .n1
                                                        }
                                                        onChange={
                                                            restatementEbidtaFormik.handleChange
                                                        }
                                                        onBlur={
                                                            restatementEbidtaFormik.handleBlur
                                                        }
                                                        error={
                                                            restatementEbidtaFormik
                                                                .touched
                                                                .retraitement
                                                                ?.normalRemuneration
                                                                ?.n1 &&
                                                            !!restatementEbidtaFormik
                                                                .errors
                                                                .retraitement
                                                                ?.normalRemuneration
                                                                ?.n1
                                                        }
                                                    />
                                                    {restatementEbidtaFormik
                                                        .touched.retraitement
                                                        ?.normalRemuneration
                                                        ?.n1 &&
                                                        !!restatementEbidtaFormik
                                                            .errors.retraitement
                                                            ?.normalRemuneration
                                                            ?.n1 && (
                                                            <FormHelperText
                                                                error
                                                            >
                                                                {
                                                                    restatementEbidtaFormik
                                                                        .errors
                                                                        .retraitement
                                                                        ?.normalRemuneration
                                                                        ?.n1
                                                                }
                                                            </FormHelperText>
                                                        )}
                                                </FormControl>
                                            </Grid>
                                            <Grid
                                                item
                                                xl={4}
                                                lg={4}
                                                md={12}
                                                xs={12}
                                            >
                                                <FormControl fullWidth>
                                                    <InputLabel
                                                        error={
                                                            restatementEbidtaFormik
                                                                .touched
                                                                .retraitement
                                                                ?.normalRemuneration
                                                                ?.n2 &&
                                                            !!restatementEbidtaFormik
                                                                .errors
                                                                .retraitement
                                                                ?.normalRemuneration
                                                                ?.n2
                                                        }
                                                    >
                                                        N-2
                                                    </InputLabel>
                                                    <OutlinedInput
                                                        inputComponent={
                                                            NumberFormatCustom
                                                        }
                                                        label="N-2"
                                                        size="medium"
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                €
                                                            </InputAdornment>
                                                        }
                                                        fullWidth
                                                        type="number"
                                                        name="retraitement.normalRemuneration.n2"
                                                        value={
                                                            restatementEbidtaFormik
                                                                .values
                                                                .retraitement
                                                                .normalRemuneration
                                                                .n2
                                                        }
                                                        onChange={
                                                            restatementEbidtaFormik.handleChange
                                                        }
                                                        onBlur={
                                                            restatementEbidtaFormik.handleBlur
                                                        }
                                                        error={
                                                            restatementEbidtaFormik
                                                                .touched
                                                                .retraitement
                                                                ?.normalRemuneration
                                                                ?.n2 &&
                                                            !!restatementEbidtaFormik
                                                                .errors
                                                                .retraitement
                                                                ?.normalRemuneration
                                                                ?.n2
                                                        }
                                                    />
                                                    {restatementEbidtaFormik
                                                        .touched.retraitement
                                                        ?.normalRemuneration
                                                        ?.n2 &&
                                                        !!restatementEbidtaFormik
                                                            .errors.retraitement
                                                            ?.normalRemuneration
                                                            ?.n2 && (
                                                            <FormHelperText
                                                                error
                                                            >
                                                                {
                                                                    restatementEbidtaFormik
                                                                        .errors
                                                                        .retraitement
                                                                        ?.normalRemuneration
                                                                        ?.n2
                                                                }
                                                            </FormHelperText>
                                                        )}
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box className="formFooter">
                                <Button
                                    endIcon={<img src={endIcon} alt="" />}
                                    variant="contained"
                                    color="secondary"
                                    onClick={restatementEbidtaFormik.submitForm}
                                    disabled={!restatementEbidtaFormik.isValid}
                                >
                                    Suivant
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            )}
        </>
    );
};

export default Step2;
