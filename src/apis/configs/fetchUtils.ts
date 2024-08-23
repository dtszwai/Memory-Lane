export const handleResponse = async <T>(response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Something went wrong");
  }
  return await response.json() as Promise<T>;
};

export type FetchOptions = {
  method?: string;
  headers?: HeadersInit;
  body?: BodyInit;
};

export const fetchRequest = async <T>(
  url: string,
  options: FetchOptions = {},
) => {
  try {
    const response = await fetch(url, options);
    return handleResponse<T>(response);
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};
