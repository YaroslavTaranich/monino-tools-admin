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
  pobular: boolean;
  categoryId: number;
}

export const getTools = async () => {
  const res = await axiosInstance<ITool[]>("/tools");

  return res.data;
};
