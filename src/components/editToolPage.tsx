import React from "react";
import ToolForm from "./toolForm";
import {Button, Spin} from "antd";
import Loader from "./loader";
import {Navigate} from "react-router-dom";
import {getToolById, ITool, updateToolById, updateToolImage} from "../services/toolsService";
import {useFormSubmit} from "../hooks/useFormSubmit";
import UploadImage from "./uploadImage";

const EditToolPage = () => {
    const {
        onFinish,
        loading,
        error,
        isSending,
        defaultValues: tool,
    } = useFormSubmit<ITool>({
        updateFn: updateToolById,
        getDefault: getToolById,
    });

    if (loading) return <Loader/>;
    if (error || !tool) return <Navigate to="/category"/>;

    return (
        <>
            <UploadImage postImage={updateToolImage} id={tool.id} imagePath={tool.image}/>
            <ToolForm onFinish={onFinish} defaultValues={tool}>
                <Button htmlType="submit" type="primary" disabled={isSending}>
                    {isSending ? <Spin size="small"/> : "Сохранить"}
                </Button>
            </ToolForm>
        </>
    );
};

export default EditToolPage;
