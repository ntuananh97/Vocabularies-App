import { Divider } from 'antd';
import React from 'react';

interface ISearchComponentProps {
  children: React.ReactNode;
  label: string;
  labelFor: string;
}

const SearchComponent: React.FC<ISearchComponentProps> = ({
  children,
  label,
  labelFor
}) => {
  return (
    <>
      <div>
        <div className="mb-2">
          <label htmlFor={labelFor} className="font-bold">
            {label}
          </label>
        </div>

        <div>{children}</div>
      </div>
      <Divider />
    </>
  );
};

export default SearchComponent;
