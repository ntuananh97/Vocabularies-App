import { Button, Input, Space } from 'antd';
import React from 'react';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

interface IInputItemProps  {
  id: string;
  value: string;
  showDeleteButton: boolean;
  onChange: (id: string, value: string) => void;
  onDeleteInput: (id: string) => void;
  addMoreInput: () => void;
}

const InputItem: React.FC<IInputItemProps> = ({
  id,
  value,
  showDeleteButton,
  onChange,
  addMoreInput,
  onDeleteInput,
}) => {

  return (
    <Space.Compact style={{width: '100%'}}>
      <Input
        placeholder="Input example"
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
        className='w-full'
      />
      {showDeleteButton ? (
        <Button type="primary" aria-label='Delete example' icon={<DeleteOutlined />} onClick={() => onDeleteInput(id)} />
      ) : (
        <Button type="primary" aria-label='Add example' icon={<PlusOutlined />} onClick={addMoreInput} />
      )}
    </Space.Compact>
  );
};

export default InputItem;
