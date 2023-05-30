export type FilterConditionals = "<" | "=" | ">";
export type FilterData = {
    condition: FilterConditionals;
    value: string | number | boolean;
};
export type Filters = {
    [key: string]: FilterData;
};
