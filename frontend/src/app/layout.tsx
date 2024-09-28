'use client';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import 'antd/dist/reset.css';
import '../styles/index.scss';

const RootLayout = ({ children }: React.PropsWithChildren) => {

  return (
    <html>
      <head />
      <body>
        <AntdRegistry>
          {children}
        </AntdRegistry>
      </body>
    </html>
  );
}

export default RootLayout;
