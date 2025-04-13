import jsPDF from "jspdf";
import { PDF_FONT_BOLD, PDF_FONT_BOLD_ITALIC, PDF_FONT_ITALIC, PDF_FONT_NORAML } from "./fonts";
const PAGE_WIDTH = 210
const X_PADDING = 12
const X_PADDING_RIGHT = PAGE_WIDTH - 12
const Y_SHIFT = 9
const BORDER_RADIUS = 4
const gap = (PAGE_WIDTH - 10 - (2 * X_PADDING)) / 2
const gapWithpadding = gap + 12 + 5
let record = true

export const downloadPDF = async (adviceData, entrepriseData, totalValuation, convertToThousands, capital, enterpriseName) => {
    let current_y = 11;
    try {
        const doc = new jsPDF();
        // FONT CONFIGS
        doc.addFileToVFS('transducerNormal.ttf', PDF_FONT_NORAML);
        doc.addFont('transducerNormal.ttf', 'transDucer', 'normal');

        doc.addFileToVFS('transducerItalic.ttf', PDF_FONT_ITALIC);
        doc.addFont('transducerItalic.ttf', 'transDucer', 'italic');

        doc.addFileToVFS('transducerBold.ttf', PDF_FONT_BOLD);
        doc.addFont('transducerBold.ttf', 'transDucer', 'bold');

        doc.addFileToVFS('transducerBoldItalic.ttf', PDF_FONT_BOLD_ITALIC);
        doc.addFont('transducerBoldItalic.ttf', 'transducerBoldItalic', 'normal');

        doc.setFont('transDucer');
        doc.setTextColor('#212B36')
        // BACKGROUND
        const { imgStr: imgString }: any = await imgToBase64('./PDF/A4-Background.png')
        const width = doc.internal.pageSize.getWidth();
        const height = doc.internal.pageSize.getHeight();
        doc.addImage(imgString as string ?? '', 'PNG', 0, 0, width, height)
        // Header
        const { imgStr: logoString, width: logoWidth, height: logoHeight }: any = await imgToBase64('./PDF/Logo-hermes.png')
        doc.addImage(logoString as string ?? '', 'PNG', X_PADDING, current_y, logoWidth / 22, logoHeight / 22)
        doc.setFontSize(8)
        doc.text("Rendez-vous sur", X_PADDING + 133, current_y + 6);
        doc.setTextColor('#F25929')
        doc.setFont('transDucer', 'italic');
        doc.textWithLink("hermes.fr", X_PADDING_RIGHT, current_y + 6, { url: 'https://hermes.fr', align: "right" });
        doc.setTextColor('#212B36')
        doc.setFont('transDucer', 'normal');

        // Meta data section
        current_y += (Y_SHIFT * 3)
        doc.setFontSize(15)
        doc.text("Vos résultats", X_PADDING, current_y)
        doc.setFontSize(8)
        doc.text(`Valorisation effectuée le ${currentDateFrench()}`, X_PADDING_RIGHT, current_y, { align: "right" })
        current_y += Y_SHIFT
        const { imgStr: structure1String, width: structure1Width, height: structure1Height }: any = await imgToBase64('./PDF/structure-1.png')
        doc.addImage(structure1String as string ?? '', 'PNG', X_PADDING - 4.5, current_y - 1, structure1Width / 5.7, structure1Height / 5.7)
        const { imgStr: defaultLogoString, width: defaultLogoWidth, height: defaultLogoHeight }: any = await imgToBase64('./PDF/default-logo-jpg.jpg')
        doc.addImage(defaultLogoString as string ?? '', 'PNG', X_PADDING + 2, current_y + 3, defaultLogoWidth / 5.7, defaultLogoHeight / 5.7)
        doc.text((enterpriseName ?? "Nom entreprise"), X_PADDING + 19, current_y + 9)
        doc.setTextColor('#919EAB')
        doc.text(`En activité depuis le :${entrepriseData?.uniteLegale?.dateCreationUniteLegale ?? 'NA'}`, X_PADDING + 19, current_y + 14)
        doc.setFontSize(7)
        doc.setTextColor('#ffffff')
        doc.text(`Capital de  ${capital ?? '0 €'}`, 157, current_y + 10)
        doc.setTextColor('#919EAB')
        doc.text("Siège social : NA", 157, current_y + 16)
        current_y += (defaultLogoWidth / 5.7) + 2
        current_y += Y_SHIFT
        const { imgStr: s2Img, width: s2Width, height: s2height }: any = await imgToBase64('./PDF/Section-2.png')
        doc.addImage(s2Img as string ?? '', 'PNG', X_PADDING, current_y, s2Width / 5.7, s2height / 5.7)
        doc.setFontSize(13)
        doc.setTextColor('#ffffff')
        const wrappedTextFirstSection = doc.splitTextToSize('Votre entreprise est en constante évolution.', 80);
        doc.text(wrappedTextFirstSection, X_PADDING + 8, current_y + 15);
        doc.setFontSize(9)
        doc.setTextColor('#ffffff')
        const wrappedTextSection = doc.splitTextToSize('Figma ipsum component variant main layer. Pour optimiser votre performance financière, réduisez votre masse salariale.', 90);
        doc.text(wrappedTextSection, X_PADDING + 8, current_y + 29);
        const { imgStr: s3Img, width: s3Width, height: s3height }: any = await imgToBase64('./PDF/Section-3.png')
        doc.addImage(s3Img as string ?? '', 'PNG', X_PADDING + (s2Width / 5.7) + 5, current_y, s3Width / 5.7, s3height / 5.7)
        current_y += s2height / 5.7
        doc.setFontSize(12)
        doc.setTextColor('#023A80')
        const wrappedText = doc.splitTextToSize('La valeur de votre entreprise s’élève à', 60);
        doc.text(wrappedText, X_PADDING + (s2Width / 5.7) + 43, current_y - 35, { align: 'center' });
        doc.setFontSize(18)
        const wrappedTextATitle = doc.splitTextToSize(`${totalValuation ? `${convertToThousands(totalValuation)} €` : "0 €"}`, 54);
        doc.text(wrappedTextATitle, X_PADDING + (s2Width / 5.7) + 43, current_y - 18, { align: 'center' });
        doc.setTextColor('#212B36')

        // ******

        // Advice section
        current_y += (Y_SHIFT * 2)
        doc.setFontSize(15)
        doc.text("Pour aller plus loin", X_PADDING, current_y)
        doc.setFontSize(8)
        current_y += Y_SHIFT - 2
        doc.text(`Découvrez les points à améliorer pour augmenter la valeur de votre entreprise.`, X_PADDING, current_y)

        current_y += Y_SHIFT

        doc.setFontSize(10)
        let number = 0;
        let eventNumber = 0;
        let oddNumber = 0;
        const pageHeight = doc.internal.pageSize.height
        if (adviceData.length % 2 === 0) {
            for (let i = 0; i < adviceData.length / 2; i++) {
                if (current_y < pageHeight - 50) {
                    for (let j = 0; j < 2; j++) {
                        if (number % 2 !== 0) {
                            if (eventNumber < 234.67163742690053) {
                                eventNumber = drawAdviceEvent(doc, adviceData, current_y, number);
                                if (record === true) {
                                    number += 1
                                }

                            }
                        } else {
                            if (oddNumber < 234.67163742690053) {
                                oddNumber = drawAdviceCard(doc, adviceData, current_y, number);
                                if (record === true) {
                                    number += 1
                                }
                            }

                        }
                    }
                }

                const max = (Math.max(eventNumber, oddNumber))
                current_y = max + 4;
            }
        }
        if (adviceData.length % 2 !== 0) {
            const record1 = Math.floor(adviceData.length / 2)
            for (let i = 0; i < record1 + 1; i++) {
                if (current_y < pageHeight - 50) {
                    for (let j = 0; j < 2; j++) {
                        if (number % 2 !== 0) {
                            if (eventNumber < 234.67163742690053) {
                                if (number <= adviceData.length) {
                                    eventNumber = drawAdviceEvent(doc, adviceData, current_y, number);
                                    if (record === true) { number += 1 }
                                }

                            }
                        } else {
                            if (oddNumber < 234.67163742690053) {
                                if (number <= adviceData.length) {
                                    oddNumber = drawAdviceCard(doc, adviceData, current_y, number);
                                    if (record === true) { number += 1 }
                                }

                            }

                        }
                    }
                }

                const max = (Math.max(eventNumber, oddNumber))
                current_y = max + 4;
            }
        }

        if (pageHeight > current_y && number >= adviceData.length) {
            addTitle(doc, current_y)
        }
        if (number < adviceData.length) {
            doc.addPage();
            current_y = 11 + 20
            const { imgStr: imgString }: any = await imgToBase64('./PDF/A4-Background.png')
            const width = doc.internal.pageSize.getWidth();
            const height = doc.internal.pageSize.getHeight();
            doc.addImage(imgString as string ?? '', 'PNG', 0, 0, width, height)
            const secoundPage = adviceData.length - number
            const record = Math.floor(secoundPage / 2)
            doc.setFontSize(10)
            if (secoundPage % 2 !== 0) {
                for (let i = 0; i < record + 1; i++) {
                    for (let j = 0; j < 2; j++) {
                        if (number < adviceData.length && current_y < pageHeight - 50) {
                            if (number % 2 !== 0) {
                                eventNumber = drawAdviceEvent(doc, adviceData, current_y, number);
                                if (record) { number += 1 }
                            } else {
                                oddNumber = drawAdviceCard(doc, adviceData, current_y, number);
                                if (record) { number += 1 }
                            }
                        }
                    }
                    const max = (Math.max(eventNumber, oddNumber))
                    current_y = max + 4;
                }
            }
            if (secoundPage % 2 === 0) {
                for (let i = 0; i < secoundPage / 2; i++) {
                    for (let j = 0; j < 2; j++) {
                        if (number < adviceData.length && current_y < pageHeight - 50) {
                            if (number % 2 !== 0) {
                                eventNumber = drawAdviceEvent(doc, adviceData, current_y, number);
                                if (record) { number += 1 }
                            } else {
                                oddNumber = drawAdviceCard(doc, adviceData, current_y, number);
                                if (record) { number += 1 }
                            }
                        }
                    }
                    const max = (Math.max(eventNumber, oddNumber))
                    current_y = max + 4;
                }
            }
            if (pageHeight > current_y && number >= adviceData.length) {
                addTitle(doc, current_y)
            }
            current_y = 11
            addHeader(doc, current_y)
            addFooters(doc)
        } else {
            current_y = 11
            addHeader(doc, current_y)
            addFooters(doc)
        }
        if (number < adviceData.length) {
            doc.addPage();
            current_y = 11 + 20
            const { imgStr: imgString }: any = await imgToBase64('./PDF/A4-Background.png')
            const width = doc.internal.pageSize.getWidth();
            const height = doc.internal.pageSize.getHeight();
            doc.addImage(imgString as string ?? '', 'PNG', 0, 0, width, height)
            const secoundPage = adviceData.length - number
            const record = Math.floor(secoundPage / 2)
            doc.setFontSize(10)
            if (secoundPage % 2 !== 0) {
                for (let i = 0; i < record + 1; i++) {
                    for (let j = 0; j < 2; j++) {
                        if (number < adviceData.length && current_y < pageHeight - 50) {
                            if (number % 2 !== 0) {
                                eventNumber = drawAdviceEvent(doc, adviceData, current_y, number);
                                if (record) { number += 1 }

                            } else {
                                oddNumber = drawAdviceCard(doc, adviceData, current_y, number);
                                if (record) { number += 1 }

                            }
                        }
                    }

                    const max = (Math.max(eventNumber, oddNumber))
                    current_y = max + 4;
                }
            }
            if (secoundPage % 2 === 0) {
                for (let i = 0; i < secoundPage / 2; i++) {
                    for (let j = 0; j < 2; j++) {
                        if (number < adviceData.length && current_y < pageHeight - 50) {
                            if (number % 2 !== 0) {
                                eventNumber = drawAdviceEvent(doc, adviceData, current_y, number);
                                if (record) { number += 1 }

                            } else {
                                oddNumber = drawAdviceCard(doc, adviceData, current_y, number);
                                if (record) { number += 1 }

                            }
                        }
                    }
                    const max = (Math.max(eventNumber, oddNumber))
                    current_y = max + 4;
                }
            }
            if (pageHeight > current_y && number >= adviceData.length) {
                addTitle(doc, current_y)
            }
            current_y = 11
            addHeader(doc, current_y)
            addFooters(doc)
        } else {
            current_y = 11
            addHeader(doc, current_y)
            addFooters(doc)
        }
        doc.save("Result.pdf");
    } catch (error) {
        console.log('Error while generating PDF :>> ', error);
    }
}

const addHeader = async (doc, current_y) => {
    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 0; i <= pageCount; i++) {
        // const img = new Image()
        // img.src = './PDF/Logo-hermes.png'
        // doc.addImage(img, 'PNG', 12, 11, 39.54545454545455
        //     , 10);
        const { imgStr: logoString, width: logoWidth, height: logoHeight }: any = await imgToBase64('./PDF/Logo-hermes.png')
        console.log("o", current_y)
        doc.addImage(logoString as string ?? '', 'PNG', 12, current_y, logoWidth / 22, logoHeight / 22)
        doc.setFontSize(8)
        doc.text("Rendez-vous sur", X_PADDING + 133, current_y + 6);
        doc.setTextColor('#F25929')
        doc.setFont('transDucer', 'italic');
        doc.textWithLink("hermes.fr", X_PADDING_RIGHT, current_y + 6, { url: 'https://hermes.fr', align: "right" });
        doc.setTextColor('#212B36')
        doc.setFont('transDucer', 'normal');
    }
}

const addTitle = async (doc, current_y,) => {
    doc.setTextColor('#000000')
    doc.setFontSize(9)
    const title = doc.splitTextToSize(`Retrouvez toutes les informations complémentaires dans la rubrique`, (PAGE_WIDTH - 9 - (2 * X_PADDING)))
    doc.text(title, X_PADDING + 20, current_y + Y_SHIFT);
    current_y = current_y + 6
    doc.setTextColor('#F25929')
    doc.setFontSize(9)
    const titleOrange = doc.splitTextToSize(`“Mes valorisations"`, (PAGE_WIDTH - 9 - (2 * X_PADDING)))
    doc.text(titleOrange, X_PADDING + 45, current_y + Y_SHIFT);
    doc.setTextColor('#000000')
    doc.setFontSize(9)
    const titleBlack = doc.splitTextToSize(`sur votre compte Hermes.`, (PAGE_WIDTH - 9 - (2 * X_PADDING)))
    doc.text(titleBlack, X_PADDING + 88, current_y + Y_SHIFT);
}
const addFooters = async (doc) => {
    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
        doc.setFontSize(8)
        doc.setPage(i)
        doc.setFillColor('#023A80');
        doc.rect(0, 280, 210, 30, 'F');
        const img = new Image()
        img.src = './PDF/email.png'
        const imgphone = new Image()
        imgphone.src = './PDF/phones.png'
        const imgfooter = new Image()
        imgfooter.src = './PDF/Group.png'
        doc.addImage(imgfooter, 'PNG', 12, 284, 9, 9);
        doc.setTextColor('#ffffff')
        doc.setFontSize(14)
        doc.text("hermes", 24, 290);
        doc.setTextColor('#ffffff')
        doc.setFontSize(8)
        doc.addImage(imgphone, 'PNG', 90, 287, 5, 5);
        doc.text("01 23 45 67 89", 98, 291);
        doc.setTextColor('#ffffff')
        doc.setFont('transDucer', 'italic');
        doc.addImage(img, 'PNG', 129, 287, 5, 5);
        doc.text("contact@hermes.fr", 136, 291);
        doc.setTextColor('#ffffff')
        doc.setFont('transDucer', 'normal');
        doc.addImage(img, 'PNG', 175, 287, 5, 5);
        doc.textWithLink("hermes.fr", 182, 291, { url: 'https://hermes.fr' });
        // doc.text("hermes.fr", 182, 291);
        doc.setTextColor('#ffffff')
        doc.setFont('transDucer', 'normal');
    }
}
const imgToBase64 = (imgPath: string) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = imgPath;
        img.onload = function () {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0, img.width, img.height);
            const base64String = canvas.toDataURL('image/png');
            resolve({
                imgStr: base64String, width: img.width, height: img.height
            })
        };

        img.onerror = function (error) {
            reject(error);
        };
    });
}

const currentDateFrench = () => {
    const frenchMonthNames = {
        1: "janvier",
        2: "février",
        3: "mars",
        4: "avril",
        5: "mai",
        6: "juin",
        7: "juillet",
        8: "août",
        9: "septembre",
        10: "octobre",
        11: "novembre",
        12: "décembre"
    };

    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const dateString = `${day} ${frenchMonthNames[month]} ${year}`;
    return dateString;
}

const checkHeigthCardOdd = (doc, data, index) => {
    doc.setFontSize(10)
    const { title, description } = data[index]
    const wrappedTextSection = doc.splitTextToSize(description, gapWithpadding - 20);
    const wrappedText = doc.splitTextToSize(title, gapWithpadding - 20);
    const height = doc.getTextDimensions(wrappedTextSection).h + doc.getTextDimensions(wrappedText).h + 14
    return height
}
const checkHeightCardEvent = (doc, data, index) => {
    doc.setFontSize(10);
    const nextData = data[index + 1];
    if (nextData) {
        const { title, description } = nextData;
        const wrappedTextSection = doc.splitTextToSize(description, gapWithpadding - 20);
        const wrappedText = doc.splitTextToSize(title, gapWithpadding - 20);
        const height = doc.getTextDimensions(wrappedTextSection).h + doc.getTextDimensions(wrappedText).h + 14;
        return height;
    } else {
        const { title, description } = data[index];
        const wrappedTextSection = doc.splitTextToSize(description, gapWithpadding - 20);
        const wrappedText = doc.splitTextToSize(title, gapWithpadding - 20);
        const height = doc.getTextDimensions(wrappedTextSection).h + doc.getTextDimensions(wrappedText).h + 14;
        return height;
    }
};
const drawAdviceCard = (doc, data, current_Y, index) => {
    doc.setFontSize(10)
    record = false
    const checkHeigth = checkHeigthCardOdd(doc, data, index)
    const checkHeigthEvent = checkHeightCardEvent(doc, data, index)
    const pageHeight = doc.internal.pageSize.height - 30
    const max = (Math.max(checkHeigth, checkHeigthEvent))
    if (pageHeight > current_Y + max) {
        const { title, description } = data[index]
        const wrappedTextSection = doc.splitTextToSize(description, gapWithpadding - 20);
        const wrappedText = doc.splitTextToSize(title, gapWithpadding - 27);
        const titleHeigh = doc.getTextDimensions(wrappedText).h
        const height = doc.getTextDimensions(wrappedTextSection).h + doc.getTextDimensions(wrappedText).h + 14
        doc.setFillColor('#ffffff');
        doc.setDrawColor(0);
        doc.setLineWidth(1);
        doc.roundedRect(X_PADDING, current_Y, (PAGE_WIDTH - 10 - (2 * X_PADDING)) / 2, height, BORDER_RADIUS, BORDER_RADIUS, 'F');
        doc.setFontSize(10)
        doc.setTextColor('#000000')
        doc.text(wrappedText, X_PADDING + 5, current_Y + 10);
        doc.getTextDimensions(wrappedText);
        doc.setFontSize(9)
        doc.setTextColor('#919EAB')
        doc.text(wrappedTextSection, X_PADDING + 5, current_Y + titleHeigh + 2 + 10);
        doc.getTextDimensions(wrappedTextSection);
        current_Y += height
        record = true
    }
    return current_Y
}


const drawAdviceEvent = (doc, data, current_Y, index) => {
    doc.setFontSize(10)
    const { title, description } = data[index]
    const wrappedTextSection = doc.splitTextToSize(description, gapWithpadding - 20);
    const wrappedText = doc.splitTextToSize(title, gapWithpadding - 27);
    const titleHeigh = doc.getTextDimensions(wrappedText).h
    const height = doc.getTextDimensions(wrappedTextSection).h + doc.getTextDimensions(wrappedText).h + 14
    doc.setFillColor('#ffffff');
    doc.setDrawColor(0);
    doc.setLineWidth(1);
    doc.roundedRect(gapWithpadding, current_Y, (PAGE_WIDTH - 5 - (2 * X_PADDING)) / 2, height, BORDER_RADIUS, BORDER_RADIUS, 'F');
    doc.setFontSize(10)
    doc.setTextColor('#000000')
    doc.text(wrappedText, gapWithpadding + 6, current_Y + 10);
    doc.getTextDimensions(wrappedText);
    doc.setFontSize(9)
    doc.setTextColor('#919EAB')
    doc.text(wrappedTextSection, gapWithpadding + 6, current_Y + titleHeigh + 2 + 10);
    doc.getTextDimensions(wrappedTextSection);
    current_Y += height


    return current_Y
}




