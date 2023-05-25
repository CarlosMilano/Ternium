const isObject: (value: any) => boolean = (value) => value !== null && typeof value === "object";

function deepClone<T extends object>(obj: T): T {
    let clone: { [key: string]: any };
    if (Array.isArray(obj)) {
        clone = [] as Array<any>;
        obj.forEach((value: any, index: number) => {
            clone[index] = isObject(value) ? deepClone<object>(value) : value;
        });
    } else {
        clone = {};
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value: any = obj[key];
                clone[key] = isObject(value) ? deepClone(value) : value;
            }
        }
    }

    return clone as T;
}

export default deepClone;
