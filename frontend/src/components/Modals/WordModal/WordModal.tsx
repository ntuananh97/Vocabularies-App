import LessonSelect from '@/components/Selects/LessonSelect';
import UploadFile from '@/components/UploadFile';
import { handleErrorResponse, handleSuccessResponse } from '@/helpers/response';
import { createNewTopic, updateTopic } from '@/services/topic';
import { createNewWord, updateWord } from '@/services/word';
import { TWordFormDataType, TWordType } from '@/types/word';
import { generateUniqueId, trimStringValue } from '@/utils';
import { Modal, Form, Input, Row, Col } from 'antd';
import { useEffect, useState } from 'react';

type TWordModal = {
  visible: boolean;
  topicId: string;
  editData: TWordType;
  onCancel: () => void;
  onRefreshData?: () => void;
};

const WordModal: React.FC<TWordModal> = ({
  visible,
  editData,
  topicId,
  onCancel,
  onRefreshData,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const isEdit = !!editData._id;

  useEffect(() => {
    if (visible) {
      console.log('editData:', editData);
      const localImages = editData.images?.map((url) => ({ id: generateUniqueId(), url })) || [];
      
      form.setFieldsValue({
        title: editData.title,
        keyWord: editData.keyWord,
        definition: editData.definition,
        pronounciation: editData.pronounciation,
        description: editData.description,
        lessonId: editData.lessonId,
        localImages,
        examples: editData.examples,
      });
    }
  }, [visible, isEdit, editData, form]);

  const createOrUpdateTopic = async (values: TWordFormDataType) => {
    console.log('createOrUpdateTopic ~ values:', values);

    const images = values.localImages?.map((image) => image.url) || [];

    const payload = {
      title: trimStringValue(values.title),
      keyWord: trimStringValue(values.keyWord),
      definition: trimStringValue(values.definition),
      pronounciation: trimStringValue(values.pronounciation),
      description: trimStringValue(values.description),
      lessonId: values.lessonId,
      topicId,
      images
    };

    setLoading(true);
    try {
      isEdit
        ? await updateWord(editData._id, payload)
        : await createNewWord(payload);
      handleSuccessResponse(
        `Topic ${isEdit ? 'updated' : 'created'} successfully`
      );
      handleCancel();
      onRefreshData?.();
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
      title={isEdit ? 'Edit Word' : 'Create Word'}
      open={visible}
      onCancel={handleCancel}
      okText={isEdit ? 'Update' : 'Create'}
      loading={loading}
      okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
      style={{ minWidth: '50%' }}
      modalRender={(dom) => (
        <Form
          layout="vertical"
          form={form}
          onFinish={(values) => createOrUpdateTopic(values)}
          initialValues={{
            title: '',
            keyWord: '',
            definition: '',
            pronounciation: '',
            description: '',
            lessonId: '',
            localImages: [],
            examples: '',
          }}
        >
          {dom}
        </Form>
      )}
    >
      <Row gutter={15}>
        <Col span={8}>
          <Form.Item<TWordFormDataType>
            label="Structure"
            name="title"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item<TWordFormDataType>
            label="Word"
            name="keyWord"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item<TWordFormDataType>
            label="Definition"
            name="definition"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item<TWordFormDataType>
            label="Pronunciation"
            name="pronounciation"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item<TWordFormDataType> label="Description" name="description">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item<TWordFormDataType> label="Group" name="lessonId">
            <LessonSelect />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item<TWordFormDataType> label="Images" name="localImages">
            <UploadFile />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item<TWordFormDataType> label="Examples" name="examples">
            <Input />
          </Form.Item>
        </Col>
      </Row>
    </Modal>
  );
};

export default WordModal;
