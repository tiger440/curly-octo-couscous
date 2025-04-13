import { ADVANCEMENT_EXTRA_CRITERIA_OPTIONS_VALUES, PROGRESS_EXTRAINNOVATION_OPTIONS_VALUES } from "../constants/extraData"

export const getTotalValuationDiffUsingExtraFinancials = (answers, valuationData) => {
    const amountFinancialValuationOfBusinessAssets = valuationData.amountFinancialValuationOfBusinessAssets ?? 0

    const totalExtraFinancialOrganization: number = ADVANCEMENT_EXTRA_CRITERIA_OPTIONS_VALUES[answers.organization.isGovernanceStructured] + ADVANCEMENT_EXTRA_CRITERIA_OPTIONS_VALUES[answers.organization.isReportsProduced]
    const totalExtraFinancialPositioning: number = ADVANCEMENT_EXTRA_CRITERIA_OPTIONS_VALUES[answers.positioning.haveQualityBrandImages] + ADVANCEMENT_EXTRA_CRITERIA_OPTIONS_VALUES[answers.positioning.haveCertification]

    const totalInnovation: number = PROGRESS_EXTRAINNOVATION_OPTIONS_VALUES[answers.innovation.haveInnovationPolicy] + PROGRESS_EXTRAINNOVATION_OPTIONS_VALUES[answers.innovation.doesPolicyBenifitFromTax] + PROGRESS_EXTRAINNOVATION_OPTIONS_VALUES[answers.innovation.havePatent]

    const totalQuality: number = ADVANCEMENT_EXTRA_CRITERIA_OPTIONS_VALUES[answers.quality.haveFormalizedQualityPolicy] + ADVANCEMENT_EXTRA_CRITERIA_OPTIONS_VALUES[answers.quality.haveQualityCertification]
    const totalStraregy: number = ADVANCEMENT_EXTRA_CRITERIA_OPTIONS_VALUES[answers.strategie.haveFormalizedCSREnvironmentalPolicy] + ADVANCEMENT_EXTRA_CRITERIA_OPTIONS_VALUES[answers.strategie.haveEnvironmentalCSRCertifications]


    const totalExtraFinancialCoefficient = 1 + totalExtraFinancialOrganization + totalExtraFinancialPositioning + totalInnovation + totalQuality + totalStraregy
    const totalValuation = totalExtraFinancialCoefficient * amountFinancialValuationOfBusinessAssets

    return Math.round(totalValuation - valuationData.totalValuation)
}