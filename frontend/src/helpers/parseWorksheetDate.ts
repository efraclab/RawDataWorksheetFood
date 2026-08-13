export function parseWorksheetDate(
    value: string | Date | null | undefined
): Date | null {

    if (!value) {
        return null;
    }

    // Already a Date
    if (value instanceof Date) {

        return isNaN(value.getTime())
            ? null
            : value;
    }

    const text = String(value).trim();

    if (!text) {
        return null;
    }

    // ========================================================
    // API FORMAT
    //
    // DD-MM-YYYY HH:mm:ss
    //
    // Example:
    // 13-08-2026 14:31:31
    // ========================================================

    const match = text.match(
        /^(\d{2})-(\d{2})-(\d{4})[ T](\d{2}):(\d{2}):(\d{2})$/
    );

    if (match) {

        const [
            ,
            day,
            month,
            year,
            hours,
            minutes,
            seconds
        ] = match;

        const date = new Date(
            Number(year),
            Number(month) - 1,
            Number(day),
            Number(hours),
            Number(minutes),
            Number(seconds)
        );

        // Validate that JS didn't normalize an invalid date
        if (
            date.getFullYear() === Number(year) &&
            date.getMonth() === Number(month) - 1 &&
            date.getDate() === Number(day) &&
            date.getHours() === Number(hours) &&
            date.getMinutes() === Number(minutes) &&
            date.getSeconds() === Number(seconds)
        ) {
            return date;
        }

        return null;
    }

    // ========================================================
    // ISO FORMAT
    //
    // Example:
    // 2026-08-13T14:31:31.000Z
    // ========================================================

    const isoDate = new Date(text);

    if (!isNaN(isoDate.getTime())) {
        return isoDate;
    }

    console.warn(
        "Unable to parse worksheet date:",
        value
    );

    return null;
}