'use client';

import { readText } from '@/utils';
import { Button } from 'antd';
import React from 'react';
import { SoundOutlined } from '@ant-design/icons';

interface ISpeakTextWrapperProps {
  text: string;
  children?: React.ReactNode;
}

const SpeakTextWrapper: React.FC<ISpeakTextWrapperProps> = ({text, children}) => {
  const handleSpeak = (text: string) => {
    readText(text);
  };

  return (
    <span className="flex items-center justify-between gap-1">
      {children ? children : <span>{text}</span>}
      <Button
        icon={<SoundOutlined />}
        type="text"
        onClick={() => handleSpeak(text)}
      ></Button>
    </span>
  );
};

export default React.memo(SpeakTextWrapper);
