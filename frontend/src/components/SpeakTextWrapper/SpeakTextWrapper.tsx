'use client';

import { readText } from '@/utils';
import { Button } from 'antd';
import React from 'react';
import { SoundOutlined } from '@ant-design/icons';

interface ISpeakTextWrapperProps {
  text: string;
}

const SpeakTextWrapper: React.FC<ISpeakTextWrapperProps> = ({text}) => {
  const handleSpeak = (text: string) => {
    readText(text);
  };

  return (
    <div className="flex items-center justify-between gap-1">
      <span>{text}</span>
      <Button
        icon={<SoundOutlined />}
        type="text"
        onClick={() => handleSpeak(text)}
      ></Button>
    </div>
  );
};

export default React.memo(SpeakTextWrapper);
