export const orderDataBy = (data: any[], property: any) => {
    return data.sort((a, b) => a[property] - b[property])
};
