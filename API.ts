import React from "react";

const APIContext = React.createContext({});

export default APIContext;

export const ref = async (promise: any) => {
    try {
        return [await promise, null]
    } catch (error) {
        return [null, error]
    }
}
