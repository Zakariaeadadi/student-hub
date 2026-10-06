export function getTimeAgo(createdAt) {
    
    const postDate = new Date(createdAt);
    const now = new Date();

    const differenceInSeconds = Math.floor((now - postDate) / 1000);

    if (differenceInSeconds < 60) {
        return "À l'instant";
    }

    const differenceInMinutes = Math.floor(differenceInSeconds / 60);

    if (differenceInMinutes < 60) {
        return `Il y a ${differenceInMinutes} min`;
    }

    const differenceInHours = Math.floor(differenceInMinutes / 60);

    if (differenceInHours < 24) {
        return `Il y a ${differenceInHours} h`;
    }

    const differenceInDays = Math.floor(differenceInHours / 24);

    if (differenceInDays < 30) {
        return `Il y a ${differenceInDays} j`;
    }

    const differenceInMonths = Math.floor(differenceInDays / 30);

    if (differenceInMonths < 12) {
        return `Il y a ${differenceInMonths} mois`;
    }

    const differenceInYears = Math.floor(differenceInDays / 365);

    return `Il y a ${differenceInYears} an${differenceInYears > 1 ? "s" : ""}`;
};