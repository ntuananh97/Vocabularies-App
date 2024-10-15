import React from 'react';
import PageContentTitle from './PageContentTitle';

interface IPageContentLayoutProps {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  customHeader?: React.ReactNode;
}

const PageContentLayout: React.FC<IPageContentLayoutProps> = ({
  title,
  action,
  children,
  customHeader,
}) => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3 gap-3">
        {customHeader || (
          <PageContentTitle title={title} />
        )}

        {action}
      </div>

      <div>{children}</div>
    </div>
  );
};

export default PageContentLayout;
