'use client';

import { Button, Input, notification, Space, Upload, UploadProps } from 'antd';
import { UploadOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { BASE_URL } from '@/helpers/axios/axios';
import { API_ENDPOINTS } from '@/configs/api';
import { useEffect, useState } from 'react';
import { generateUniqueId } from '@/utils';

const getUploadAction = () => `${BASE_URL}${API_ENDPOINTS.UPLOAD.SINGLE}`;

export type TFileListType = {
  id: string;
  url: string;
};

interface IUploadFileProps {
  value?: TFileListType[];
  onChange?: (value: TFileListType[]) => void;
}

const UploadFile: React.FC<IUploadFileProps> = ({value, onChange}) => {
  const [loading, setLoading] = useState(false);
  const [urlTextLink, setUrlTextLink] = useState("")
  const [fileList, setFileList] = useState<TFileListType[]>([]);

   // For controlled component: If 'value' is provided, use it.
  useEffect(() => {
    if (value !== undefined) {
      setFileList(value);
    }
  }, [value]);
  

  const handleChangeUpload: UploadProps['onChange'] = (info) => {
    setLoading(info.file.status === 'uploading');

    if (info.file.status === 'error') {
      notification.error({
        message: `${info.file.name} file upload failed.`,
      });
      return;
    }

    if (info.file.status === 'done') {
      const { response } = info.file;
      const urlFile = response.data.imageUrl;
      const newFile = { id: generateUniqueId(), url: urlFile };
      handleChangeProps([newFile, ...fileList]);
      return;
    }
  };

  const handleRemoveFile = (id: string) => {
    const newFileList = fileList.filter((file) => file.id !== id);
    handleChangeProps(newFileList);
  };

  const handleChangeProps = (newFileList: TFileListType[]) => {
    // For uncontrolled component: If 'value' is not provided, update the state.
    if (value === undefined) setFileList(newFileList);

    onChange?.(newFileList);
  }

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrlTextLink(e.target.value)
  }

  const handleAddUrlTextLink = () => {
    const trimValue = urlTextLink.trim()
    if (!trimValue) return;

    const newFile = { id: `${Math.random()}`, url: trimValue };
    handleChangeProps([newFile, ...fileList]);
    setUrlTextLink("")
  }

  return (
    <div>
      <ul className="flex items-center gap-1">
        {fileList.map((file) => (
          <li key={file.id}>
            <div className="w-20 h-20 relative">
              <img
                className="w-full h-full object-cover"
                src={file.url}
                alt="image"
              />

              <div className="absolute top-0 right-0">
                <Button
                  type="text"
                  icon={<CloseOutlined />}
                  onClick={() => handleRemoveFile(file.id)}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center gap-5">
        <Upload
          showUploadList={false}
          action={getUploadAction()}
          withCredentials
          onChange={handleChangeUpload}
        >
          <Button loading={loading} icon={<UploadOutlined />}>
            Click to Upload
          </Button>
        </Upload>

        <Space.Compact>
          <Input placeholder="Enter image url" value={urlTextLink} onChange={handleChangeInput} />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddUrlTextLink} />
        </Space.Compact>
      </div>
    </div>
  );
};

export default UploadFile;
