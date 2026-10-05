export function getErrorMessage(err, fallback = "Une erreur est survenue.") {
    const data = err.response?.data;

    if (!data) return fallback;

    if (data.message) return data.message;

    if (typeof data === 'object') {
        const firstError = Object.values(data)[0];
        if (typeof firstError === 'string') {
            return firstError;
        }
    }
    return fallback;
}
