export const convertAndDownloadCSV = (files: File[]) => {
    files.forEach(file => {
        if (file.type.match('text.*')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const tsvContent = event.target?.result as string;
                const csvContent = convertTSVtoCSV(tsvContent ?? '');
                downloadCSV(csvContent, file.name.replace('.txt', '.csv'));
            };
            reader.readAsText(file);
        } else {
            console.error('Invalid file type. Only text files are supported.');
        }
    })
}

const convertTSVtoCSV = (tsvContent: string) => {
    // Check for tab delimiter. If found, replace tabs with commas.
    if (tsvContent.includes("\t")) {
        return tsvContent.replace(/\t/g, ',');
    }

    // Otherwise, check for pipe delimiter and replace with commas.
    if (tsvContent.includes("|")) {
        return tsvContent.replace(/\|/g, ',');
    }

    // If no known delimiter is found, return content as-is.
    return tsvContent;
}

const downloadCSV = (csvContent, fileName) => {
    const blob = new Blob([csvContent], { type: 'text/csv' });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
}