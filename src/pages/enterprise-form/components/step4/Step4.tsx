import {
    Box,
    FormControl,
    Grid,
    ToggleButton,
    Tooltip,
    Typography,
    useTheme,
    TooltipProps,
} from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import { styled } from "@mui/system";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import endIcon from "../../../../assets/end-icon.svg";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import {
    addFinancialCriteriaDataAndCalculateResult,
    resetFormSubmission,
    submitFormData,
} from "src/store/slices/enterpriseForm";
import LoadingButton from "@mui/lab/LoadingButton";
import { convertToThousands } from "src/pages/result/Result";
import { useEffect, useState } from "react";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import { db } from "src/firebase/firebase";
import { useAppSelector } from "src/hooks/use-app-selector";

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
    "&:hover": {
        borderColor: theme.palette.grey["900"],
    },
    "&.Mui-selected:not(.Mui-error)": {
        backgroundColor: theme.palette.grey["200"],
    },
}));

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

const OPTIONS = [
    {
        label: "Oui",
        value: "oui",
    },
    {
        label: "En cours",
        value: "enCours",
    },
    {
        label: "Non applicable",
        value: "nonApplicable",
    },
    {
        label: "Non",
        value: "non",
    },
];

const Step4 = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const enterpriseId = searchParams.get("enterpriseId");

    const [loading, setLoading] = useState(false);

    const user = useAppSelector((state) => state.auth.userData);
    const formDetails = useAppSelector((state) => state.enterpriseForm);
    const { financialCriteria } = useAppSelector(
        (state) => state.enterpriseForm
    );
    const { totalValuation } = useAppSelector(
        (state) => state.enterpriseForm.results
    );

    const formik = useFormik({
        initialValues: {
            organization: {
                isGovernanceStructured: "",
                isReportsProduced: "",
            },
            positioning: {
                haveQualityBrandImages: "",
                haveCertification: "",
            },
            innovation: {
                haveInnovationPolicy: "",
                doesPolicyBenifitFromTax: "",
                havePatent: "",
            },
            quality: {
                haveFormalizedQualityPolicy: "",
                haveQualityCertification: "",
            },
            strategie: {
                haveFormalizedCSREnvironmentalPolicy: "",
                haveEnvironmentalCSRCertifications: "",
            },
        },
        validateOnMount: true,
        validationSchema: Yup.object().shape({
            organization: Yup.object().shape({
                isGovernanceStructured: Yup.string()
                    .trim()
                    .required("Veuillez sélectionner une option"),
                isReportsProduced: Yup.string()
                    .trim()
                    .required("Veuillez sélectionner une option"),
            }),
            positioning: Yup.object().shape({
                haveQualityBrandImages: Yup.string()
                    .trim()
                    .required("Veuillez sélectionner une option"),
                haveCertification: Yup.string()
                    .trim()
                    .required("Veuillez sélectionner une option"),
            }),
            innovation: Yup.object().shape({
                haveInnovationPolicy: Yup.string()
                    .trim()
                    .required("Veuillez sélectionner une option"),
                doesPolicyBenifitFromTax: Yup.string()
                    .trim()
                    .required("Veuillez sélectionner une option"),
                havePatent: Yup.string()
                    .trim()
                    .required("Veuillez sélectionner une option"),
            }),
            quality: Yup.object().shape({
                haveFormalizedQualityPolicy: Yup.string()
                    .trim()
                    .required("Veuillez sélectionner une option"),
                haveQualityCertification: Yup.string()
                    .trim()
                    .required("Veuillez sélectionner une option"),
            }),
            strategie: Yup.object().shape({
                haveFormalizedCSREnvironmentalPolicy: Yup.string()
                    .trim()
                    .required("Veuillez sélectionner une option"),
                haveEnvironmentalCSRCertifications: Yup.string()
                    .trim()
                    .required("Veuillez sélectionner une option"),
            }),
        }),
        onSubmit: (values) => {
            dispatch(
                addFinancialCriteriaDataAndCalculateResult({
                    ...values,
                })
            );
            dispatch(submitFormData());
        },
    });
    const { values, touched, errors, isValid, handleChange, submitForm } = formik;

    useEffect(() => {
        if (
            financialCriteria.organization &&
            financialCriteria.positioning &&
            financialCriteria.innovation &&
            financialCriteria.quality &&
            financialCriteria.strategie
        ) {
            formik.setValues({
                organization: { ...financialCriteria.organization },
                positioning: { ...financialCriteria.positioning },
                innovation: { ...financialCriteria.innovation },
                quality: { ...financialCriteria.quality },
                strategie: { ...financialCriteria.strategie },
            });
        }
    }, [financialCriteria]);

    useEffect(() => {
        if (formDetails.isSubmitted) {
            if (!enterpriseId) {
                const value: any = {
                    ...formDetails,
                    total: totalValuation
                        ? `${convertToThousands(totalValuation)} €`
                        : "0 €",
                    userId: user?.uid ?? null,
                };

                delete value.fileData;
                delete value.isSubmitted;
                const collectionRef = collection(db, "enterprise");
                setLoading(true);

                addDoc(collectionRef, value)
                    .then((docRef) => {
                        if (docRef.id) {
                            navigate(`/result?enterpriseId=${docRef.id}`);
                        }
                        dispatch(resetFormSubmission())
                        setLoading(false);
                    })
                    .catch((err) => {
                        setLoading(false);
                        dispatch(resetFormSubmission())
                        toast.error(`${err.message}`);
                    });
            } else {
                const value = {
                    ...formDetails,
                    total: totalValuation
                        ? `${convertToThousands(totalValuation)} €`
                        : "0 €",
                };
                delete value.fileData;
                const collectionRef = doc(db, "enterprise", enterpriseId);
                setLoading(true);

                setDoc(collectionRef, value, { merge: true })
                    .then(() => {
                        toast.success("Mis à jour avec succès");
                        navigate(`/result?enterpriseId=${enterpriseId}`);
                        setLoading(false);
                    })
                    .catch((err) => {
                        setLoading(false);
                        toast.error(`${err.message}`);
                    });
            }
        }
    }, [formDetails.isSubmitted, enterpriseId]);

    return (
        <>
            <Box
                className="stepperData"
                sx={{ backgroundColor: theme.palette.grey["0"] }}
            >
                <Grid container spacing={2}>
                    <Grid item lg={12}>
                        <Box className="titleTop">
                            <Typography
                                variant="h4"
                                sx={{ color: "primary.main" }}
                            >
                                Application des critères extra-financiers
                            </Typography>
                            <Typography>
                                Afin de garantir la fiabilité de la
                                valorisation, veuillez répondre aux questions
                                suivantes de manière la plus objective possible
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item lg={12}>
                        <Box className="formBox" component="form">
                            <Grid container spacing={2}>
                                {/* Organisation */}
                                <Grid item lg={12} xs={12}>
                                    <Box className="formSubTitleMain">
                                        <Typography
                                            variant="h5"
                                            color="textPrimary"
                                            className="formLabel"
                                        >
                                            Organisation
                                            
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item lg={12} xs={12}>
                                    <Grid container spacing={2}>
                                        <Grid
                                            item
                                            xl={4}
                                            lg={4}
                                            md={12}
                                            xs={12}
                                        >
                                            <Typography
                                                color="textPrimary"
                                                className="formDetails"
                                                sx={{
                                                    color: theme.palette.grey[
                                                        "800"
                                                    ],
                                                }}
                                            >
                                                La gouvernance de votre
                                                entreprise est-elle structurée
                                            </Typography>
                                            <StyledTooltip
                                                className="tooltip"
                                                title={<div>
                                                    Cette question évalue la manière dont votre entreprise est organisée pour prendre des <strong>décisions stratégiques</strong> et gérer ses activités <strong>même en l'absence du dirigeant actuel</strong>. Une gouvernance structurée inclut des instances telles que le <strong>Comité de Direction (CoDir)</strong> et le <strong>Comité de Pilotage (CoPil)</strong>, qui supervisent les projets et les orientations. Cela implique également la mise en place d'une <strong>feuille de route</strong> définissant les priorités à moyen et long terme. En outre, une bonne gouvernance permet d'<strong>identifier de nouveaux modèles opérationnels</strong> pour améliorer les performances et de repérer les <strong>risques potentiels</strong> pouvant affecter l'entreprise. Une structure de gouvernance bien définie aide à une gestion efficace et anticipée de l'organisation.
                                                </div>}
                                                placement="right"
                                            >
                                                <InfoRoundedIcon />
                                            </StyledTooltip>
                                        </Grid>
                                        <Grid
                                            item
                                            xl={8}
                                            lg={8}
                                            md={12}
                                            xs={12}
                                        >
                                            <Grid container spacing={2}>
                                                {OPTIONS.map((item, index) => {
                                                    return (
                                                        <Grid
                                                            item
                                                            key={index}
                                                            xl={3}
                                                            lg={3}
                                                            md={6}
                                                            xs={12}
                                                        >
                                                            <FormControl
                                                                fullWidth
                                                            >
                                                                <StyledToggleButton
                                                                    className="formToggleButton"
                                                                    size="large"
                                                                    name="organization.isGovernanceStructured"
                                                                    value={
                                                                        item.value
                                                                    }
                                                                    selected={
                                                                        touched
                                                                            .organization
                                                                            ?.isGovernanceStructured &&
                                                                            !!errors
                                                                                .organization
                                                                                ?.isGovernanceStructured
                                                                            ? true
                                                                            : values
                                                                                .organization
                                                                                .isGovernanceStructured ===
                                                                            item.value
                                                                    }
                                                                    onChange={
                                                                        handleChange
                                                                    }
                                                                    color={
                                                                        touched
                                                                            .organization
                                                                            ?.isGovernanceStructured &&
                                                                            !!errors
                                                                                .organization
                                                                                ?.isGovernanceStructured
                                                                            ? "error"
                                                                            : "standard"
                                                                    }
                                                                >
                                                                    {item.label}
                                                                </StyledToggleButton>
                                                            </FormControl>
                                                        </Grid>
                                                    );
                                                })}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item lg={12} xs={12} sx={{ mt: 3 }}>
                                    <Grid container spacing={2}>
                                        <Grid
                                            item
                                            xl={4}
                                            lg={4}
                                            md={12}
                                            xs={12}
                                        >
                                            <Typography
                                                color="textPrimary"
                                                className="formDetails"
                                                sx={{
                                                    color: theme.palette.grey[
                                                        "800"
                                                    ],
                                                }}
                                            >
                                                Des rapports formalisés ont-ils
                                                été produits en matière de
                                                stratégie de gouvernance
                                            </Typography>
                                            
                                            <Typography
                                                variant="caption"
                                                color={"textSecondary"}
                                            >
                                                (transition numérique,
                                                conformité réglementaire,
                                                responsabilité sociétale des
                                                entreprises (RSE), gestion des
                                                talents, cybersécurité,…) ?
                                            </Typography>
                                            <StyledTooltip
                                                className="tooltip"
                                                title={<div>
                                                    Cette question concerne la documentation et l'analyse des actions stratégiques de gouvernance mises en place au sein de votre entreprise. Il s'agit de vérifier si des <strong>rapports formalisés</strong> ont été rédigés pour aborder des sujets clés comme la <strong>transition numérique</strong>, la <strong>conformité réglementaire</strong>, la <strong>responsabilité sociétale des entreprises (RSE)</strong>, la <strong>gestion des talents</strong> ou encore la <strong>cybersécurité</strong>. Ces rapports permettent de suivre et d'évaluer les initiatives stratégiques de manière structurée, en assurant que l'entreprise respecte les normes et se prépare aux défis à venir. Une stratégie de gouvernance bien documentée aide à prendre des décisions éclairées et à renforcer la transparence.
                                                </div>}
                                                placement="right"
                                            >
                                                <InfoRoundedIcon />
                                            </StyledTooltip>
                                        </Grid>
                                        <Grid
                                            item
                                            xl={8}
                                            lg={8}
                                            md={12}
                                            xs={12}
                                        >
                                            <Grid container spacing={2}>
                                                {OPTIONS.map((item, index) => {
                                                    return (
                                                        <Grid
                                                            item
                                                            key={index}
                                                            xl={3}
                                                            lg={3}
                                                            md={6}
                                                            xs={12}
                                                        >
                                                            <FormControl
                                                                fullWidth
                                                            >
                                                                <StyledToggleButton
                                                                    className="formToggleButton"
                                                                    size="large"
                                                                    name="organization.isReportsProduced"
                                                                    value={
                                                                        item.value
                                                                    }
                                                                    selected={
                                                                        touched
                                                                            .organization
                                                                            ?.isReportsProduced &&
                                                                            !!errors
                                                                                .organization
                                                                                ?.isReportsProduced
                                                                            ? true
                                                                            : values
                                                                                .organization
                                                                                .isReportsProduced ===
                                                                            item.value
                                                                    }
                                                                    onChange={
                                                                        handleChange
                                                                    }
                                                                    color={
                                                                        touched
                                                                            .organization
                                                                            ?.isReportsProduced &&
                                                                            !!errors
                                                                                .organization
                                                                                ?.isReportsProduced
                                                                            ? "error"
                                                                            : "standard"
                                                                    }
                                                                >
                                                                    {item.label}
                                                                </StyledToggleButton>
                                                            </FormControl>
                                                        </Grid>
                                                    );
                                                })}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* Positionnement */}
                                <Grid item lg={12} xs={12} sx={{ mt: 3 }}>
                                    <Box className="formSubTitleMain">
                                        <Typography
                                            variant="h5"
                                            color="textPrimary"
                                            className="formLabel"
                                        >
                                            Positionnement
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item lg={12} xs={12}>
                                    <Grid container spacing={2}>
                                        <Grid
                                            item
                                            xl={4}
                                            lg={4}
                                            md={12}
                                            xs={12}
                                        >
                                            <Typography
                                                color="textPrimary"
                                                className="formDetails"
                                                sx={{
                                                    color: theme.palette.grey[
                                                        "800"
                                                    ],
                                                }}
                                            >
                                                L'entreprise dispose-t-elle
                                                d'une image de marque de qualité
                                                auprès de ses
                                                fournisseurs/clients/collab ?
                                            </Typography>
                                            <StyledTooltip
                                                className="tooltip"
                                                title={<div>
                                                    Cette question évalue la perception que vos <strong>fournisseurs</strong>, <strong>clients</strong> et <strong>collaborateurs</strong> ont de votre entreprise. Une <strong>image de marque de qualité</strong> reflète la confiance, la satisfaction et la réputation positive que vous avez bâties auprès de ces parties prenantes. Pour en avoir une évaluation objective, des <strong>enquêtes de satisfaction</strong> sont souvent menées, afin de recueillir des retours sur la qualité des produits/services, l'expérience client, la relation avec les fournisseurs et l'environnement de travail pour les collaborateurs. Une image de marque positive est un atout précieux pour maintenir de bonnes relations et favoriser la fidélisation.
                                                </div>}
                                                placement="right"
                                            >
                                                <InfoRoundedIcon />
                                            </StyledTooltip>
                                        </Grid>
                                        <Grid
                                            item
                                            xl={8}
                                            lg={8}
                                            md={12}
                                            xs={12}
                                        >
                                            <Grid container spacing={2}>
                                                {OPTIONS.map((item, index) => {
                                                    return (
                                                        <Grid
                                                            item
                                                            key={index}
                                                            xl={3}
                                                            lg={3}
                                                            md={6}
                                                            xs={12}
                                                        >
                                                            <FormControl
                                                                fullWidth
                                                            >
                                                                <StyledToggleButton
                                                                    className="formToggleButton"
                                                                    size="large"
                                                                    name="positioning.haveQualityBrandImages"
                                                                    value={
                                                                        item.value
                                                                    }
                                                                    selected={
                                                                        touched
                                                                            .positioning
                                                                            ?.haveQualityBrandImages &&
                                                                            !!errors
                                                                                .positioning
                                                                                ?.haveQualityBrandImages
                                                                            ? true
                                                                            : values
                                                                                .positioning
                                                                                .haveQualityBrandImages ===
                                                                            item.value
                                                                    }
                                                                    onChange={
                                                                        handleChange
                                                                    }
                                                                    color={
                                                                        touched
                                                                            .positioning
                                                                            ?.haveQualityBrandImages &&
                                                                            !!errors
                                                                                .positioning
                                                                                ?.haveQualityBrandImages
                                                                            ? "error"
                                                                            : "standard"
                                                                    }
                                                                >
                                                                    {item.label}
                                                                </StyledToggleButton>
                                                            </FormControl>
                                                        </Grid>
                                                    );
                                                })}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item lg={12} xs={12} sx={{ mt: 3 }}>
                                    <Grid container spacing={2}>
                                        <Grid
                                            item
                                            xl={4}
                                            lg={4}
                                            md={12}
                                            xs={12}
                                        >
                                            <Typography
                                                color="textPrimary"
                                                className="formDetails"
                                                sx={{
                                                    color: theme.palette.grey[
                                                        "800"
                                                    ],
                                                }}
                                            >
                                                Est-elle détentrice d'un
                                                label/certification/positionnement
                                                dans un classement valorisant
                                                son image de marque ?
                                            </Typography>
                                            <StyledTooltip
                                                className="tooltip"
                                                title={<div>
                                                    Cette question s'intéresse aux <strong>labels</strong>, <strong>certifications</strong> ou <strong>classements</strong> officiels qui peuvent reconnaître et valoriser l'image de marque de votre entreprise. Obtenir une <strong>certification</strong> ou figurer dans un <strong>classement</strong> prestigieux est une preuve tangible de la qualité, de la responsabilité ou de l'excellence de l'entreprise dans des domaines spécifiques (par exemple, la qualité des produits, l'éthique, l'innovation, la responsabilité sociétale). Ces distinctions renforcent la crédibilité de l'entreprise et sont souvent perçues positivement par les clients, partenaires et autres parties prenantes, contribuant ainsi à améliorer son image de marque.
                                                </div>}
                                                placement="right"
                                            >
                                                <InfoRoundedIcon />
                                            </StyledTooltip>
                                        </Grid>
                                        <Grid
                                            item
                                            xl={8}
                                            lg={8}
                                            md={12}
                                            xs={12}
                                        >
                                            <Grid container spacing={2}>
                                                {OPTIONS.map((item, index) => {
                                                    return (
                                                        <Grid
                                                            item
                                                            key={index}
                                                            xl={3}
                                                            lg={3}
                                                            md={6}
                                                            xs={12}
                                                        >
                                                            <FormControl
                                                                fullWidth
                                                            >
                                                                <StyledToggleButton
                                                                    className={`formToggleButton`}
                                                                    // className={`${classes.formToggleButton} formToggleButton`}
                                                                    size="large"
                                                                    name="positioning.haveCertification"
                                                                    value={
                                                                        item.value
                                                                    }
                                                                    selected={
                                                                        touched
                                                                            .positioning
                                                                            ?.haveCertification &&
                                                                            !!errors
                                                                                .positioning
                                                                                ?.haveCertification
                                                                            ? true
                                                                            : values
                                                                                .positioning
                                                                                .haveCertification ===
                                                                            item.value
                                                                    }
                                                                    onChange={
                                                                        handleChange
                                                                    }
                                                                    color={
                                                                        touched
                                                                            .positioning
                                                                            ?.haveCertification &&
                                                                            !!errors
                                                                                .positioning
                                                                                ?.haveCertification
                                                                            ? "error"
                                                                            : "standard"
                                                                    }
                                                                >
                                                                    {item.label}
                                                                </StyledToggleButton>
                                                            </FormControl>
                                                        </Grid>
                                                    );
                                                })}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* Innovation */}
                                <Grid item lg={12} xs={12} sx={{ mt: 3 }}>
                                    <Box className="formSubTitleMain">
                                        <Typography
                                            variant="h5"
                                            color="textPrimary"
                                            className="formLabel"
                                        >
                                            Innovation
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item lg={12} xs={12}>
                                    <Grid container spacing={2}>
                                        <Grid
                                            item
                                            xl={4}
                                            lg={4}
                                            md={12}
                                            xs={12}
                                        >
                                            <Typography
                                                color="textPrimary"
                                                className="formDetails"
                                                sx={{
                                                    color: theme.palette.grey[
                                                        "800"
                                                    ],
                                                }}
                                            >
                                                L'entreprise a-t-elle mis en place une politique d'Innovation ?
                                            </Typography>
                                            <StyledTooltip
                                                className="tooltip"
                                                title={<div>
                                                    Cette question évalue si votre entreprise met en place une <strong>politique d'innovation structurée</strong>, visant à encourager le développement de nouveaux produits, services ou processus. Une telle politique implique généralement des <strong>investissements réguliers en recherche et développement (R&D)</strong>, afin de stimuler l'innovation et de maintenir la compétitivité à long terme. Ces investissements permettent à l'entreprise de se préparer aux évolutions du marché, d'améliorer ses offres et de répondre aux besoins changeants des consommateurs. Une politique d'innovation bien définie contribue à la croissance de l'entreprise et à sa capacité à innover face à la concurrence.
                                                </div>}
                                                placement="right"
                                            >
                                                <InfoRoundedIcon />
                                            </StyledTooltip>
                                        </Grid>
                                        <Grid
                                            item
                                            xl={8}
                                            lg={8}
                                            md={12}
                                            xs={12}
                                        >
                                            <Grid container spacing={2}>
                                                {OPTIONS.map((item, index) => {
                                                    return (
                                                        <Grid
                                                            item
                                                            key={index}
                                                            xl={3}
                                                            lg={3}
                                                            md={6}
                                                            xs={12}
                                                        >
                                                            <FormControl
                                                                fullWidth
                                                            >
                                                                <StyledToggleButton
                                                                    className="formToggleButton"
                                                                    size="large"
                                                                    name="innovation.haveInnovationPolicy"
                                                                    value={
                                                                        item.value
                                                                    }
                                                                    selected={
                                                                        touched
                                                                            .innovation
                                                                            ?.haveInnovationPolicy &&
                                                                            !!errors
                                                                                .innovation
                                                                                ?.haveInnovationPolicy
                                                                            ? true
                                                                            : values
                                                                                .innovation
                                                                                .haveInnovationPolicy ===
                                                                            item.value
                                                                    }
                                                                    onChange={
                                                                        handleChange
                                                                    }
                                                                    color={
                                                                        touched
                                                                            .innovation
                                                                            ?.haveInnovationPolicy &&
                                                                            !!errors
                                                                                .innovation
                                                                                ?.haveInnovationPolicy
                                                                            ? "error"
                                                                            : "standard"
                                                                    }
                                                                >
                                                                    {item.label}
                                                                </StyledToggleButton>
                                                            </FormControl>
                                                        </Grid>
                                                    );
                                                })}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item lg={12} xs={12} sx={{ mt: 3 }}>
                                    <Grid container spacing={2}>
                                        <Grid
                                            item
                                            xl={4}
                                            lg={4}
                                            md={12}
                                            xs={12}
                                        >
                                            <Typography
                                                color="textPrimary"
                                                className="formDetails"
                                                sx={{
                                                    color: theme.palette.grey[
                                                        "800"
                                                    ],
                                                }}
                                            >
                                                L'entreprise a-t-elle bénéficié de crédits d'impôt liés à la recherche et à
                                                l'innovation ?
                                            </Typography>
                                            <StyledTooltip
                                                className="tooltip"
                                                title={<div>
                                                    Cette question concerne deux dispositifs fiscaux visant à soutenir les entreprises dans leurs efforts d'innovation :<br/><br/>
                                                    Le <strong>Crédit Impôt Recherche (CIR)</strong> permet aux entreprises de bénéficier d'une réduction d'impôt sur les dépenses liées à la <strong>recherche et au développement (R&D)</strong>. Ce crédit aide les entreprises à réduire les coûts de leurs projets de recherche.<br/><br/>
                                                    Le <strong>Crédit d'Impôt Innovation (CII)</strong>, quant à lui, est une extension du CIR, spécifiquement destiné aux PME qui investissent dans des activités d'<strong>innovation</strong> au sens large (pas seulement la recherche fondamentale, mais aussi le développement de nouveaux produits ou prototypes).
                                                </div>}
                                                placement="right"
                                            >
                                                <InfoRoundedIcon />
                                            </StyledTooltip>
                                        </Grid>
                                        <Grid
                                            item
                                            xl={8}
                                            lg={8}
                                            md={12}
                                            xs={12}
                                        >
                                            <Grid container spacing={2}>
                                                {OPTIONS.map((item, index) => {
                                                    return (
                                                        <Grid
                                                            item
                                                            key={index}
                                                            xl={3}
                                                            lg={3}
                                                            md={6}
                                                            xs={12}
                                                        >
                                                            <FormControl
                                                                fullWidth
                                                            >
                                                                <StyledToggleButton
                                                                    className={`formToggleButton`}
                                                                    size="large"
                                                                    name="innovation.doesPolicyBenifitFromTax"
                                                                    value={
                                                                        item.value
                                                                    }
                                                                    selected={
                                                                        touched
                                                                            .innovation
                                                                            ?.doesPolicyBenifitFromTax &&
                                                                            !!errors
                                                                                .innovation
                                                                                ?.doesPolicyBenifitFromTax
                                                                            ? true
                                                                            : values
                                                                                .innovation
                                                                                .doesPolicyBenifitFromTax ===
                                                                            item.value
                                                                    }
                                                                    onChange={
                                                                        handleChange
                                                                    }
                                                                    color={
                                                                        touched
                                                                            .innovation
                                                                            ?.doesPolicyBenifitFromTax &&
                                                                            !!errors
                                                                                .innovation
                                                                                ?.doesPolicyBenifitFromTax
                                                                            ? "error"
                                                                            : "standard"
                                                                    }
                                                                >
                                                                    {item.label}
                                                                </StyledToggleButton>
                                                            </FormControl>
                                                        </Grid>
                                                    );
                                                })}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item lg={12} xs={12} sx={{ mt: 3 }}>
                                    <Grid container spacing={2}>
                                        <Grid
                                            item
                                            xl={4}
                                            lg={4}
                                            md={12}
                                            xs={12}
                                        >
                                            <Typography
                                                color="textPrimary"
                                                className="formDetails"
                                                sx={{
                                                    color: theme.palette.grey[
                                                        "800"
                                                    ],
                                                }}
                                            >
                                                L'entreprise dispose-t-elle d'un brevet ?
                                            </Typography>
                                            <StyledTooltip
                                                className="tooltip"
                                                title={<div>
                                                    Cette question évalue si votre entreprise possède un <strong>brevet</strong>, un droit de propriété intellectuelle qui protège une invention technique, un produit ou un procédé innovant. Un brevet confère à l'entreprise des droits exclusifs sur son invention pendant une période déterminée (généralement 20 ans). Posséder un brevet peut être un atout stratégique, renforçant la compétitivité de l'entreprise, protégeant son innovation et créant de la valeur. Cela témoigne également de la capacité de l'entreprise à innover et à développer des solutions uniques sur le marché.
                                                </div>}
                                                placement="right"
                                            >
                                                <InfoRoundedIcon />
                                            </StyledTooltip>
                                        </Grid>
                                        <Grid
                                            item
                                            xl={8}
                                            lg={8}
                                            md={12}
                                            xs={12}
                                        >
                                            <Grid container spacing={2}>
                                                {OPTIONS.map((item, index) => {
                                                    return (
                                                        <Grid
                                                            item
                                                            key={index}
                                                            xl={3}
                                                            lg={3}
                                                            md={6}
                                                            xs={12}
                                                        >
                                                            <FormControl
                                                                fullWidth
                                                            >
                                                                <StyledToggleButton
                                                                    className={`formToggleButton`}
                                                                    size="large"
                                                                    name="innovation.havePatent"
                                                                    value={
                                                                        item.value
                                                                    }
                                                                    selected={
                                                                        touched
                                                                            .innovation
                                                                            ?.havePatent &&
                                                                            !!errors
                                                                                .innovation
                                                                                ?.havePatent
                                                                            ? true
                                                                            : values
                                                                                .innovation
                                                                                .havePatent ===
                                                                            item.value
                                                                    }
                                                                    onChange={
                                                                        handleChange
                                                                    }
                                                                    color={
                                                                        touched
                                                                            .innovation
                                                                            ?.havePatent &&
                                                                            !!errors
                                                                                .innovation
                                                                                ?.havePatent
                                                                            ? "error"
                                                                            : "standard"
                                                                    }
                                                                >
                                                                    {item.label}
                                                                </StyledToggleButton>
                                                            </FormControl>
                                                        </Grid>
                                                    );
                                                })}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* Qualite */}
                                <Grid item lg={12} xs={12} sx={{ mt: 3 }}>
                                    <Box className="formSubTitleMain">
                                        <Typography
                                            variant="h5"
                                            color="textPrimary"
                                            className="formLabel"
                                        >
                                            Qualite
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item lg={12} xs={12}>
                                    <Grid container spacing={2}>
                                        <Grid
                                            item
                                            xl={4}
                                            lg={4}
                                            md={12}
                                            xs={12}
                                        >
                                            <Typography
                                                color="textPrimary"
                                                className="formDetails"
                                                sx={{
                                                    color: theme.palette.grey[
                                                        "800"
                                                    ],
                                                }}
                                            >
                                                L'entreprise dispose-t-elle
                                                d'une politique qualité
                                                formalisée ?
                                            </Typography>
                                            <StyledTooltip
                                                className="tooltip"
                                                title={<div>
                                                    Cette question concerne la <strong>politique qualité</strong> de l'entreprise, c'est-à-dire l'ensemble des actions et des engagements mis en place pour garantir la qualité des produits, services ou processus internes. Une <strong>politique qualité formalisée</strong> signifie que l'entreprise a défini et documenté ses objectifs, ses méthodes de travail, ainsi que ses critères de qualité de manière structurée et officielle. Cela peut inclure des procédures internes, des audits réguliers, et des actions correctives pour améliorer continuellement les standards. Avoir une telle politique permet d'assurer la satisfaction des clients, de réduire les risques d'erreurs et de renforcer la compétitivité de l'entreprise.
                                                </div>}
                                                placement="right"
                                            >
                                                <InfoRoundedIcon />
                                            </StyledTooltip>
                                        </Grid>
                                        <Grid
                                            item
                                            xl={8}
                                            lg={8}
                                            md={12}
                                            xs={12}
                                        >
                                            <Grid container spacing={2}>
                                                {OPTIONS.map((item, index) => {
                                                    return (
                                                        <Grid
                                                            item
                                                            key={index}
                                                            xl={3}
                                                            lg={3}
                                                            md={6}
                                                            xs={12}
                                                        >
                                                            <FormControl
                                                                fullWidth
                                                            >
                                                                <StyledToggleButton
                                                                    className="formToggleButton"
                                                                    size="large"
                                                                    name="quality.haveFormalizedQualityPolicy"
                                                                    value={
                                                                        item.value
                                                                    }
                                                                    selected={
                                                                        touched
                                                                            .quality
                                                                            ?.haveFormalizedQualityPolicy &&
                                                                            !!errors
                                                                                .quality
                                                                                ?.haveFormalizedQualityPolicy
                                                                            ? true
                                                                            : values
                                                                                .quality
                                                                                .haveFormalizedQualityPolicy ===
                                                                            item.value
                                                                    }
                                                                    onChange={
                                                                        handleChange
                                                                    }
                                                                    color={
                                                                        touched
                                                                            .quality
                                                                            ?.haveFormalizedQualityPolicy &&
                                                                            !!errors
                                                                                .quality
                                                                                ?.haveFormalizedQualityPolicy
                                                                            ? "error"
                                                                            : "standard"
                                                                    }
                                                                >
                                                                    {item.label}
                                                                </StyledToggleButton>
                                                            </FormControl>
                                                        </Grid>
                                                    );
                                                })}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item lg={12} xs={12} sx={{ mt: 3 }}>
                                    <Grid container spacing={2}>
                                        <Grid
                                            item
                                            xl={4}
                                            lg={4}
                                            md={12}
                                            xs={12}
                                        >
                                            <Typography
                                                color="textPrimary"
                                                className="formDetails"
                                                sx={{
                                                    color: theme.palette.grey[
                                                        "800"
                                                    ],
                                                }}
                                            >
                                                L'entreprise dispose-t-elle d'une accréditation qualité ?
                                            </Typography>
                                            <StyledTooltip
                                                className="tooltip"
                                                title={<div>
                                                    Cette question porte sur la <strong>certification</strong> ou le <strong>label qualité</strong> détenu par l'entreprise, qui atteste de la conformité de ses produits, services ou processus aux normes de qualité reconnues. Une certification (comme <strong>ISO 9001</strong>) ou un label (comme <strong>Label Rouge</strong>, ou encore un <strong>label RSE</strong>) est un gage de sérieux et de professionnalisme, prouvant que l'entreprise respecte des critères stricts en matière de gestion de la qualité, de sécurité, d'environnement ou de responsabilité sociale. Ces distinctions contribuent à renforcer la confiance des clients et partenaires, et témoignent de l'engagement de l'entreprise à offrir des produits ou services de haute qualité.
                                                </div>}
                                                placement="right"
                                            >
                                                <InfoRoundedIcon />
                                            </StyledTooltip>
                                        </Grid>
                                        <Grid
                                            item
                                            xl={8}
                                            lg={8}
                                            md={12}
                                            xs={12}
                                        >
                                            <Grid container spacing={2}>
                                                {OPTIONS.map((item, index) => {
                                                    return (
                                                        <Grid
                                                            item
                                                            key={index}
                                                            xl={3}
                                                            lg={3}
                                                            md={6}
                                                            xs={12}
                                                        >
                                                            <FormControl
                                                                fullWidth
                                                            >
                                                                <StyledToggleButton
                                                                    className={`formToggleButton`}
                                                                    // className={`${classes.formToggleButton} formToggleButton`}
                                                                    size="large"
                                                                    name="quality.haveQualityCertification"
                                                                    value={
                                                                        item.value
                                                                    }
                                                                    selected={
                                                                        touched
                                                                            .quality
                                                                            ?.haveQualityCertification &&
                                                                            !!errors
                                                                                .quality
                                                                                ?.haveQualityCertification
                                                                            ? true
                                                                            : values
                                                                                .quality
                                                                                .haveQualityCertification ===
                                                                            item.value
                                                                    }
                                                                    onChange={
                                                                        handleChange
                                                                    }
                                                                    color={
                                                                        touched
                                                                            .quality
                                                                            ?.haveQualityCertification &&
                                                                            !!errors
                                                                                .quality
                                                                                ?.haveQualityCertification
                                                                            ? "error"
                                                                            : "standard"
                                                                    }
                                                                >
                                                                    {item.label}
                                                                </StyledToggleButton>
                                                            </FormControl>
                                                        </Grid>
                                                    );
                                                })}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* Strategie CSR (Politique environnementale, sociale et sociétale) */}
                                <Grid item lg={12} xs={12} sx={{ mt: 3 }}>
                                    <Box className="formSubTitleMain">
                                        <Typography
                                            variant="h5"
                                            color="textPrimary"
                                            className="formLabel"
                                        >
                                            Strategie RSE (Politique
                                            environnementale, sociale et
                                            sociétale)
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item lg={12} xs={12}>
                                    <Grid container spacing={2}>
                                        <Grid
                                            item
                                            xl={4}
                                            lg={4}
                                            md={12}
                                            xs={12}
                                        >
                                            <Typography
                                                color="textPrimary"
                                                className="formDetails"
                                                sx={{
                                                    color: theme.palette.grey[
                                                        "800"
                                                    ],
                                                }}
                                            >
                                                L'entreprise dispose-t-elle
                                                d'une politique
                                                RSE/environnementale formalisée
                                                ?
                                            </Typography>
                                            <StyledTooltip
                                                className="tooltip"
                                                title={<div>
                                                    Cette question évalue si votre entreprise a mis en place une politique <strong>RSE (Responsabilité Sociétale des Entreprises)</strong> ou <strong>environnementale</strong> clairement définie et documentée. Une politique formalisée signifie que l'entreprise a établi des objectifs spécifiques et des actions concrètes en matière de <strong>développement durable</strong>, d'<strong>impact environnemental</strong> et de <strong>responsabilité sociétale</strong>. Cela peut inclure des engagements pour réduire les émissions de gaz à effet de serre, optimiser la gestion des ressources naturelles, promouvoir la diversité et l'inclusion, ou soutenir des projets locaux ou solidaires. Une telle politique est généralement formalisée dans des documents stratégiques et régulièrement mise à jour, afin de garantir que l'entreprise respecte ses engagements et qu'elle améliore continuellement ses pratiques.
                                                </div>}
                                                placement="right"
                                            >
                                                <InfoRoundedIcon />
                                            </StyledTooltip>
                                        </Grid>
                                        <Grid
                                            item
                                            xl={8}
                                            lg={8}
                                            md={12}
                                            xs={12}
                                        >
                                            <Grid container spacing={2}>
                                                {OPTIONS.map((item, index) => {
                                                    return (
                                                        <Grid
                                                            item
                                                            key={index}
                                                            xl={3}
                                                            lg={3}
                                                            md={6}
                                                            xs={12}
                                                        >
                                                            <FormControl
                                                                fullWidth
                                                            >
                                                                <StyledToggleButton
                                                                    className="formToggleButton"
                                                                    size="large"
                                                                    name="strategie.haveFormalizedCSREnvironmentalPolicy"
                                                                    value={
                                                                        item.value
                                                                    }
                                                                    selected={
                                                                        touched
                                                                            .strategie
                                                                            ?.haveFormalizedCSREnvironmentalPolicy &&
                                                                            !!errors
                                                                                .strategie
                                                                                ?.haveFormalizedCSREnvironmentalPolicy
                                                                            ? true
                                                                            : values
                                                                                .strategie
                                                                                .haveFormalizedCSREnvironmentalPolicy ===
                                                                            item.value
                                                                    }
                                                                    onChange={
                                                                        handleChange
                                                                    }
                                                                    color={
                                                                        touched
                                                                            .strategie
                                                                            ?.haveFormalizedCSREnvironmentalPolicy &&
                                                                            !!errors
                                                                                .strategie
                                                                                ?.haveFormalizedCSREnvironmentalPolicy
                                                                            ? "error"
                                                                            : "standard"
                                                                    }
                                                                >
                                                                    {item.label}
                                                                </StyledToggleButton>
                                                            </FormControl>
                                                        </Grid>
                                                    );
                                                })}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item lg={12} xs={12} sx={{ mt: 3 }}>
                                    <Grid container spacing={2}>
                                        <Grid
                                            item
                                            xl={4}
                                            lg={4}
                                            md={12}
                                            xs={12}
                                        >
                                            <Typography
                                                color="textPrimary"
                                                className="formDetails"
                                                sx={{
                                                    color: theme.palette.grey[
                                                        "800"
                                                    ],
                                                }}
                                            >
                                                Est-elle détentrice de certifications officielles ?
                                            </Typography>
                                            <StyledTooltip
                                                className="tooltip"
                                                title={<div>
                                                    Cette question cherche à savoir si votre entreprise a obtenu des <strong>labels</strong>, des <strong>certifications</strong> ou pris des <strong>engagements officiels</strong> qui valorisent ses pratiques en matière d'environnement et de Responsabilité Sociétale des Entreprises (RSE). Des exemples incluent des certifications comme <strong>ISO 14001</strong> (gestion environnementale), des labels comme <strong>Ecovadis</strong> (évaluation des performances RSE), ou des engagements spécifiques tels que <strong>Entreprise Engagée Biodiversité</strong>. De plus, être signataire de chartes ou d'initiatives globales (comme la <strong>Charte de la Diversité</strong> ou la <strong>Global Compact des Nations Unies</strong>) peut refléter l'engagement de l'entreprise à adopter des pratiques durables et éthiques.
                                                </div>}
                                                placement="right"
                                            >
                                                <InfoRoundedIcon />
                                            </StyledTooltip>
                                        </Grid>
                                        <Grid
                                            item
                                            xl={8}
                                            lg={8}
                                            md={12}
                                            xs={12}
                                        >
                                            <Grid container spacing={2}>
                                                {OPTIONS.map((item, index) => {
                                                    return (
                                                        <Grid
                                                            item
                                                            key={index}
                                                            xl={3}
                                                            lg={3}
                                                            md={6}
                                                            xs={12}
                                                        >
                                                            <FormControl
                                                                fullWidth
                                                            >
                                                                <StyledToggleButton
                                                                    className={`formToggleButton`}
                                                                    // className={`${classes.formToggleButton} formToggleButton`}
                                                                    size="large"
                                                                    name="strategie.haveEnvironmentalCSRCertifications"
                                                                    value={
                                                                        item.value
                                                                    }
                                                                    selected={
                                                                        touched
                                                                            .strategie
                                                                            ?.haveEnvironmentalCSRCertifications &&
                                                                            !!errors
                                                                                .strategie
                                                                                ?.haveEnvironmentalCSRCertifications
                                                                            ? true
                                                                            : values
                                                                                .strategie
                                                                                .haveEnvironmentalCSRCertifications ===
                                                                            item.value
                                                                    }
                                                                    onChange={
                                                                        handleChange
                                                                    }
                                                                    color={
                                                                        touched
                                                                            .strategie
                                                                            ?.haveEnvironmentalCSRCertifications &&
                                                                            !!errors
                                                                                .strategie
                                                                                ?.haveEnvironmentalCSRCertifications
                                                                            ? "error"
                                                                            : "standard"
                                                                    }
                                                                >
                                                                    {item.label}
                                                                </StyledToggleButton>
                                                            </FormControl>
                                                        </Grid>
                                                    );
                                                })}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    {/* <Grid item lg={12}> */}
                    <Box className="formFooter">
                        <LoadingButton
                            endIcon={<img src={endIcon} alt="" />}
                            variant="contained"
                            color="secondary"
                            loading={loading}
                            disabled={!isValid}
                            onClick={submitForm}
                        >
                            Suivant
                        </LoadingButton>
                    </Box>
                    {/* </Grid> */}
                </Grid>
            </Box>
        </>
    );
};

export default Step4;
