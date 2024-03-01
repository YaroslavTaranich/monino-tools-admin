import axiosInstance from "./axios";

export interface ICategory {
  id: number;
  name: string;
  label: string;
  title: string;
  html_title: string;
  description: string;
  html_description: string;
  image: string;
}

export const getAllCategories = async () => {
  const res = await axiosInstance<ICategory[]>("/category");

  return res.data;
};

export const getCategoryById = async (id?: string | number) => {
  const res = await axiosInstance<ICategory>(`/category/${id}`);

  return res.data;
};
