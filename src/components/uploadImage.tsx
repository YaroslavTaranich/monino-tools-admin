import React, {ChangeEvent, FC, useContext, useEffect, useState} from 'react';
import {Flex, Image, message} from "antd";
import {AuthContext} from "../context/authContext";
import {isAxiosError} from "axios";
import {LoadingOutlined, PlusOutlined} from '@ant-design/icons';
import FallBack from '../assets/fallback-photo.jpg'

const beforeUpload = (file: File) => {
    const isJpg = file.type === 'image/jpeg';
    if (!isJpg) {
        message.error('Доступна загрзка файлов только в формате JPG!');
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
        message.error('Максимальный размер фала 5MB!');
    }
    return isJpg && isLt5M;
};

interface IUploadImageProps {
    postImage: (token: string, id: number, image: File) => Promise<string>;
    imagePath?: string;
    id: number;
}

const UploadImage: FC<IUploadImageProps> = ({postImage, imagePath, id}) => {
    const {token} = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>("");

    useEffect(() => {
        setImageUrl(`${process.env.REACT_APP_API_URL}/file/${imagePath}`)
    }, [imagePath])
    const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null
        if (!file) return

        const isValid = beforeUpload(file)

        if (isValid && token) {
            setLoading(true);
            try {
                const path = await postImage(token, id, file)
                console.log(file)
                setImageUrl(`${process.env.REACT_APP_API_URL}/file/${path}`);

            } catch (error) {
                if (isAxiosError(error)) {
                    console.error(error.message)
                }
            } finally {
                setLoading(false);
            }

        }
    }

    return (
        <Flex
            vertical
            align={"center"}
            justify={'center'}
            gap={16}
            style={{padding: 16}}
        >
            <Image
                src={imageUrl}
                width={200}
                fallback={FallBack}/>
            <label
                style={{
                    cursor: "pointer",
                    background: "#eee",
                    padding: 15,
                    borderRadius: 5
                }}
            >
                <input
                    type="file"
                    accept='image/jpeg'
                    onChange={handleChange}
                    style={{display: 'none'}}
                />
                <Flex
                    vertical
                    justify='center'
                    align='center'
                >                        {loading ? <LoadingOutlined/> : <PlusOutlined/>}
                    <div style={{marginTop: 8}}>Изменить картинку</div>
                </Flex>
            </label>
        </Flex>

    );
};

export default UploadImage;