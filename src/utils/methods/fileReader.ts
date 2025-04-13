export const fileReader = (file: File) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result;
            resolve(content);
        }
        reader.onerror = () => {
            reject("error reading file");
        }
        reader.readAsText(file);
    })
}


export const getArrayFromTSV = (tsvString: string) => {
    const rows = tsvString.split('\n')
    const result: Array<Array<string>> = []

    for (let i = 0; i < rows.length; i++) {
        const columns = rows[i].split('\t');
        result.push(columns);
    }

    const finalResult: any[] = []
    const keys = result.shift()
    if (keys) {
        for (let i = 0; i < result.length; i++) {
            const obj = {}
            for (let j = 0; j < keys.length; j++) {
                obj[keys[j]] = result[i][j]
            }
            finalResult.push(obj)
        }
    }

    return finalResult;
}