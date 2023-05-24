import { useState, Dispatch, SetStateAction } from "react";

export type DispatchObject<T> = (newValue: T) => void;
export type SetPropertyAction<T> = (name: string, newValue: any) => void;
export type DispatchPropertyParam<T> = any | ((prev: T) => any);

export type UpdateStateAction<T> = any;
export type DispatchProperty<T> = (path: string, value: UpdateStateAction<T>) => void;

/**
 *
 * @param initialValue - The initial object of the state.
 * @returns
 *      object - The state of the object.
 *      DispatchProperty - A function that updates a specific value in the data.
 *      DispatchObject - A function that sets the entire data.
 */
function useObjectState<T extends object>(
    initialValue: T | null
): [T | null, DispatchProperty<T>, Dispatch<SetStateAction<T | null>>] {
    const [data, setData]: [T | null, Dispatch<SetStateAction<T | null>>] = useState<T | null>(initialValue);

    /**
     * Updates a specific property inside the data, without modifying the rest.
     * @param name - The string name of the property-
     * @param newValue
     *      any - The updated value of the property.
     *      (:object) => any - An arrow function that receives the current data, and returns an updated value.
     */
    const updateProperty: DispatchProperty<T> = (path, newValue) => {
        if (path.length === 0) return;
        const keys: string[] = path.split(".");
        const lastKey: string = keys.pop() || "";

        setData((prev: T | null) => {
            if (prev === null) return prev;
            const newState: T = { ...prev };
            let currentObject: object = newState;

            keys.forEach((key: string) => {
                if (!currentObject.hasOwnProperty(key)) throw Error(`Key '${key}' not found.`);
                const value: any = currentObject[key];
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
