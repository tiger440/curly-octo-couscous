import { InputBaseComponentProps } from "@mui/material";
import { useEffect, useState } from "react";

const formatter = new Intl.NumberFormat("fr-FR", {
    useGrouping: true,
});

const formatNumber = (val: string) => {
    if (val === null || val === undefined || val === '' || isNaN(Number(val))) return "";
    return formatter.format(Number(val));
};

const NumberFormatCustom = ({
    onChange,
    onBlur,
    value,
    ...other
}: InputBaseComponentProps) => {
    const [transitionValue, setTransitionValue] = useState('');

    useEffect(() => {
        setTransitionValue(formatNumber(value));
    }, [value]);

    const parseNumber = (str: string) => {
        let num = ""
        if (str.includes(',')) {
            const numArr = str.split(',')
            numArr[0] = `${parseFloat(numArr[0].replace(/\s/g, "").replace(/[^0-9]/g, ""))}`
            num = `${numArr[0]}.${numArr[1]}`
        } else {
            num = `${parseFloat(str.replace(/\s/g, "").replace(/[^0-9]/g, ""))}`
        }

        return isNaN(Number(num)) ? "" : num;
    };

    const handleBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
        let num = ""
        if (transitionValue.includes(",") || /\s/.test(transitionValue)) {
            num = `${parseNumber(transitionValue)}`
        } else {
            num = transitionValue
        }

        onBlur?.({
            ...event,
            target: {
                ...event.target,
                name: other.name,
                value: num,
            },
        } as any);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inpValue = event.target.value
        let formattedNumber = ""
        let num = ""

        if (inpValue.includes(",") || /\s/.test(inpValue)) num = `${parseNumber(inpValue)}`
        else num = inpValue

        if (inpValue.endsWith(',')) formattedNumber = `${formatNumber(num)},`
        else formattedNumber = formatNumber(num)

        setTransitionValue(formattedNumber)
        onChange?.({
            ...event,
            target: {
                ...event.target,
                name: other.name,
                value: num,
            },
        } as any);
    };

    return (
        <input
            style={{
                // opacity: transitionValue && transitionValue !== "0" ? 1 : 0,
            }}
            {...other}
            type="text"
            value={transitionValue}
            onChange={handleChange}
            onBlur={handleBlur}
        />
    );
};

export default NumberFormatCustom;
