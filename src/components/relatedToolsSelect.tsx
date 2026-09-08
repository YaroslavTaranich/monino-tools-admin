import React from "react";
import {Button, Flex, Select, Typography} from "antd";
import {ITool} from "../services/toolsService";

interface Props {
  value?: number[];
  onChange?: (ids: number[]) => void;
  tools: ITool[];
  accessoryOnly: boolean;
  disabled?: boolean;
}

export default function RelatedToolsSelect({value = [], onChange, tools, accessoryOnly, disabled}: Props) {
  const move = (index: number, offset: number) => {
    const next = [...value];
    [next[index], next[index + offset]] = [next[index + offset], next[index]];
    onChange?.(next);
  };
  return <Flex vertical gap={8}>
    <Select mode="multiple" showSearch optionFilterProp="label" value={value}
      onChange={onChange} disabled={disabled} placeholder="Выберите совместимые позиции"
      options={tools.map(tool => ({value: tool.id, label: tool.label,
        disabled: !!tool.accessory_only === accessoryOnly}))} />
    {value.map((id, index) => <Flex key={id} gap={8} align="center">
      <Typography.Text>{index + 1}. {tools.find(tool => tool.id === id)?.label ?? `Позиция ${id}`}</Typography.Text>
      <Button size="small" disabled={disabled || index === 0} onClick={() => move(index, -1)}
        aria-label={`Поднять позицию ${index + 1}`}>Выше</Button>
      <Button size="small" disabled={disabled || index === value.length - 1} onClick={() => move(index, 1)}
        aria-label={`Опустить позицию ${index + 1}`}>Ниже</Button>
    </Flex>)}
  </Flex>;
}
