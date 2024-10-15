import { handleErrorResponse, handleSuccessResponse } from '@/helpers/response';
import { createGroup, updateGroup } from '@/services/lesson';
import { TGroupFormData, TGroupType } from '@/types/lesson';
import { Modal, Form, Input, Spin } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { useEffect, useState } from 'react';

type TGroupModal = {
  visible: boolean;
  onCancel: () => void;
  editData?: TGroupType;
  onFetchNewData?: (_data: DefaultOptionType) => void;
};

const GroupModal: React.FC<TGroupModal> = ({ visible, onCancel, editData, onFetchNewData }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const isEdit = !!editData?._id;

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        name: editData?.name || '',
      });
    }
  }, [visible, editData, form]);

  const createOrUpdateGroup = async (values: TGroupFormData) => {

    const payload = {
      name: values.name.trim(),
    };

    setLoading(true);
    try {
      const response = isEdit ? await updateGroup(editData._id, payload) : await createGroup(payload);
      const responseData = response.data;
      const  newValueData: DefaultOptionType = {
        value: responseData._id,
        label: responseData.name,
      }

      handleSuccessResponse(`Group ${isEdit ? 'updated' : 'created'} successfully`);
      handleCancel();
      onFetchNewData?.(newValueData);
    } catch (error) {
      handleErrorResponse(error);
    }
    setLoading(false);

  };

  const handleCancel = () => {

    onCancel?.();
    form.resetFields();
  };

  return (
    <Modal
      title={isEdit ? 'Edit Group' : 'Create Group'}
      open={visible}
      onCancel={handleCancel}
      okText={isEdit ? 'Update' : 'Create'}
      okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
      modalRender={(dom) => (
        <Spin spinning={loading}>
          <Form
            layout="vertical"
            form={form}
            onFinish={(values) => createOrUpdateGroup(values)}
          >
            {dom}
          </Form>
        </Spin>
      )}
    >
      <Form.Item<TGroupFormData>
        label="Name"
        name="name"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
    </Modal>
  );
};

export default GroupModal;
