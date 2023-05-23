import { useState, Dispatch, SetStateAction } from "react";

export type DispatchPropertyParam = any | ((prev: object) => any);
export type DispatchProperty = (property: string, newValue: DispatchPropertyParam) => void;
export type DispatchObject = (newValue: object) => void;

/**
 *
 * @param initialValue - The initial object of the state.
 * @returns
 *      object - The state of the object.
 *      DispatchProperty - A function that updates a specific value in the data.
 *      DispatchObject - A function that sets the entire data.
 */
function useObjectState(initialValue: object): [object, DispatchProperty, DispatchObject] {
    const [data, setData]: [object, Dispatch<SetStateAction<object>>] = useState<object>(initialValue);

    /**
     * Updates a specific property inside the data, without modifying the rest.
     * @param name - The string name of the property-
     * @param newValue
     *      any - The updated value of the property.
     *      (:object) => any - An arrow function that receives the current data, and returns an updated value.
     */
    function updateProperty(name: string, value: DispatchPropertyParam) {
        let updatedValue: any = value;
        setData((prev: object) => {
            if (typeof value === "function") updatedValue = value(prev);
            return {
                ...prev,
                [name]: updatedValue,
            };
        });
    }

    return [data, updateProperty, setData];
}

export default useObjectState;
