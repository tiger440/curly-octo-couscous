interface CodeList {
    code: string,
}

export const getClosestData = (selectedCode: string, codeList: CodeList[] = []) => {
    const defaultMatch = codeList.pop()
    const minMatchingChars = 3;
    let closestMatch: CodeList | null = null;
    selectedCode = selectedCode.split('.').join('')


    for (let i = 0; i < codeList.length; i++) {
        const predefinedCode = codeList[i].code;
        let matchingChars = 0;

        for (let j = 0; j < selectedCode.length && j < predefinedCode.length; j++) {
            if (selectedCode[j] === predefinedCode[j]) {
                matchingChars++;
            } else {
                break;
            }
        }


        if (selectedCode.length === matchingChars) {
            closestMatch = codeList[i]
            break
        }


        if (matchingChars >= minMatchingChars) {
            if (!closestMatch) {
                closestMatch = codeList[i]
            } else {
                const closestCode = Number(closestMatch.code.substring(0, closestMatch.code.length - 1))
                const currentCode = Number(predefinedCode.substring(0, predefinedCode.length - 1))
                const selectedCodeValue = Number(selectedCode.substring(0, selectedCode.length - 1))
                const currentDif = Math.abs(selectedCodeValue - currentCode)
                const closestDif = Math.abs(selectedCodeValue - closestCode)

                if (currentDif < closestDif) {
                    closestMatch = codeList[i]
                }
            }
        }
    }

    return closestMatch ?? defaultMatch;
}

export const getExactMatch = (selectedCode: string, codeList: CodeList[] = []) => {
    const matches = codeList.filter((item) => selectedCode.includes(item.code))
    return matches[0]?.code ?? ''
}

export const getExactCAData = (selectedCode: string, codeList: {
    activity: string;
    code: string;
    lebel: string;
    CA: string;
}[] = []) => {
    const defaultData = codeList.pop()
    const parsedSelectedCode = selectedCode.split('.').join('')
    const matches = codeList.filter((item) => item.code.includes(parsedSelectedCode))
    return matches[0] ?? defaultData
}
