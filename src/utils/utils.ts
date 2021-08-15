export const replacePhoneNumber = (phone: string) => {
    return phone
        .replace(/[^0-9]/g, '')
        .replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/, '$1-$2-$3')
        .replace('--', '-');
};