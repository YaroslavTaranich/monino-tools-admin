import React from "react";
import {useFormSubmit} from "../hooks/useFormSubmit";
import {createTool} from "../services/toolsService";
import ToolForm from "./toolForm";
import {Button, Spin} from "antd";

const CreateToolPage = () => {
    const {onFinish, isSending} = useFormSubmit({createFn: createTool});

    return (
        <ToolForm onFinish={onFinish}>
            <Button htmlType="submit" type="primary" disabled={isSending}>
                {isSending ? <Spin size="small"/> : "Сохранить"}
            </Button>
        </ToolForm>
    );
};

export default CreateToolPage;
