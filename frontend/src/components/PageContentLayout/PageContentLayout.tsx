import React from 'react';
import PageContentTitle from './PageContentTitle';
import { Breadcrumb, BreadcrumbProps } from 'antd';
import NavLink from '@/app/nav-link';

interface IPageContentLayoutProps {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  customHeader?: React.ReactNode;
  breadCrumbItems?: BreadcrumbProps['items'];
}

const PageContentLayout: React.FC<IPageContentLayoutProps> = ({
  title,
  action,
  children,
  customHeader,
  breadCrumbItems
}) => {
  return (
    <div>
      {breadCrumbItems && (
        <Breadcrumb
          items={[{title: <NavLink href='/'>Home page</NavLink>}, ...breadCrumbItems]}
        />
      )}
      
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
