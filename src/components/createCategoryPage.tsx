import React from "react";
import CategoryForm from "./categoryForm";
import {createCategory, ICategory} from "../services/categoryService";

import {Button, Spin} from "antd";
import {useFormSubmit} from "../hooks/useFormSubmit";

const CreateCategoryPage = () => {
    const {onFinish, isSending} = useFormSubmit<ICategory>({
        createFn: createCategory,
    });

    return (
        <CategoryForm onFinish={onFinish}>
            <Button htmlType="submit" type="primary" disabled={isSending}>
                {isSending ? <Spin size="small"/> : "Сохранить"}
            </Button>
        </CategoryForm>
    );
};

export default CreateCategoryPage;
