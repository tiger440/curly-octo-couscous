export interface EnterpriseDetails {
    siren?: string,
    SASCode?: string | null,
    maturity?: string | null,
    valueBasedOn?: string | null,
    months?: YearsDataType
}

export interface Ebidta {
    achats?: YearsDataType;
    chargesExternes?: YearsDataType;
    chargesDuPersonnel?: YearsDataType;
    autresChargesExploitation?: YearsDataType;
}

export interface Retraitement {
    remuneration: YearsDataType
    normalRemuneration: YearsDataType
}

export interface financialDataType {
    file: File, fileContent: any[]
}

export interface YearsDataType {
    n: string;
    n1: string;
    n2: string;
}

export interface RatingDetails {
    VNCOfNonActiveFixedAssets?: string
    realValueOfProperties?: string
    equity?: string
    dividendDistributionsNp1?: string
}

export interface FinancialCriteria {
    organization?: {
        isGovernanceStructured: string,
        isReportsProduced: string,
    },
    positioning?: {
        haveQualityBrandImages: string,
        haveCertification: string,
    },
    innovation?: {
        haveInnovationPolicy: string,
        doesPolicyBenifitFromTax: string,
        havePatent: string
    },
    quality?: {
        haveFormalizedQualityPolicy: string,
        haveQualityCertification: string
    },
    strategie?: {
        haveFormalizedCSREnvironmentalPolicy: string,
        haveEnvironmentalCSRCertifications: string,
    }
}

export interface YearsAmountType {
    n: number;
    n1: number;
    n2: number;
}

export interface Results {
    goodwill?: {
        n?: string | undefined;
        n1?: string | undefined;
        n2?: string | undefined;
    },
    weightedAverageTurnover?: number,
    averageRatio?: {
        activity: string;
        code: string;
        lebel: string;
        CA: string;
    },
    perOfTurnoverCA?: number,
    EBIDTA?: YearsAmountType,
    EBIDTARetraitement?: YearsAmountType,
    weightedAverageEBIDTA?: number,
    ratio?: {
        label?: string;
        value?: string;
        EBE?: number;
        col?: number;
    },
    evaluationViaMultipleEBIDTA_EBE?: number,
    amountFinancialValuationOfBusinessAssets?: number,
    totalExtraFinancialOrganization?: number,
    totalExtraFinancialPositioning?: number,
    totalExtraFinancialCoefficient?: number,
    totalValuation?: number,
    totalInnovation?: number,
    totalQuality?: number,
    totalStraregy?: number,
    companyValueBasedOnEvaluation?: number,
}

