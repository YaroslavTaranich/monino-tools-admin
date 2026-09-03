import axiosInstance from "./axios";

export interface IToolType {
    id: number;
    slug: string;
    name: string;
    sort_order: number;
    is_active: boolean;
}

export type ToolTypeInput = Omit<IToolType, "id">;

export const getToolTypes = async () => {
    const response = await axiosInstance<IToolType[]>("/tool-types");
    return response.data;
};

export const createToolType = async (data: ToolTypeInput) => {
    const response = await axiosInstance.post<IToolType>("/tool-types", data);
    return response.data;
};

export const updateToolType = async (id: number, data: ToolTypeInput) => {
    const response = await axiosInstance.put<IToolType>(`/tool-types/${id}`, data);
    return response.data;
};

export const deleteToolType = async (id: number) => {
    await axiosInstance.delete(`/tool-types/${id}`);
};
