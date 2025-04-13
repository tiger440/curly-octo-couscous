import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import {
    Box,
    Button,
    Card,
    Divider,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    Slide,
    Tooltip,
    TooltipProps,
    Typography,
    useTheme,
} from "@mui/material";
import { Stack } from "@mui/system";
import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Iconify from "src/components/iconify";
import { UploadBox } from "src/components/upload";
import { useAppSelector } from "src/hooks/use-app-selector";
import {
    addCompanyData,
    addEnterpriseData,
    addFileData,
    addSiren,
    addSirenData,
    setHasSasData,
} from "src/store/slices/enterpriseForm";
import { ENTERPRISE_MATURITY_VALUES } from "src/utils/constants/extraData";
import { ALL_EXTERPRISE_STATUS_CODES } from "src/utils/constants/statusCode";
import { fileReader } from "src/utils/methods/fileReader";
import { getExactMatch } from "src/utils/methods/getClosestData";
import * as Yup from "yup";
import endIcon from "../../../../assets/end-icon.svg";
import icWord from "../../../../assets/ic-word.svg";
import { FEC_MONTHS_OPTIONS } from "src/utils/constants/options";
import { YearsDataType } from "src/utils/types/enterpriseForm";
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

interface sirenDataType {
    siren: string;
    SASCode: string | null;
}

interface companyDataType {
    valueBasedOn: string | null;
    maturity: string | null;
    months: YearsDataType;
    FEC: string[] | null;
}

const ENTERPRISE_VALUE_OPTIONS = [
    {
        label: "Titres de la société: Achat d'une part de l'entreprise et de ses droits associés. ",
        value: "Titres de la société",
    },
    {
        label: "Fonds de commerce: Achat de l'activité commerciale.",
        value: "Fonds de commerce",
    },
];

const Step1 = ({ handleNextStep }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    // const { enqueueSnackbar } = useSnackbar();
    const { hasSiren, enterpriseDetails, hasSasData, fileData } = useAppSelector((state) => state.enterpriseForm);
    const [files, setFiles] = useState<File[]>([]);
    const [enterpriseName, setEnterpriseName] = useState("Entreprise");

    //==> Yup-formik validation <==
    const sirenDataFormik = useFormik({
        initialValues: {
            siren: "",
            SASCode: null,
        } as sirenDataType,
        validateOnMount: true,
        validationSchema: Yup.object().shape({
            siren: Yup.number()
                .typeError("Veuillez entrer le numéro")
                .test(
                    "len",
                    "Doit contenir exactement 9 chiffres",
                    (val) => val?.toString()?.length === 9
                )
                .required("Code SIREN requis"),
            SASCode: Yup.string().trim().required("Code SAS requis"),
        }),
        onSubmit: (values) => {
            dispatch(
                addSirenData({
                    ...values,
                })
            );
            dispatch(addSiren(true));
        },
    });
    const companyDataFormik = useFormik({
        initialValues: {
            valueBasedOn: null,
            maturity: null,
            months: {
                n: '',
                n1: '',
                n2: '',
            },
            FEC: [],
        } as companyDataType,
        validateOnMount: true,
        validationSchema: Yup.object().shape({
            valueBasedOn: Yup.string().trim().required("Champs requis"),
            maturity: Yup.string().trim().required("Champs requis"),
            months: Yup.object().shape({
                n: Yup.string().trim(),
                n1: Yup.string().trim(),
                n2: Yup.string().trim(),
            }),
            FEC: Yup.array()
                .of(Yup.string())
                .test("file-count", "Les fichiers doivent être 3", (value) => {
                    // Files must be 3
                    return (
                        value === undefined ||
                        value.length === 3 ||
                        value.length === 0
                    );
                })
                .test("file-count", "Fichiers invalides", (value) => {
                    // Invalid file name
                    if (!value || value.length === 0) return true;
                    const pattern = /^\d{9}FEC\d{8}$/;
                    return value.every((str) =>
                        pattern.test(str?.split(".")?.[0] ?? "")
                    );
                })
                .test(
                    "same-id",
                    "Tous les fichiers doivent avoir la même entreprise",
                    (value) => {
                        // All files must have the same enterprise
                        if (!value || value.length === 0) return true;
                        const id = value[0]?.split("FEC")[0];
                        return value.every((str) => str?.startsWith(id ?? ""));
                    }
                )
                .test(
                    "unique-years",
                    "Télécharger le fichier au format annuel N, N-1 et N-2",
                    (value) => {
                        // Upload file in N, N-1 and N-2 yearly format
                        if (!value || value.length === 0) return true;
                        const years = value.map((str) =>
                            parseInt(
                                str?.split("FEC")?.[1]?.substring(0, 4) ?? "0"
                            )
                        );
                        years.sort((a, b) => a - b);
                        return (
                            years[1] === years[0] + 1 &&
                            years[2] === years[1] + 1
                        );
                    }
                ),
            // .test('file-extension', 'Veuillez télécharger un fichier .CSV ou .xlsx', (value) => {
            //   // Please upload .CSV or .xlsx file
            //   if (!value || value.length === 0) return true;
            //   return value.every((str) => str?.endsWith('.csv') || str?.endsWith('.xlsx'));
            // })
        }),
        onSubmit: async (values) => {
            dispatch(
                addCompanyData({
                    ...values,
                })
            );

            if (files.length > 0) {
                const tmpFiles = [...files];
                const fileContentArr: any[] = [];
                for (const file of tmpFiles) {
                    const fileContent = await fileReader(file);
                    fileContentArr.push({
                        file,
                        fileContent,
                    });
                }
                dispatch(addFileData([...fileContentArr]));
            }
            handleNextStep();
        },
    });

    const getEnterpriseDetailsFormSiren = () => {
        axios({
            method: "GET",
            url: `${import.meta.env.VITE_APP_SIREN_API_BASE_URL_V3}/siren/${sirenDataFormik.values.siren
                }`,
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_APP_SIREN_API_ACCESS_TOKEN
                    }`,
            },
        })
            .then((response) => {
                const companyData = response.data?.uniteLegale ?? {};
                const code =
                    companyData?.periodesUniteLegale?.[0]
                        ?.activitePrincipaleUniteLegale;
                const name =
                    companyData?.periodesUniteLegale?.[0]
                        ?.denominationUniteLegale;
                if (code) {
                    // const closestMatch = getClosestData(code, [...EXTERPRISE_STATUS_CODES])
                    const exactMatch = getExactMatch(code, [
                        ...ALL_EXTERPRISE_STATUS_CODES,
                    ]);
                    sirenDataFormik.setFieldValue("SASCode", exactMatch);
                }
                if (name) {
                    setEnterpriseName(name);
                }
                dispatch(
                    addEnterpriseData({
                        name: name ?? "",
                        data: { ...(response.data ?? {}) },
                    })
                );
                dispatch(setHasSasData(true));
            })
            .catch((error) => {
                console.error(
                    "Error while fetching enterprise data using siren :>> ",
                    error
                );
                // enqueueSnackbar("Quelque chose s'est mal passé", {
                //     variant: "error",
                // });

                dispatch(setHasSasData(true));
            });
    };

    const handleFileUpload = (uploadedFiles: File[]) => {
        let tmpFiles: File[] = [...files];
        tmpFiles = [...tmpFiles, ...uploadedFiles];

        if (tmpFiles.length > 3) {
            tmpFiles = [...tmpFiles.slice(-3)];
        }

        setFiles([...tmpFiles]);
        companyDataFormik.setFieldTouched("FEC", true);
    };

    const handleFileRemove = (index: number) => {
        const tmpFile = [...files];
        tmpFile.splice(index, 1);
        setFiles(tmpFile);
    };

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            if (
                sirenDataFormik.touched.siren &&
                !sirenDataFormik.errors.siren
            ) {
                getEnterpriseDetailsFormSiren();
            }
        }, 500);

        return () => clearTimeout(debounceTimer);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        sirenDataFormik.values.siren,
        sirenDataFormik.touched.siren,
        sirenDataFormik.errors.siren,
    ]);

    useEffect(() => {
        if (Object.keys(enterpriseDetails).length > 0) {
            sirenDataFormik.setValues({
                siren: enterpriseDetails.siren ?? "",
                SASCode: enterpriseDetails.SASCode ?? null,
            });
            companyDataFormik.setValues({
                maturity: enterpriseDetails.maturity ?? null,
                valueBasedOn: enterpriseDetails.valueBasedOn ?? null,
                months: enterpriseDetails.months ?? {n:'12',n1:'12',n2:'12'},
                FEC: [],
            });
        }
    }, [enterpriseDetails]);

    useEffect(() => {
        const tmpFiles: File[] = [...files];

        const fileName = tmpFiles.map((file: File) => file.name);
        companyDataFormik.setFieldValue("FEC", fileName);
    }, [files]);

    useEffect(() => {
        if (fileData && fileData.length > 0) {
            setFiles(fileData.map((item) => item.file));
        }
    }, [fileData]);

    return (
        <>
            {!hasSiren && (
                <Box
                    className="stepperData"
                    sx={{ backgroundColor: theme.palette.grey["0"] }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box
                                className="titleTop"
                                sx={{
                                    borderBottom: `1px dashed ${theme.palette.grey["200"]}`,
                                }}
                            >
                                <Typography
                                    variant="h4"
                                    sx={{ color: "primary.main" }}
                                >
                                    Identification de l'entreprise
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
                                            SIREN{" "}
                                            <StyledTooltip
                                                className="tooltip"
                                                title={<div>
                                                    Le numéro SIREN :<br/><br/>
                                                    • Correspond aux 9 premiers chiffres du SIRET<br/>
                                                    • Identifie votre entreprise de façon unique<br/>
                                                    • Permet de récupérer automatiquement vos informations<br/><br/>
                                                    Ce numéro est essentiel pour :<br/>
                                                    • Vérifier l'identité de l'entreprise<br/>
                                                    • Accéder aux données officielles<br/>
                                                    • Assurer la fiabilité des informations
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
                                        <Typography
                                            variant="caption"
                                            color={"textSecondary"}
                                        >
                                            Entrer votre SIREN pour récupérer
                                            automatique les données de votre
                                            société
                                        </Typography>
                                    </Grid>
                                    <Grid item xl={8} lg={8} md={12} xs={12}>
                                        <FormControl fullWidth>
                                            <InputLabel
                                                error={
                                                    sirenDataFormik.touched
                                                        .siren &&
                                                    !!sirenDataFormik.errors
                                                        .siren
                                                }
                                            >
                                                SIREN
                                            </InputLabel>
                                            <OutlinedInput
                                                label="SIREN"
                                                size="medium"
                                                fullWidth
                                                type="number"
                                                name="siren"
                                                value={
                                                    sirenDataFormik.values.siren
                                                }
                                                onChange={
                                                    sirenDataFormik.handleChange
                                                }
                                                onBlur={
                                                    sirenDataFormik.handleBlur
                                                }
                                                error={
                                                    sirenDataFormik.touched
                                                        .siren &&
                                                    !!sirenDataFormik.errors
                                                        .siren
                                                }
                                            />
                                            {sirenDataFormik.touched.siren &&
                                                !!sirenDataFormik.errors
                                                    .siren && (
                                                    <FormHelperText error>
                                                        {
                                                            sirenDataFormik
                                                                .errors.siren
                                                        }
                                                    </FormHelperText>
                                                )}
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
                          Attention à bien vérifier si les informations sont
                          exactes.
                        </Typography>
                      </FormHelperText> */}
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                {hasSasData && (
                                    <Slide
                                        direction="down"
                                        in={true}
                                        mountOnEnter
                                        unmountOnExit
                                    >
                                        <div>
                                            <Divider
                                                sx={{ my: 3 }}
                                                orientation="horizontal"
                                                flexItem
                                            />
                                            <Grid container spacing={2}>
                                                <Grid
                                                    item
                                                    xl={4}
                                                    lg={4}
                                                    md={12}
                                                    xs={12}
                                                >
                                                    <Typography
                                                        variant="h5"
                                                        color="textPrimary"
                                                        className="formLabel"
                                                    >
                                                        {enterpriseName}
                                                        <StyledTooltip
                                                title="Si l'activité indiquée ne correspond pas à votre activité réelle, veuillez la sélectionner dans le menu déroulant. "
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
                                                    {/* <Typography variant="subtitle2" color={"textSecondary"}>
                      Forme juridique
                    </Typography> */}
                                                    {/* <Typography variant="inherit" color={"secondary.main"}>
                      SAS
                    </Typography> */}
                                                </Grid>
                                                <Grid
                                                    item
                                                    xl={8}
                                                    lg={8}
                                                    md={12}
                                                    xs={12}
                                                >
                                                    <FormControl fullWidth>
                                                        <InputLabel
                                                            id="demo-simple-select-label"
                                                            error={
                                                                sirenDataFormik
                                                                    .touched
                                                                    .SASCode &&
                                                                !!sirenDataFormik
                                                                    .errors
                                                                    .SASCode
                                                            }
                                                        >
                                                            Secteur d'activité
                                                        </InputLabel>
                                                        <Select
                                                            key="Secteur"
                                                            MenuProps={{
                                                                PaperProps: {
                                                                    style: {
                                                                        maxHeight:
                                                                            "200px",
                                                                        maxWidth:
                                                                            "1000px",
                                                                    },
                                                                },
                                                                autoFocus:
                                                                    false,
                                                            }}
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            label="Secteur d'activité"
                                                            placeholder={
                                                                "Sélectionnez SAS"
                                                            }
                                                            name="SASCode"
                                                            value={
                                                                sirenDataFormik
                                                                    .values
                                                                    .SASCode ??
                                                                ""
                                                            }
                                                            onChange={
                                                                sirenDataFormik.handleChange
                                                            }
                                                            onBlur={
                                                                sirenDataFormik.handleBlur
                                                            }
                                                            error={
                                                                sirenDataFormik
                                                                    .touched
                                                                    .SASCode &&
                                                                !!sirenDataFormik
                                                                    .errors
                                                                    .SASCode
                                                            }
                                                        >
                                                            {ALL_EXTERPRISE_STATUS_CODES.map(
                                                                (
                                                                    code,
                                                                    index
                                                                ) => {
                                                                    return (
                                                                        <MenuItem
                                                                            value={
                                                                                code.code
                                                                            }
                                                                            key={
                                                                                index
                                                                            }
                                                                        >
                                                                            {`${code.code} - ${code.label}`}
                                                                        </MenuItem>
                                                                    );
                                                                }
                                                            )}
                                                        </Select>

                                                        {/* <FormHelperText
                              id="component-helper-text"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Typography variant="caption" color="secondary" className="noteText">
                                <InfoRoundedIcon fontSize="small" color="secondary" />
                                Attention, nous avons trouvé un code NAF similaire permettant d'obtenir une valorisation précise, si vous estimez qu'il ne corresponds pas à votre activité, sélectionnez 'Autres activités'
                              </Typography>
                            </FormHelperText> */}
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        </div>
                                    </Slide>
                                )}
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <Box className="formFooter">
                                <Button
                                    endIcon={<img src={endIcon} alt="" />}
                                    variant="contained"
                                    color="secondary"
                                    onClick={sirenDataFormik.submitForm}
                                    disabled={!sirenDataFormik.isValid}
                                >
                                    Suivant
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            )}

            {hasSiren && (
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
                                    Introduction
                                </Typography>
                                <Typography>
                                    Afin de garantir la fiabilité de la
                                    valorisation, veuillez répondre aux
                                    questions suivantes de manière la plus
                                    objective possible
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
                                            Que voulez-vous valoriser ?{" "}
                                            <StyledTooltip
                                                className="tooltip"
                                                title={<div>
                                                    Le fonds de commerce est l'ensemble des éléments (clientèle, nom, droit au bail, équipements) qui permettent d'exploiter une activité commerciale. L'achat d'un fonds de commerce permet donc de reprendre l'activité sans devenir propriétaire de l'entreprise.<br/><br/>

Les titres de société représentent la détention de parts ou actions dans le capital d'une entreprise, conférant des droits financiers (dividendes) et de gouvernance (vote). Acquérir des titres de société revient à entrer dans l'entité juridique, incluant la gestion du fonds de commerce s'il y en a un. 
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
                                            Sélectionner l'élément à valoriser.
                                        </Typography>
                                    </Grid>
                                    <Grid item xl={8} lg={8} md={12} xs={12}>
                                        <FormControl fullWidth>
                                            <FormControl fullWidth>
                                                <InputLabel
                                                    error={
                                                        companyDataFormik
                                                            .touched
                                                            .valueBasedOn &&
                                                        !!companyDataFormik
                                                            .errors.valueBasedOn
                                                    }
                                                >
                                                    Que voulez-vous valoriser ?
                                                </InputLabel>
                                                <Select
                                                    MenuProps={{
                                                        PaperProps: {
                                                            style: {
                                                                maxHeight:
                                                                    "200px",
                                                            },
                                                        },
                                                    }}
                                                    labelId="demo-simple-select-label "
                                                    id="demo-simple-select"
                                                    label="Que voulez-vous valoriser ?"
                                                    placeholder={
                                                        "Que voulez-vous valoriser ?"
                                                    }
                                                    name="valueBasedOn"
                                                    value={
                                                        companyDataFormik.values
                                                            .valueBasedOn ?? ""
                                                    }
                                                    onChange={
                                                        companyDataFormik.handleChange
                                                    }
                                                    onBlur={
                                                        companyDataFormik.handleBlur
                                                    }
                                                    error={
                                                        companyDataFormik
                                                            .touched
                                                            .valueBasedOn &&
                                                        !!companyDataFormik
                                                            .errors.valueBasedOn
                                                    }
                                                >
                                                    {ENTERPRISE_VALUE_OPTIONS.map(
                                                        (opt, index) => {
                                                            return (
                                                                <MenuItem
                                                                    value={
                                                                        opt.value
                                                                    }
                                                                    key={index}
                                                                >
                                                                    {opt.label}
                                                                </MenuItem>
                                                            );
                                                        }
                                                    )}
                                                </Select>
                                            </FormControl>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} sx={{ mt: 2 }}>
                                    <Grid item xl={4} lg={4} md={12} xs={12}>
                                        <Typography
                                            variant="h5"
                                            color="textPrimary"
                                            className="formLabel"
                                        >
                                            {" "}
                                            Quel est la maturité de votre
                                            entreprise ?
                                            <StyledTooltip
                                                className="tooltip"
                                                title={<div>
                                                    La maturité de l'entreprise correspond à son stade de développement.<br/>
1. Croissance : L'entreprise est en pleine expansion, avec une large augmentation de ses parts de marché et de son chiffre d'affaires.<br/>
2. Stable : L'entreprise atteint une phase de stabilité, où la croissance et les performances sont stables.<br/>
3. Déclin : L'entreprise subit une baisse de ses performances et de son chiffre d'affaires, souvent due à une diminution de la demande ou à une forte concurrence.
                                                </div>}
                                                placement="right"
                                                color="colorSecondary"
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
                                        <FormControl fullWidth>
                                            <InputLabel
                                                error={
                                                    companyDataFormik.touched
                                                        .maturity &&
                                                    !!companyDataFormik.errors
                                                        .maturity
                                                }
                                            >
                                                Quel est la maturité de votre
                                                entreprise ?
                                            </InputLabel>
                                            <Select
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: "200px",
                                                        },
                                                    },
                                                }}
                                                labelId="demo-simple-select-label "
                                                id="demo-simple-select"
                                                label="Quel est la maturité de votre entreprise ?"
                                                placeholder={
                                                    "Quel est la maturité de votre entreprise ?"
                                                }
                                                name="maturity"
                                                value={
                                                    companyDataFormik.values
                                                        .maturity ?? ""
                                                }
                                                onChange={
                                                    companyDataFormik.handleChange
                                                }
                                                onBlur={
                                                    companyDataFormik.handleBlur
                                                }
                                                error={
                                                    companyDataFormik.touched
                                                        .maturity &&
                                                    !!companyDataFormik.errors
                                                        .maturity
                                                }
                                            >
                                                {ENTERPRISE_MATURITY_VALUES.map(
                                                    (opt, index) => {
                                                        return (
                                                            <MenuItem
                                                                value={
                                                                    opt.value
                                                                }
                                                                key={index}
                                                            >
                                                                {opt.label}
                                                            </MenuItem>
                                                        );
                                                    }
                                                )}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} sx={{ mt: 2 }}>
                                    <Grid item xl={4} lg={4} md={12} xs={12}>
                                        <Typography
                                            variant="h5"
                                            color="textPrimary"
                                            className="formLabel"
                                        >
                                            Durée des exercices
                                            <StyledTooltip
                                                className="tooltip"
                                                title={<div>
                                                    Si la durée de l'exercice est différente de 12 mois, veuillez modifier le nombre de mois. (Les données seront ainsi proratisées selon une période de 12 mois). 
                                                </div>}
                                                placement="right"
                                            >
                                                <InfoRoundedIcon
                                                    className="tooltipIcon"
                                                    sx={{ color: theme.palette.grey["500"] }}
                                                    fontSize="small"
                                                />
                                            </StyledTooltip>
                                        </Typography>
                                    </Grid>
                                    <Grid item xl={8} lg={8} md={12} xs={12}>
                                        <Box mb={2}>
                                            <Grid container spacing={2}>
                                                <Grid item xl={4} lg={4} md={12} xs={12}>
                                                    <Typography
                                                        variant="subtitle2"
                                                        color="textSecondary"
                                                        sx={{ mb: 1 }}
                                                    >
                                                        Exercice N
                                                    </Typography>
                                                    <FormControl fullWidth>
                                                        <InputLabel
                                                            error={companyDataFormik.touched.months?.n && !!companyDataFormik.errors.months?.n}
                                                        >
                                                            Nombre de mois
                                                        </InputLabel>
                                                        <Select
                                                            MenuProps={{
                                                                PaperProps: {
                                                                    style: {
                                                                        maxHeight: "200px",
                                                                    },
                                                                },
                                                            }}
                                                            labelId="demo-simple-select-label"
                                                            label="Nombre de mois"
                                                            name="months.n"
                                                            value={companyDataFormik.values.months?.n ?? ""}
                                                            onChange={companyDataFormik.handleChange}
                                                            onBlur={companyDataFormik.handleBlur}
                                                            error={companyDataFormik.touched.months?.n && !!companyDataFormik.errors.months?.n}
                                                        >
                                                            {FEC_MONTHS_OPTIONS.map(
                                                                (opt, index) => (
                                                                    <MenuItem value={opt.value} key={index}>
                                                                        {opt.label}
                                                                    </MenuItem>
                                                                )
                                                            )}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xl={4} lg={4} md={12} xs={12}>
                                                    <Typography
                                                        variant="subtitle2"
                                                        color="textSecondary"
                                                        sx={{ mb: 1 }}
                                                    >
                                                        Exercice N-1
                                                    </Typography>
                                                    <FormControl fullWidth>
                                                        <InputLabel
                                                            error={companyDataFormik.touched.months?.n1 && !!companyDataFormik.errors.months?.n1}
                                                        >
                                                            Nombre de mois
                                                        </InputLabel>
                                                        <Select
                                                            MenuProps={{
                                                                PaperProps: {
                                                                    style: {
                                                                        maxHeight: "200px",
                                                                    },
                                                                },
                                                            }}
                                                            labelId="demo-simple-select-label"
                                                            label="Nombre de mois"
                                                            name="months.n1"
                                                            value={companyDataFormik.values.months?.n1 ?? ""}
                                                            onChange={companyDataFormik.handleChange}
                                                            onBlur={companyDataFormik.handleBlur}
                                                            error={companyDataFormik.touched.months?.n1 && !!companyDataFormik.errors.months?.n1}
                                                        >
                                                            {FEC_MONTHS_OPTIONS.map(
                                                                (opt, index) => (
                                                                    <MenuItem value={opt.value} key={index}>
                                                                        {opt.label}
                                                                    </MenuItem>
                                                                )
                                                            )}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xl={4} lg={4} md={12} xs={12}>
                                                    <Typography
                                                        variant="subtitle2"
                                                        color="textSecondary"
                                                        sx={{ mb: 1 }}
                                                    >
                                                        Exercice N-2
                                                    </Typography>
                                                    <FormControl fullWidth>
                                                        <InputLabel
                                                            error={companyDataFormik.touched.months?.n2 && !!companyDataFormik.errors.months?.n2}
                                                        >
                                                            Nombre de mois
                                                        </InputLabel>
                                                        <Select
                                                            MenuProps={{
                                                                PaperProps: {
                                                                    style: {
                                                                        maxHeight: "200px",
                                                                    },
                                                                },
                                                            }}
                                                            labelId="demo-simple-select-label"
                                                            label="Nombre de mois"
                                                            name="months.n2"
                                                            value={companyDataFormik.values.months?.n2 ?? ""}
                                                            onChange={companyDataFormik.handleChange}
                                                            onBlur={companyDataFormik.handleBlur}
                                                            error={companyDataFormik.touched.months?.n2 && !!companyDataFormik.errors.months?.n2}
                                                        >
                                                            {FEC_MONTHS_OPTIONS.map(
                                                                (opt, index) => (
                                                                    <MenuItem value={opt.value} key={index}>
                                                                        {opt.label}
                                                                    </MenuItem>
                                                                )
                                                            )}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} sx={{ mt: 2 }}>
                                    <Grid item xl={4} lg={4} md={12} xs={12}>
                                        <Typography
                                            variant="h5"
                                            color="textPrimary"
                                            className="formLabel"
                                        >
                                            Importer vos 3 FEC
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            color={"textSecondary"}
                                        >
                                            Fichiers des écritures comptables
                                        </Typography>
                                    </Grid>
                                    <Grid item xl={8} lg={8} md={12} xs={12}>
                                        <Box className="docdWrp">
                                            {files.sort((a, b) => Number(b.name?.split("FEC")?.[1]?.substring(0, 4) ?? "0") - Number(a.name?.split("FEC")?.[1]?.substring(0, 4) ?? "0")).map((file, index) => {
                                                const size = (file.size / (1024 * 1024)).toFixed(1);
                                                return (
                                                    <Card
                                                        key={`${file.name}_${index}`}
                                                        className="uploadFileBox"
                                                        sx={{
                                                            border: `1px solid ${theme.palette.grey["200"]}`,
                                                        }}
                                                    >
                                                        <Box
                                                            className="uploadFileTop"
                                                            sx={{ mb: 2 }}
                                                        >
                                                            <Box className="fileSize">
                                                                <img
                                                                    src={icWord}
                                                                    alt=""
                                                                />
                                                                <Typography
                                                                    sx={{
                                                                        color: theme
                                                                            .palette
                                                                            .grey[
                                                                            "500"
                                                                        ],
                                                                    }}
                                                                >
                                                                    {`${size} MB`}
                                                                </Typography>
                                                            </Box>
                                                            <Button
                                                                variant="text"
                                                                size="small"
                                                                className="icon"
                                                                onClick={() =>
                                                                    handleFileRemove(
                                                                        index
                                                                    )
                                                                }
                                                            >
                                                                <CloseRoundedIcon
                                                                    sx={{
                                                                        color: theme
                                                                            .palette
                                                                            .primary
                                                                            .main,
                                                                    }}
                                                                />
                                                            </Button>
                                                        </Box>
                                                        <Typography
                                                            component={"p"}
                                                            color={
                                                                "textPrimary"
                                                            }
                                                            title={file.name}
                                                            className="fileName"
                                                        >
                                                            {file.name}
                                                        </Typography>
                                                    </Card>
                                                );
                                            })}

                                            {files.length !== 3 && (
                                                <UploadBox
                                                    placeholder={
                                                        <Stack
                                                            spacing={0.5}
                                                            alignItems="center"
                                                        >
                                                            <Iconify
                                                                icon="eva:cloud-upload-fill"
                                                                width={40}
                                                            />
                                                            <Typography variant="body2">
                                                                Importer un
                                                                fichier (.csv,
                                                                .xlsx accepté)
                                                            </Typography>
                                                        </Stack>
                                                    }
                                                    sx={{
                                                        flexGrow: 1,
                                                        height: "auto",
                                                        py: 2.5,
                                                        mb: 3,
                                                        width: "100%",
                                                    }}
                                                    onDrop={handleFileUpload}
                                                />
                                            )}
                                        </Box>
                                        {companyDataFormik.touched.FEC &&
                                            companyDataFormik.errors.FEC && (
                                                <FormHelperText error>
                                                    {
                                                        companyDataFormik.errors
                                                            .FEC
                                                    }
                                                </FormHelperText>
                                            )}
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box className="formFooter">
                                <Box></Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box className="formFooter">
                                <Button
                                    endIcon={<img src={endIcon} alt="" />}
                                    variant="contained"
                                    color="secondary"
                                    onClick={companyDataFormik.submitForm}
                                    disabled={!companyDataFormik.isValid}
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

export default Step1;
