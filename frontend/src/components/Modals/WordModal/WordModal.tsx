import CreateGroupFast from '@/components/CreateFast/CreateGroupFast';
import FormList from '@/components/FormList';
import UploadFile from '@/components/UploadFile';
import { handleErrorResponse, handleSuccessResponse } from '@/helpers/response';
import { createNewWord, getDetailWord, updateWord } from '@/services/word';
import { TWordFormDataType, TWordType } from '@/types/word';
import { generateUniqueId, trimStringValue } from '@/utils';
import { Modal, Form, Input, Row, Col, Spin } from 'antd';
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

  const editDataId = editData._id;
  const isEdit = !!editDataId;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getDetailWord(editDataId);
        const detailWord: TWordType = response.data;

        const localImages =
          detailWord.images?.map((url) => ({ id: generateUniqueId(), url })) ||
          [];

        const localExamples =
          detailWord.examples?.map((example) => ({
            id: generateUniqueId(),
            value: example,
          })) || [];

        form.setFieldsValue({
          title: detailWord.title,
          keyWord: detailWord.keyWord,
          definition: detailWord.definition,
          pronounciation: detailWord.pronounciation,
          description: detailWord.description,
          lessonId: detailWord.lessonId?._id || undefined,
          localImages,
          localExamples,
        });
      } catch (error) {
        handleErrorResponse(error);
      }
      setLoading(false);
    };

    if (visible && editDataId) fetchData();
  }, [visible, editDataId]);


  const createOrUpdateTopic = async (values: TWordFormDataType) => {
    const images = values.localImages?.map((image) => image.url) || [];
    const examples = values.localExamples?.map((item) => item.value) || [];

    const payload = {
      title: trimStringValue(values.title),
      keyWord: trimStringValue(values.keyWord),
      definition: trimStringValue(values.definition),
      pronounciation: trimStringValue(values.pronounciation),
      description: trimStringValue(values.description),
      lessonId: values.lessonId,
      topicId,
      images,
      examples
    };

    setLoading(true);
    try {
      isEdit
        ? await updateWord(editDataId, payload)
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
      okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
      style={{ minWidth: '50%' }}
      modalRender={(dom) => (
        <Spin spinning={loading}>
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
              lessonId: undefined,
              localImages: [],
              localExamples: [],
            }}
          >
            {dom}
          </Form>
        </Spin>
      )}
    >
      <Row gutter={15}>
        <Col xs={24} md={12}>
          <Form.Item<TWordFormDataType>
            label="Structure"
            name="title"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item<TWordFormDataType>
            label="Word"
            name="keyWord"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item<TWordFormDataType>
            label="Definition"
            name="definition"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item<TWordFormDataType>
            label="Pronunciation"
            name="pronounciation"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item<TWordFormDataType> label="Description" name="description">
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item<TWordFormDataType> label="Group" name="lessonId">
            <CreateGroupFast />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item<TWordFormDataType> label="Images" name="localImages">
            <UploadFile accept="image/png, image/jpeg" />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item<TWordFormDataType> label="Examples" name="localExamples">
            <FormList />
          </Form.Item>
        </Col>
      </Row>
    </Modal>
  );
};

export default WordModal;
