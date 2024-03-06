import axiosInstance from "./axios";

export interface ITool {
  id: number;
  name: string;
  label: string;
  title: string;
  html_title: string;
  description: string;
  specification: string;
  html_description: string;
  image: string;
  price: number;
  zalog: number;
  tool_type: string;
  popular: boolean;
  categoryId: number;
}

export const getTools = async () => {
  const res = await axiosInstance<ITool[]>("/tools");

  return res.data;
};

export const getToolsByCategoryId = async (categoryId: number) => {
  const res = await axiosInstance<ITool[]>(`/tools?categoryId=${categoryId}`);

  return res.data;
};

export const getToolById = async (id?: string | number) => {
  const res = await axiosInstance<ITool>(`/tools/${id}`);

  return res.data;
};

export const updateToolById = async (
  id: string | number,
  token: string,
  data: ITool
) => {
  const res = await axiosInstance.put<ITool>(`/tools/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return res.data;
};

export const createTool = async (token: string, data: ITool) => {
  const res = await axiosInstance.post<ITool>("/tools", data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return res.data;
};
