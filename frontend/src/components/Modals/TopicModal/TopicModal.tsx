import { handleErrorResponse, handleSuccessResponse } from '@/helpers/response';
import useTopic from '@/hooks/useTopic';
import { createNewTopic, updateTopic } from '@/services/topic';
import { TTopicFormData, TTopicType } from '@/types/topic';
import { Modal, Form, Input } from 'antd';
import { useEffect, useState } from 'react';

type TTopicModal = {
  visible: boolean;
  onCancel: () => void;
  editData: TTopicType;
};

const TopicModal: React.FC<TTopicModal> = ({ visible, onCancel, editData }) => {
  const [form] = Form.useForm();
  const { getAllTopics } =  useTopic();
  const [loading, setLoading] = useState(false);
  const isEdit = !!editData._id;

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        name: editData.name,
      });
    }
  }, [visible, isEdit, editData, form]);
  


  const createOrUpdateTopic = async (values: TTopicFormData) => {
    
    const payload = {
      name: values.name.trim(),
    };

    setLoading(true);
    try {
      isEdit ? await updateTopic(editData._id, payload) : await createNewTopic(payload);
      getAllTopics();
      handleSuccessResponse(`Topic ${isEdit ? 'updated' : 'created'} successfully`);
    } catch (error) {
      handleErrorResponse(error);
    }
    setLoading(false);

    handleCancel();
  };

  const handleCancel = () => {
    onCancel?.();
    form.resetFields();
  };

  return (
    <Modal
      title={isEdit ? 'Edit Topic' : 'Create Topic'}
      open={visible}
      onCancel={handleCancel}
      okText={isEdit ? 'Update' : 'Create'}
      loading={loading}
      okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
      modalRender={(dom) => (
        <Form
          layout="vertical"
          form={form}
          onFinish={(values) => createOrUpdateTopic(values)}
          initialValues={{
            name: editData.name || '',
          }}
        >
          {dom}
        </Form>
      )}
    >
      <Form.Item<TTopicFormData>
        label="Name"
        name="name"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
    </Modal>
  );
};

export default TopicModal;
