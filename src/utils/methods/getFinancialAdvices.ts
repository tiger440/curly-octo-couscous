import { FINANCIAL_ADVICE } from "../constants/financialAdvice";
import { FinancialCriteria } from "../types/enterpriseForm";
interface AdviceItem {
    title: string,
    description: string
    question: string,
    answer: string,
}
interface advicesResponseType {
    organization?: AdviceItem[],
    positioning?: AdviceItem[],
    innovation?: AdviceItem[],
    quality?: AdviceItem[],
    strategie?: AdviceItem[],
}

export const getFinancialAdvices = (financialCriteriaValues: FinancialCriteria) => {
    const advicesResponse: advicesResponseType = {}

    if (Object.keys(financialCriteriaValues ?? {}).length > 0) {
        Object.keys(financialCriteriaValues).forEach((criteriaKey) => {
            const subCriteria = financialCriteriaValues[criteriaKey]

            if (Object.keys(subCriteria).length > 0) {
                Object.keys(subCriteria).forEach((subCriteriaKey) => {
                    if (financialCriteriaValues[criteriaKey][subCriteriaKey] !== 'nonApplicable') {
                        if (!advicesResponse[criteriaKey]) {
                            advicesResponse[criteriaKey] = [];
                        }

                        advicesResponse[criteriaKey] = [...advicesResponse[criteriaKey], {
                            criteriaKey,
                            subCriteriaKey,
                            title: FINANCIAL_ADVICE[criteriaKey][subCriteriaKey].title,
                            description: FINANCIAL_ADVICE[criteriaKey][subCriteriaKey][financialCriteriaValues[criteriaKey][subCriteriaKey]],
                            answer: financialCriteriaValues[criteriaKey][subCriteriaKey]
                        }]
                    }
                })
            }

        })
    }

    return advicesResponse
}

