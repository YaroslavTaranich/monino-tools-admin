import React, { ChangeEvent, DragEvent, FC, useEffect, useRef, useState } from "react";
import {
    Button,
    Card,
    Empty,
    Flex,
    Image,
    Popconfirm,
    Progress,
    Tag,
    Typography,
    message,
} from "antd";
import {
    DeleteOutlined,
    DragOutlined,
    PlusOutlined,
    StarFilled,
} from "@ant-design/icons";
import { isAxiosError } from "axios";
import {
    deleteToolImage,
    ITool,
    IToolImage,
    setToolImageCover,
    sortToolImages,
    uploadToolImages,
} from "../services/toolsService";

const maxImages = 5;
const maxFileSize = 5_000_000;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

const imageUrl = (storageKey: string) =>
    `${process.env.REACT_APP_API_URL}/file/${storageKey}`;

const errorMessage = (error: unknown) => {
    if (isAxiosError(error)) {
        const description = error.response?.data?.message;
        if (Array.isArray(description)) return description.join(". ");
        if (typeof description === "string") return description;
    }
    return "Не удалось изменить фотографии. Попробуйте ещё раз.";
};

interface IToolImagesProps {
    tool: ITool;
}

const ToolImages: FC<IToolImagesProps> = ({ tool }) => {
    const [images, setImages] = useState<IToolImage[]>(tool.images ?? []);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [savingOrder, setSavingOrder] = useState(false);
    const [changingImageId, setChangingImageId] = useState<number>();
    const [draggedImageId, setDraggedImageId] = useState<number>();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => setImages(tool.images ?? []), [tool.id, tool.images]);

    const updateImages = (updatedTool: ITool) => {
        setImages(updatedTool.images ?? []);
    };

    const handleFiles = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? []);
        event.target.value = "";
        if (!files.length) return;
        const availableSlots = maxImages - images.length;
        if (files.length > availableSlots) {
            message.error(`Можно добавить ещё ${availableSlots} фото.`);
            return;
        }
        if (files.some((file) => !allowedTypes.has(file.type))) {
            message.error("Поддерживаются только JPEG, PNG и WebP.");
            return;
        }
        if (files.some((file) => file.size > maxFileSize)) {
            message.error("Размер каждого файла не должен превышать 5 МБ.");
            return;
        }

        setUploading(true);
        setUploadProgress(0);
        try {
            const updatedTool = await uploadToolImages(tool.id, files, (progress) => {
                if (progress.total) {
                    setUploadProgress(
                        Math.round((progress.loaded / progress.total) * 100)
                    );
                }
            });
            updateImages(updatedTool);
            message.success(files.length === 1 ? "Фото добавлено" : "Фото добавлены");
        } catch (error) {
            message.error(errorMessage(error));
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const handleCover = async (imageId: number) => {
        setChangingImageId(imageId);
        try {
            updateImages(await setToolImageCover(tool.id, imageId));
            message.success("Обложка изменена");
        } catch (error) {
            message.error(errorMessage(error));
        } finally {
            setChangingImageId(undefined);
        }
    };

    const handleDelete = async (imageId: number) => {
        setChangingImageId(imageId);
        try {
            updateImages(await deleteToolImage(tool.id, imageId));
            message.success("Фото удалено");
        } catch (error) {
            message.error(errorMessage(error));
        } finally {
            setChangingImageId(undefined);
        }
    };

    const handleDrop = async (
        event: DragEvent<HTMLDivElement>,
        targetImageId: number
    ) => {
        event.preventDefault();
        const sourceImageId = draggedImageId;
        setDraggedImageId(undefined);
        if (!sourceImageId || sourceImageId === targetImageId) return;

        const previousImages = images;
        const sourceIndex = images.findIndex((image) => image.id === sourceImageId);
        const targetIndex = images.findIndex((image) => image.id === targetImageId);
        if (sourceIndex < 0 || targetIndex < 0) return;
        const reorderedImages = [...images];
        const [movedImage] = reorderedImages.splice(sourceIndex, 1);
        reorderedImages.splice(targetIndex, 0, movedImage);
        setImages(reorderedImages);
        setSavingOrder(true);
        try {
            updateImages(
                await sortToolImages(
                    tool.id,
                    reorderedImages.map((image) => image.id)
                )
            );
        } catch (error) {
            setImages(previousImages);
            message.error(errorMessage(error));
        } finally {
            setSavingOrder(false);
        }
    };

    const busy = uploading || savingOrder || changingImageId !== undefined;

    return (
        <Card
            title="Фотографии"
            extra={
                <Typography.Text type="secondary">
                    {images.length} из {maxImages}
                </Typography.Text>
            }
        >
            <Flex vertical gap={16}>
                <Flex align="center" gap={12} wrap="wrap">
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        onChange={handleFiles}
                        style={{ display: "none" }}
                    />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        loading={uploading}
                        disabled={busy || images.length >= maxImages}
                        onClick={() => inputRef.current?.click()}
                    >
                        Добавить фото
                    </Button>
                    <Typography.Text type="secondary">
                        JPEG, PNG или WebP, до 5 МБ
                    </Typography.Text>
                </Flex>

                {uploading && (
                    <Progress
                        percent={uploadProgress}
                        status="active"
                        size="small"
                        showInfo={uploadProgress > 0}
                    />
                )}

                {images.length === 0 ? (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="У инструмента пока нет фотографий"
                    />
                ) : (
                    <>
                        <Typography.Text type="secondary">
                            <DragOutlined /> Перетащите карточки, чтобы изменить порядок.
                        </Typography.Text>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fill, minmax(190px, 1fr))",
                                gap: 16,
                            }}
                        >
                            {images.map((image) => (
                                <Card
                                    key={image.id}
                                    size="small"
                                    draggable={!busy}
                                    onDragStart={() => setDraggedImageId(image.id)}
                                    onDragEnd={() => setDraggedImageId(undefined)}
                                    onDragOver={(event) => event.preventDefault()}
                                    onDrop={(event) => handleDrop(event, image.id)}
                                    style={{
                                        borderColor: image.is_cover ? "#1677ff" : undefined,
                                        opacity: draggedImageId === image.id ? 0.55 : 1,
                                        cursor: busy ? "default" : "grab",
                                    }}
                                >
                                    <Flex vertical gap={12}>
                                        <div
                                            style={{
                                                height: 150,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                overflow: "hidden",
                                                borderRadius: 6,
                                                background: "#f5f5f5",
                                            }}
                                        >
                                            <Image
                                                src={imageUrl(image.storage_key)}
                                                alt={image.alt || tool.label}
                                                width="100%"
                                                height="100%"
                                                style={{ objectFit: "contain" }}
                                                preview={{ mask: "Открыть" }}
                                            />
                                        </div>
                                        <Flex justify="space-between" align="center" gap={8}>
                                            {image.is_cover ? (
                                                <Tag color="blue" icon={<StarFilled />}>
                                                    Обложка
                                                </Tag>
                                            ) : (
                                                <Button
                                                    type="link"
                                                    size="small"
                                                    icon={<StarFilled />}
                                                    loading={changingImageId === image.id}
                                                    disabled={busy}
                                                    onClick={() => handleCover(image.id)}
                                                >
                                                    На обложку
                                                </Button>
                                            )}
                                            <Popconfirm
                                                title="Удалить фотографию?"
                                                description={
                                                    image.is_cover && images.length > 1
                                                        ? "Обложкой станет следующее фото."
                                                        : undefined
                                                }
                                                okText="Удалить"
                                                cancelText="Отмена"
                                                okButtonProps={{ danger: true }}
                                                onConfirm={() => handleDelete(image.id)}
                                            >
                                                <Button
                                                    danger
                                                    type="text"
                                                    size="small"
                                                    icon={<DeleteOutlined />}
                                                    loading={changingImageId === image.id}
                                                    disabled={busy}
                                                    aria-label="Удалить фотографию"
                                                />
                                            </Popconfirm>
                                        </Flex>
                                    </Flex>
                                </Card>
                            ))}
                        </div>
                        {savingOrder && (
                            <Typography.Text type="secondary">
                                Сохраняем порядок…
                            </Typography.Text>
                        )}
                    </>
                )}
            </Flex>
        </Card>
    );
};

export default ToolImages;
