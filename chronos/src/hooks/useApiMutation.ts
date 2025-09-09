import { useState } from "react";
import axiosService from "@/services/axiosService";
import { addToast } from "@heroui/toast";

type UseApiMutationResult<T> = {
  mutate: (id: number | string | null, payload: Partial<T>) => Promise<void>;
  remove: (id: number | string) => Promise<void>;
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
    payload: Partial<T>
  ) => {
    if (id === null || id === undefined) {
      await executeMutation(
        () => axiosService.post(`${VITE_API_URL}${baseUrl}/create`, payload),
        "Item criado com sucesso.",
        "Ocorreu um erro ao criar o item."
      );
    } else {
      await executeMutation(
        () => axiosService.patch(`${VITE_API_URL}${baseUrl}/${id}`, payload),
        "Item atualizado com sucesso.",
        "Ocorreu um erro ao atualizar o item."
      );
    }
  };

  const remove = async (id: number | string) => {
    await executeMutation(
      () => axiosService.del(`${VITE_API_URL}${baseUrl}/${id}`),
      "Item excluído com sucesso.",
      "Ocorreu um erro ao excluir o item."
    );
  };

  return { mutate, remove, isLoading, error };
};
