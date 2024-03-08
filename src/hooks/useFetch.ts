import {useEffect, useState} from "react";

export const useFetch = <T>(promisedData?: Promise<T>) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (promisedData) {
            promisedData
                .then((d) => setData(d))
                .catch((e) => setError(e.message))
                .finally(() => setLoading(false));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        data,
        loading,
        error,
    };
};
