import SpeakTextWrapper from '@/components/SpeakTextWrapper';
import { handleErrorResponse, handleSuccessResponse } from '@/helpers/response';
import { getDetailWord } from '@/services/word';
import { TWordType } from '@/types/word';
import { formatDate } from '@/utils/date';
import {
  Descriptions,
  Flex,
  Image,
  List,
  Modal,
  Result,
  Tag,
  Timeline,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';

type TWordInfoModal = {
  visible: boolean;
  onCancel: () => void;
  editData: TWordType;
};

const { Title } = Typography;

const WordInfoModal: React.FC<TWordInfoModal> = ({
  visible,
  onCancel,
  editData,
}) => {
  const [loading, setLoading] = useState(false);
  const [wordInfo, setWordInfo] = useState({} as TWordType);

  const wordInfoId = wordInfo._id;
  const editDataId = editData._id;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getDetailWord(editDataId);
        setWordInfo(response.data);
      } catch (error) {
        handleErrorResponse(error);
      }
      setLoading(false);
    };

    const needFetchNewWordInfo = editDataId !== wordInfoId;

    if (visible && needFetchNewWordInfo) fetchData();
  }, [visible, wordInfoId, editDataId]);

  const handleCancel = () => {
    onCancel?.();
  };

  const {images} = wordInfo;

  return (
    <Modal
      title={<SpeakTextWrapper text={editData.title} />}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      loading={loading}
    >
      {wordInfo._id ? (
        <div>
          {images?.length > 0 && (
            <Flex gap="middle" align="center">
              <Image.PreviewGroup items={images}>
                <Image src={images[0]} />
              </Image.PreviewGroup>

              {images.length - 1 > 0 && <Tag color='magenta'> +{images.length - 1} </Tag>}
            </Flex>
          )}

          {/* {firstImageUrl && <Image src={firstImageUrl} className="w-24 h-24 object-cover" />} */}
          <div className="flex items-center gap-2">
            <SpeakTextWrapper text={wordInfo.keyWord}>
              <Title level={2}>{wordInfo.keyWord}</Title>
            </SpeakTextWrapper>
            {wordInfo.pronounciation && (
              <span className="text-red-400">({wordInfo.pronounciation})</span>
            )}
            {wordInfo.lesson?.name && (
              <Tag color="magenta">{wordInfo.lesson.name}</Tag>
            )}
          </div>
          <Descriptions bordered layout="vertical" column={3}>
            {wordInfo.definition && (
              <Descriptions.Item label="Definition" span={3}>
                {wordInfo.definition}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Review count" span={1}>
              {wordInfo.reviewCount}
            </Descriptions.Item>
            <Descriptions.Item label="Step" span={2}>
              {wordInfo.step}
            </Descriptions.Item>
            <Descriptions.Item label="Description" span={3}>
              {wordInfo.description}
            </Descriptions.Item>
            <Descriptions.Item label="Created Date">
              {formatDate(wordInfo.createdAt)}
            </Descriptions.Item>
            <Descriptions.Item label="Updated Date">
              {formatDate(wordInfo.updatedAt)}
            </Descriptions.Item>
            <Descriptions.Item label="Next review Date">
              {formatDate(wordInfo.nextReviewDate)}
            </Descriptions.Item>
            {wordInfo.examples.length > 0 && (
              <Descriptions.Item label="Example" span={3}>
                <List
                  bordered
                  dataSource={wordInfo.examples}
                  renderItem={(item) => (
                    <List.Item>
                      <SpeakTextWrapper
                        text={item}
                        className="justify-between"
                      />
                    </List.Item>
                  )}
                />
              </Descriptions.Item>
            )}
            {wordInfo.reviewHistory.length > 0 && (
              <Descriptions.Item label="Review History" span={3}>
                <Timeline
                  items={wordInfo.reviewHistory.map((item) => ({
                    children: formatDate(item.reviewDate),
                  }))}
                />
              </Descriptions.Item>
            )}
          </Descriptions>
        </div>
      ) : (
        <Result status="error" title="The word does not exist." />
      )}
    </Modal>
  );
};

export default WordInfoModal;
