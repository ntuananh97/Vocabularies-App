import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Metadata } from 'next';
import { Roboto } from 'next/font/google'
import 'antd/dist/reset.css';
import '../styles/index.scss';

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Vocabularies App',
    template: '%s | Vocabularies App',
  },
  icons: '/q-twilight.png',
}

const RootLayout = ({ children }: React.PropsWithChildren) => {

  return (
    <html className={roboto.className}>
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