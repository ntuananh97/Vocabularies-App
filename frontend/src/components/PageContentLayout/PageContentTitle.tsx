import { Typography } from 'antd';
import React from 'react';

interface IPageContentTitleProps {
  title?: string;
}

const { Title } = Typography;

const PageContentTitle: React.FC<IPageContentTitleProps> = ({ title }) => {
  return (
    <Title style={{ marginBottom: 0 }} level={2}>
      {title}
    </Title>
  );
};

export default PageContentTitle;
