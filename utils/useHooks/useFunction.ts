export const formatPhone = (code: any, val: any) => {
    // val.replace(/\D+/g, '')
    if (val == undefined || !val) {
        return;
    }
    let replace = val.replace(/\D+/g, "");
    let result =
        replace.substr(0, 2) +
        "-" +
        replace.substr(2, 3) +
        "-" +
        replace.substr(5, 4) +
        "-" +
        replace.substr(9, 4);
    return code + result;
};

export const colorfull = (num: any) => {
    if (num) return Math.floor(Math.random() * 16777215).toString(16);
    else "#fff";
};