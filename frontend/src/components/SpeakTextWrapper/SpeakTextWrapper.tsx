'use client';

import { readText } from '@/utils';
import { Button } from 'antd';
import React from 'react';
import { SoundOutlined } from '@ant-design/icons';
import clsx from 'clsx';

interface ISpeakTextWrapperProps {
  text: string;
  children?: React.ReactNode;
  className?: string;
}

const SpeakTextWrapper: React.FC<ISpeakTextWrapperProps> = ({text, children, className}) => {
  const handleSpeak = (text: string) => {
    readText(text);
  };

  return (
    <span className={clsx({
      [(className as string)]: !!className,
    }, "flex items-center gap-1")}>
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
