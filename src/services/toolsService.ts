import axiosInstance from "./axios";
import {ICategory} from "./categoryService";
import {IToolType} from "./toolTypesService";

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
    tool_type_id: number;
    toolType?: IToolType;
    accessory_only?: boolean;
    related_tool_ids?: number[];
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
    data: ITool
) => {
    const res = await axiosInstance.put<ITool>(`/tools/${id}`, data);

    return res.data;
};

export const createTool = async (data: ITool) => {
    const res = await axiosInstance.post<ITool>("/tools", data);

    return res.data;
};

export const updateToolImage = async (id: number, image: File) => {
    const res = await axiosInstance.post<ICategory>(`/tools/${id}/image`, {image}, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
    return res.data.image
}
