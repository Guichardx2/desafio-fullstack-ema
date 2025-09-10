import { useState } from "react";
import axiosService from "@/services/axiosService";
import { addToast } from "@heroui/toast";

type UseApiMutationResult<T> = {
  mutate: (
    id: number | string | null,
    payload: Partial<T>,
    successMessage?: string,
    errorMessage?: string
  ) => Promise<void>;
  get: (id: number | string) => Promise<T>;
  remove: (
    id: number | string,
    successMessage?: string,
    errorMessage?: string
  ) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
};

//Custom hook to handle API mutations (create, update, delete) with loading and error states
export const useApiMutation = <T>(baseUrl: string): UseApiMutationResult<T> => {
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const VITE_API_URL = import.meta.env.VITE_NEST_API_URL;

  const executeMutation = async (
    action: () => Promise<any>,
    successMessage: string,
    errorMessage: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      await action();
      addToast({
        title: "Sucesso",
        description: successMessage,
        color: "success",
      });
    } catch (err) {
      const errorMessageText = err instanceof Error ? err.message : errorMessage;
      setError(err instanceof Error ? err : new Error(String(err)));
      addToast({
        title: "Erro",
        description: errorMessageText,
        color: "danger",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const mutate = async (
    id: number | string | null,
    payload: Partial<T>,
    successMessage?: string,
    errorMessage?: string
  ) => {
    if (id === null || id === undefined) {
      await executeMutation(
        () => axiosService.post(`${VITE_API_URL}${baseUrl}/create`, payload),
        successMessage || "Evento criado com sucesso.",
        errorMessage || "Ocorreu um erro ao criar o evento."
      );
    } else {
      await executeMutation(
        () => axiosService.patch(`${VITE_API_URL}${baseUrl}/${id}`, payload),
        successMessage || "Evento atualizado com sucesso.",
        errorMessage || "Ocorreu um erro ao atualizar o evento."
      );
    }
  };

  const get = async (id: number | string): Promise<T> => {
    setIsLoading(true);
    setError(null);
    try {

      const response = await axiosService.get(`${VITE_API_URL}${baseUrl}/${id}`);
      return response.data as T;

    } catch (err) {

      const errorMessageText =
        err instanceof Error ? err.message : "Ocorreu um erro ao buscar o evento.";
      setError(err instanceof Error ? err : new Error(String(err)));
      addToast({
        title: "Erro",
        description: errorMessageText,
        color: "danger",
      });
      throw err;

    } finally {
      setIsLoading(false);
    }
  };

  const remove = async (id: number | string, successMessage?: string, errorMessage?: string) => {
    await executeMutation(
      () => axiosService.del(`${VITE_API_URL}${baseUrl}/${id}`),
      successMessage || "Evento excluído com sucesso.",
      errorMessage || "Ocorreu um erro ao excluir o evento."
    );
  };

  return { mutate, get, remove, isLoading, error };
};
