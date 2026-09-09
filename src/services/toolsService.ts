import { AxiosProgressEvent } from "axios";
import axiosInstance from "./axios";
import { IToolType } from "./toolTypesService";

export interface IToolImage {
    id: number;
    tool_id: number;
    storage_key: string;
    sort_order: number;
    is_cover: boolean;
    alt?: string;
    mime_type?: string;
    size?: number;
    created_at: string;
}

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
    images?: IToolImage[];
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

export const uploadToolImages = async (
    id: number,
    images: File[],
    onUploadProgress?: (event: AxiosProgressEvent) => void
) => {
    const formData = new FormData();
    images.forEach((image) => formData.append("images", image));
    const res = await axiosInstance.post<ITool>(`/tools/${id}/images`, formData, {
        onUploadProgress,
    });
    return res.data;
};

export const sortToolImages = async (id: number, imageIds: number[]) => {
    const res = await axiosInstance.put<ITool>(`/tools/${id}/images/order`, {
        image_ids: imageIds,
    });
    return res.data;
};

export const setToolImageCover = async (id: number, imageId: number) => {
    const res = await axiosInstance.put<ITool>(
        `/tools/${id}/images/${imageId}/cover`
    );
    return res.data;
};

export const deleteToolImage = async (id: number, imageId: number) => {
    const res = await axiosInstance.delete<ITool>(
        `/tools/${id}/images/${imageId}`
    );
    return res.data;
};
