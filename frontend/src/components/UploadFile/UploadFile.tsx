'use client';

import { Button, Input, notification, Space, Upload, UploadProps } from 'antd';
import { UploadOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { BASE_URL } from '@/helpers/axios/axios';
import { API_ENDPOINTS } from '@/configs/api';
import { useEffect, useMemo, useState } from 'react';
import { generateUniqueId } from '@/utils';
import { MAX_URL_LENGTH } from '@/configs/constants';

const getUploadAction = () => `${BASE_URL}${API_ENDPOINTS.UPLOAD.SINGLE}`;

export type TFileListType = {
  id: string;
  url: string;
};

interface IUploadFileProps {
  value?: TFileListType[];
  accept?: string;
  onChange?: (value: TFileListType[]) => void;
}

const UploadFile: React.FC<IUploadFileProps> = ({value, onChange, accept}) => {
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

  const isValidUrlLink = useMemo(() => {
    if (!urlTextLink) return true;
    const pattern = /^http[s]?:\/\//; // starts with http:// or https://
    return pattern.test(urlTextLink);
  }, [urlTextLink])

  const handleAddUrlTextLink = () => {
    const trimValue = urlTextLink.trim();
    const isExceedMaxLength = trimValue.length > MAX_URL_LENGTH;
    if (!trimValue || isExceedMaxLength || !isValidUrlLink) return;

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

      <div className="mt-4 flex flex-col gap-5">
        <Upload
          showUploadList={false}
          action={getUploadAction()}
          withCredentials
          onChange={handleChangeUpload}
          style={{ width: '100%' }}
          accept={accept}
        >
          <Button loading={loading} icon={<UploadOutlined />}>
            Click to Upload
          </Button>
        </Upload>

        <div className='w-full'>
          <Space.Compact style={{ width: '100%' }}>
            <Input
              count={{
                show: true,
                max: MAX_URL_LENGTH,
              }}
              status={!isValidUrlLink ? 'error' : undefined}
              placeholder="Enter image url"
              value={urlTextLink}
              onChange={handleChangeInput}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddUrlTextLink}
            />
          </Space.Compact>
          {!isValidUrlLink && <p className="text-red-600 text-xs mt-1">Invalid url</p>}
        </div>
      </div>
    </div>
  );
};

export default UploadFile;
