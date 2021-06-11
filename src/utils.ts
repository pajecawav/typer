export const classnames = (...values: any[]): string => {
    return values
        .filter((value) => typeof value === "string" && value.length > 0)
        .join(" ");
};

export const countWords = (text: string): number => {
    return text.split(" ").filter((word) => word).length;
};
