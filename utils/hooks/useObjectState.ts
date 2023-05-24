import { useState, Dispatch, SetStateAction } from "react";

// Type for the function that dispatches a data's property.
export type DispatchProperty<T> = (path: string, value: any) => void;

/**
 *
 * @param initialValue - The initial object of the state.
 * @returns
 *      data - The state of the object.
 *      updateProperty - A function that updates a specific value in the data.
 *      setData - A function that sets the entire data.
 */
function useObjectState<T extends object | null>(
    initialValue: T
): [T, DispatchProperty<T>, Dispatch<SetStateAction<T>>] {
    const [data, setData]: [T, Dispatch<SetStateAction<T>>] = useState<T>(initialValue);

    /**
     * Updates a specific property inside the data, without modifying the rest.
     * @param name - The string path to the desired property.
     * @param newValue - The updated value of the property.
     */
    const updateProperty: DispatchProperty<T> = (path, newValue) => {
        if (path.length === 0) return;
        const keys: string[] = path.split(".");
        const lastKey: string = keys.pop() || "";

        setData((prev: T) => {
            if (prev === null) return prev;
            const newState: T = { ...prev };
            let currentObject: { [key: string]: any } = newState;

            keys.forEach((key: string) => {
                if (!currentObject.hasOwnProperty(key)) throw Error(`Key '${key}' not found.`);
                const value = currentObject[key];
                if (typeof value !== "object" || value === null) {
                    throw Error(`Key '${key}' not an object.`);
                }
                currentObject = value;
            });

            if (!currentObject.hasOwnProperty(lastKey)) {
                throw Error(`Key '${lastKey}' not found.`);
            }
            currentObject[lastKey] = newValue;

            return newState;
        });
    };

    return [data, updateProperty, setData];
}

export default useObjectState;
