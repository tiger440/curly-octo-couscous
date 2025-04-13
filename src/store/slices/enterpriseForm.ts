import { createSlice } from '@reduxjs/toolkit'
import { ADVANCEMENT_EXTRA_CRITERIA_OPTIONS_VALUES, ENTERPRISE_MATURITY_VALUES, PROGRESS_EXTRAINNOVATION_OPTIONS_VALUES, initialCode } from 'src/utils/constants/extraData';
import { EXTERPRISE_STATUS_CODES } from 'src/utils/constants/statusCode';
import { getArrayFromTSV } from 'src/utils/methods/fileReader';
import { getExactCAData } from 'src/utils/methods/getClosestData';
import { getSumofAmountFields } from 'src/utils/methods/getSumofAmountFields';
import { Ebidta, EnterpriseDetails, FinancialCriteria, RatingDetails, Results, Retraitement, YearsDataType, financialDataType } from 'src/utils/types/enterpriseForm';

export interface formDataType {
    enterpriseDetails: EnterpriseDetails,
    ebidtaDetails: {
        goodwill?: YearsDataType
        ebidta?: Ebidta
        retraitement?: Retraitement
    },
    fileData?: financialDataType[]
    ratingDetails: RatingDetails,
    financialCriteria: FinancialCriteria,
    completedStep: number,
    isEditMode: boolean,
    hasSiren: boolean,
    hasGoodwill: boolean,
    hasSasData: boolean,
    results: Results,
    enterpriseName: string,
    enterpriseData: any,
    capital: number | null,
    is3rdStepSkipped: boolean,
    isSubmitted: boolean,
}

interface yearlyFinancialDataType {
    n: financialDataType,
    n1: financialDataType,
    n2: financialDataType,
}

const initialState: formDataType = {
    enterpriseDetails: {},
    ebidtaDetails: {},
    ratingDetails: {},
    financialCriteria: {},
    completedStep: 0,
    isEditMode: false,
    hasSiren: false,
    hasGoodwill: false,
    hasSasData: false,
    results: {},
    enterpriseName: '',
    enterpriseData: null,
    capital: null,
    is3rdStepSkipped: false,
    isSubmitted: false,
}


export const enterpriseForm = createSlice({
    name: 'enterpriseForm',
    initialState,
    reducers: {
        addSirenData: (state, action) => {
            return {
                ...state,

                enterpriseDetails: {
                    ...state.enterpriseDetails,
                    ...action.payload
                }

            }
        },
        addSiren: (state, action) => {
            return {
                ...state,
                hasSiren: action.payload,
            }
        },
        addCompanyData: (state, action) => {
            const payload = { ...action.payload }
            let tmpIs3rdStepSkipped = false

            if (payload.valueBasedOn === 'Fonds de commerce') {
                tmpIs3rdStepSkipped = true
            }

            return {
                ...state,
                enterpriseDetails: {
                    ...state.enterpriseDetails,
                    ...payload
                },
                is3rdStepSkipped: tmpIs3rdStepSkipped,
                completedStep: 1
            }
        },
        addFileData: (state, action) => {
            const fileData: { file: File, fileContent: string }[] = action.payload

            const parsedFileData: financialDataType[] = fileData.map((fileItem) => {

                const parsedData = getArrayFromTSV(fileItem.fileContent)
                return {
                    ...fileItem,
                    fileContent: parsedData
                }
            })
            parsedFileData.sort((fileA, fileB) => {
                let yearA: string | number = fileA.file.name.split('FEC')[1].slice(0, 1)
                let yearB: string | number = fileB.file.name.split('FEC')[1].slice(0, 1)
                yearA = Number(yearA)
                yearB = Number(yearB)
                return yearA - yearB
            })

            const yearlyFinancialData: yearlyFinancialDataType = {
                n: parsedFileData[0],
                n1: parsedFileData[1],
                n2: parsedFileData[2],
            }

            const months: YearsDataType = {
                ...state.enterpriseDetails.months ?? { n: '', n1: '', n2: '' }
            }

            const goodwill = {
                n: getSumofAmountFields(yearlyFinancialData.n.fileContent, initialCode['70x'], false, months.n),
                n1: getSumofAmountFields(yearlyFinancialData.n1.fileContent, initialCode['70x'], false, months.n1),
                n2: getSumofAmountFields(yearlyFinancialData.n2.fileContent, initialCode['70x'], false, months.n2),
            }

            const EBIDTA = {
                achats: {
                    n: getSumofAmountFields(yearlyFinancialData.n.fileContent, initialCode['60x'], true, months.n),
                    n1: getSumofAmountFields(yearlyFinancialData.n1.fileContent, initialCode['60x'], true, months.n1),
                    n2: getSumofAmountFields(yearlyFinancialData.n2.fileContent, initialCode['60x'], true, months.n2),
                },
                chargesExternes: {
                    n: (Number(getSumofAmountFields(yearlyFinancialData.n.fileContent, initialCode['61x'], true, months.n)) +
                        Number(getSumofAmountFields(yearlyFinancialData.n.fileContent, initialCode['62x'], true, months.n))).toFixed(2),
                    n1: (Number(getSumofAmountFields(yearlyFinancialData.n1.fileContent, initialCode['61x'], true, months.n1)) +
                        Number(getSumofAmountFields(yearlyFinancialData.n1.fileContent, initialCode['62x'], true, months.n1))).toFixed(2),
                    n2: (Number(getSumofAmountFields(yearlyFinancialData.n2.fileContent, initialCode['61x'], true, months.n2)) +
                        Number(getSumofAmountFields(yearlyFinancialData.n2.fileContent, initialCode['62x'], true, months.n2))).toFixed(2),
                },
                chargesDuPersonnel: {
                    n: getSumofAmountFields(yearlyFinancialData.n.fileContent, initialCode['64x'], true, months.n),
                    n1: getSumofAmountFields(yearlyFinancialData.n1.fileContent, initialCode['64x'], true, months.n1),
                    n2: getSumofAmountFields(yearlyFinancialData.n2.fileContent, initialCode['64x'], true, months.n2),
                },
                autresChargesExploitation: {
                    n: getSumofAmountFields(yearlyFinancialData.n.fileContent, initialCode['65x'], true, months.n),
                    n1: getSumofAmountFields(yearlyFinancialData.n1.fileContent, initialCode['65x'], true, months.n1),
                    n2: getSumofAmountFields(yearlyFinancialData.n2.fileContent, initialCode['65x'], true, months.n2),
                },
            }

            const retraitement = {
                remuneration: {
                    n: (Number(getSumofAmountFields(yearlyFinancialData.n.fileContent, initialCode['644x'], true, months.n)) +
                        Number(getSumofAmountFields(yearlyFinancialData.n.fileContent, initialCode['646x'], true, months.n))).toFixed(2),
                    n1: (Number(getSumofAmountFields(yearlyFinancialData.n1.fileContent, initialCode['644x'], true, months.n1)) +
                        Number(getSumofAmountFields(yearlyFinancialData.n1.fileContent, initialCode['646x'], true, months.n1))).toFixed(2),
                    n2: (Number(getSumofAmountFields(yearlyFinancialData.n2.fileContent, initialCode['644x'], true, months.n2)) +
                        Number(getSumofAmountFields(yearlyFinancialData.n2.fileContent, initialCode['646x'], true, months.n2))).toFixed(2),
                }
            }

            // For result page
            const capital = Number(getSumofAmountFields(yearlyFinancialData.n.fileContent, initialCode['1013X'], false, months.n))

            return {
                ...state,
                ebidtaDetails: {
                    goodwill: {
                        ...goodwill
                    },
                    ebidta: {
                        ...EBIDTA
                    },
                    retraitement: {
                        ...retraitement,
                        normalRemuneration: {
                            n: '',
                            n1: '',
                            n2: '',
                        }
                    }
                },
                fileData: [...parsedFileData],
                capital: capital
            }
        },
        addGoodwillData: (state, action) => {
            return {
                ...state,
                ebidtaDetails: {
                    ...state.ebidtaDetails,
                    ...action.payload
                },
                hasGoodwill: true,
            }
        },
        resetGoodwillStep: (state) => {
            return {
                ...state,
                hasGoodwill: false,
            }
        },
        addEbidtaData: (state, action) => {
            return {
                ...state,
                ebidtaDetails: {
                    ...state.ebidtaDetails,
                    ...action.payload
                },
                completedStep: 2
            }
        },
        addRatingData: (state, action) => {
            return {
                ...state,
                ratingDetails: { ...action.payload },
                completedStep: 3
            }
        },
        addFinancialCriteriaDataAndCalculateResult: (state, action) => {
            let tmpstate = {
                ...state,
                financialCriteria: {
                    ...action.payload
                },
                completedStep: 4
            }

            const goodwill = { ...tmpstate.ebidtaDetails.goodwill }
            const weightedAverageTurnover = (Number(goodwill.n) * 3 + Number(goodwill.n1) * 2 + Number(goodwill.n2)) / 6
            const SASCode = tmpstate.enterpriseDetails.SASCode
            const SASCodeData = getExactCAData(SASCode ?? '', [...EXTERPRISE_STATUS_CODES])
            const averageRatio = SASCodeData

            const perOfTurnoverCA = (weightedAverageTurnover * Number(averageRatio?.CA ?? 1)) / 100


            const ebidtaDetails = { ...tmpstate.ebidtaDetails.ebidta }

            const EBIDTA = {
                n: Number(goodwill.n) -
                    Number(ebidtaDetails.achats?.n) -
                    Number(ebidtaDetails.chargesExternes?.n) -
                    Number(ebidtaDetails.chargesDuPersonnel?.n) -
                    Number(ebidtaDetails.autresChargesExploitation?.n),
                n1: Number(goodwill.n1) -
                    Number(ebidtaDetails.achats?.n1) -
                    Number(ebidtaDetails.chargesExternes?.n1) -
                    Number(ebidtaDetails.chargesDuPersonnel?.n1) -
                    Number(ebidtaDetails.autresChargesExploitation?.n1),
                n2: Number(goodwill.n2) -
                    Number(ebidtaDetails.achats?.n2) -
                    Number(ebidtaDetails.chargesExternes?.n2) -
                    Number(ebidtaDetails.chargesDuPersonnel?.n2) -
                    Number(ebidtaDetails.autresChargesExploitation?.n2),
            }
            const retraitement = { ...tmpstate.ebidtaDetails.retraitement }

            const EBIDTARetraitement = {
                n: EBIDTA.n +
                    Number(retraitement.remuneration?.n) -
                    Number(retraitement.normalRemuneration?.n),
                n1: EBIDTA.n1 +
                    Number(retraitement.remuneration?.n1) -
                    Number(retraitement.normalRemuneration?.n1),
                n2: EBIDTA.n2 +
                    Number(retraitement.remuneration?.n2) -
                    Number(retraitement.normalRemuneration?.n2),
            }


            const weightedAverageEBIDTA = ((EBIDTARetraitement.n * 3) + (EBIDTARetraitement.n1 * 2) + (EBIDTARetraitement.n2)) / 6
            const ratio = ENTERPRISE_MATURITY_VALUES.filter((item) => item.value === tmpstate.enterpriseDetails.maturity)[0]
            const evaluationViaMultipleEBIDTA_EBE = weightedAverageEBIDTA * ratio.EBE


            const amountFinancialValuationOfBusinessAssets = (evaluationViaMultipleEBIDTA_EBE + perOfTurnoverCA) / 2

            const totalExtraFinancialOrganization: number = ADVANCEMENT_EXTRA_CRITERIA_OPTIONS_VALUES[tmpstate.financialCriteria.organization.isGovernanceStructured] + ADVANCEMENT_EXTRA_CRITERIA_OPTIONS_VALUES[tmpstate.financialCriteria.organization.isReportsProduced]
            const totalExtraFinancialPositioning: number = ADVANCEMENT_EXTRA_CRITERIA_OPTIONS_VALUES[tmpstate.financialCriteria.positioning.haveQualityBrandImages] + ADVANCEMENT_EXTRA_CRITERIA_OPTIONS_VALUES[tmpstate.financialCriteria.positioning.haveCertification]

            const totalInnovation: number = PROGRESS_EXTRAINNOVATION_OPTIONS_VALUES[tmpstate.financialCriteria.innovation.haveInnovationPolicy] + PROGRESS_EXTRAINNOVATION_OPTIONS_VALUES[tmpstate.financialCriteria.innovation.doesPolicyBenifitFromTax] + PROGRESS_EXTRAINNOVATION_OPTIONS_VALUES[tmpstate.financialCriteria.innovation.havePatent]

            const totalQuality: number = ADVANCEMENT_EXTRA_CRITERIA_OPTIONS_VALUES[tmpstate.financialCriteria.quality.haveFormalizedQualityPolicy] + ADVANCEMENT_EXTRA_CRITERIA_OPTIONS_VALUES[tmpstate.financialCriteria.quality.haveQualityCertification]
            const totalStraregy: number = ADVANCEMENT_EXTRA_CRITERIA_OPTIONS_VALUES[tmpstate.financialCriteria.strategie.haveFormalizedCSREnvironmentalPolicy] + ADVANCEMENT_EXTRA_CRITERIA_OPTIONS_VALUES[tmpstate.financialCriteria.strategie.haveEnvironmentalCSRCertifications]


            const totalExtraFinancialCoefficient = 1 + totalExtraFinancialOrganization + totalExtraFinancialPositioning + totalInnovation + totalQuality + totalStraregy
            const totalValuation = totalExtraFinancialCoefficient * amountFinancialValuationOfBusinessAssets

            let companyValueBasedOnEvaluation = 0
            if (!tmpstate.is3rdStepSkipped) {
                const ratingDetails = tmpstate.ratingDetails
                companyValueBasedOnEvaluation = amountFinancialValuationOfBusinessAssets -
                    Number(ratingDetails.VNCOfNonActiveFixedAssets) +
                    Number(ratingDetails.realValueOfProperties) +
                    Number(ratingDetails.equity) -
                    Number(ratingDetails.dividendDistributionsNp1)
            }

            tmpstate = {
                ...tmpstate,
                results: {
                    goodwill,
                    weightedAverageTurnover,
                    averageRatio,
                    perOfTurnoverCA,
                    EBIDTA,
                    EBIDTARetraitement,
                    weightedAverageEBIDTA,
                    ratio,
                    evaluationViaMultipleEBIDTA_EBE,
                    amountFinancialValuationOfBusinessAssets,
                    totalExtraFinancialOrganization,
                    totalExtraFinancialPositioning,
                    totalInnovation,
                    totalQuality,
                    totalStraregy,
                    totalExtraFinancialCoefficient,
                    totalValuation,
                    companyValueBasedOnEvaluation
                }
            }
            return {
                ...tmpstate
            }
        },
        submitFormData: (state) => {
            return {
                ...state,
                isSubmitted: true
            }
        },
        resetFormSubmission: (state) => {
            return {
                ...state,
                isSubmitted: false
            }
        },
        setHasSasData: (state, action) => {
            return {
                ...state,
                hasSasData: action.payload
            }
        },
        addEnterpriseData: (state, action) => {
            return {
                ...state,
                enterpriseName: action.payload.name,
                enterpriseData: { ...action.payload.data as any }
            }
        },
        clearFormData: () => {
            return {
                ...initialState
            }
        },

    },
})

export const { addSirenData, addCompanyData, addFileData, addGoodwillData, addEbidtaData, addSiren, addRatingData, addFinancialCriteriaDataAndCalculateResult, setHasSasData, addEnterpriseData, clearFormData, submitFormData, resetFormSubmission, resetGoodwillStep } = enterpriseForm.actions

export default enterpriseForm.reducer