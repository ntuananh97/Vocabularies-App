import React, { useRef, useState } from 'react';
import LessonSelect from '../Selects/LessonSelect';
import { Button, Space, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import GroupModal from '../Modals/GroupModal';
import { TGroupSelectImperativeRef } from '@/types/createFast';
import { DefaultOptionType } from 'antd/es/select';

interface CreateGroupFastProps {
  onChange?: (_value: string) => void;
  value?: string;
}

const CreateGroupFast: React.FC<CreateGroupFastProps> = ({onChange, value}) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const selectRef = useRef<TGroupSelectImperativeRef>(null)

  const openGroupModal = () => {
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  const handleUpdateNewData = (newData: DefaultOptionType) => {
    selectRef.current?.updateNewGroupValue(newData);
    onChange?.(newData.value as string);
  };

  return (
    <>
      <Space.Compact style={{ width: '100%' }}>
        <LessonSelect allowClear ref={selectRef} onChange={onChange} value={value} placeholder="Type to search group" />
        <Tooltip title="Create new group">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openGroupModal}
          />
        </Tooltip>
      </Space.Compact>
      <GroupModal onCancel={handleCloseModal} visible={isOpenModal} onFetchNewData={handleUpdateNewData} />
    </>
  );
};

export default CreateGroupFast;
