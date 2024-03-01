import { useEffect, useState } from "react";

export const useFetch = <T>(promisedData: Promise<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    promisedData
      .then((d) => setData(d))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return {
    data,
    loading,
    error,
  };
};
