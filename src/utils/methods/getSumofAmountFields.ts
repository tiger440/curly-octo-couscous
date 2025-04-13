export const getSumofAmountFields = (arr: any[], prefixNum: string, isDiff: boolean = false, monthCoefficient: string, field: string = 'CompteNum') => {
    const filteredArray = arr.filter((item) => {
        if (item[field]) {
            const res = item[field].startsWith(prefixNum)
            return res
        }
        return false
    })

    let creditTotal = 0, debitTotal = 0
    filteredArray.forEach((item) => {
        creditTotal += getNumber(item.Credit)
        debitTotal += getNumber(item.Debit)
    })


    if (isDiff) {
        let total = debitTotal - creditTotal

        if (monthCoefficient && monthCoefficient !== '') {
            total = (total / 12) * Number(monthCoefficient)
        }
        return total.toFixed(2)
    }

    if (monthCoefficient && monthCoefficient !== '') {
        creditTotal = (creditTotal / 12) * Number(monthCoefficient)
    }
    return creditTotal.toFixed(2)
}

export const getNumber = (num: string) => {
    return num ? Number(num.replace(/,/g, ".")) : 0.0
}

