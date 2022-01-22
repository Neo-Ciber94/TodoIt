import { useEffect, useState } from "react";

export interface UsePromiseResult<T> {
  value?: T;
  isLoading: boolean;
  error: Error | null;
}

export function usePromise<T>(promise: Promise<T>): UsePromiseResult<T> {
  const [value, setValue] = useState<T | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    promise
      .then((value) => setValue(value))
      .catch((error) => setError(error))
      .finally(() => setIsLoading(false));
  }, [promise]);

  return {
    value,
    isLoading,
    error,
  };
}
