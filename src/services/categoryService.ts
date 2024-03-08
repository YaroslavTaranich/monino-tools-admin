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

export interface ICategoryName {
  id: number;
  label: string;
}

export const getAllCategories = async () => {
  const res = await axiosInstance<ICategory[]>("/category");

  return res.data;
};

export const getAllCategoriesNames = async () => {
  const res = await axiosInstance<ICategoryName[]>("/category/names");

  return res.data;
};

export const getCategoryById = async (id?: string | number) => {
  const res = await axiosInstance<ICategory>(`/category/${id}`);

  return res.data;
};

export const updateCategoryById = async (
  id: string | number,
  token: string,
  data: ICategory
) => {
  const res = await axiosInstance.put<ICategory>(`/category/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return res.data;
};

export const createCategory = async (token: string, data: ICategory) => {
  const res = await axiosInstance.post<ICategory>("/category", data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return res.data;
};

export const updateCategoryImage = async (token: string, id: number, image: File) => {
  const res = await axiosInstance.post<ICategory>(`/category/${id}/image`, {image}, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  })
  return res.data.image
}

export const deleteCategoryImage = async (token: string, id: string, image: File) => {
  const res = await axiosInstance.post<ICategory>(`/category/${id}/image`, {image}, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  })
  return res.data
}