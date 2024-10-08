'use client';

import React, { useEffect, useState } from 'react';
import { generateUniqueId } from '@/utils';
import InputItem from './InputItem';

export type TInputListType = {
  id: string;
  value: string;
};

interface IFormListProps {
  value?: TInputListType[];
  onChange?: (newList: TInputListType[]) => void;
}

const getInitialInputList = () => [{
  id: generateUniqueId(),
  value: '',
}];

const FormList: React.FC<IFormListProps> = ({value, onChange}) => {
  const [inputList, setInputList] = useState<TInputListType[]>(() => getInitialInputList());

  // Controlled component: If 'value' is provided, use it.
  useEffect(() => {
    if (value) {
      const isEmptyValue = value.length === 0;
      setInputList(isEmptyValue ? getInitialInputList() : value);
    }
  }, [value]);



  const addMoreInput = () => {
    const newInputData = { id: generateUniqueId(), value: '' };
    setInputList(prev => [...prev, newInputData]);
  }

  const handleInternalChange = (newList: TInputListType[]) => {
    // Update internal state
    if (value === undefined) setInputList(newList);

    // Call the onChange prop if provided (controlled mode)
    onChange?.(newList);
  };

  const handleChangeInputValue = (id: string, value: string) => {
    const newList = inputList.map((inputData) => {
      if (inputData.id === id) {
        return { ...inputData, value };
      }
      return inputData;
    });
    handleInternalChange(newList);
  }

  const handleDeleteInputItem = (id: string) => {
    const newList = inputList.filter((inputData) => inputData.id !== id);
    handleInternalChange(newList);
  }

  return (
    <div>
      <ul className='flex flex-col gap-2 w-full'>
        {inputList.map((inputData, index) => (
          <li key={inputData.id} className='w-full'>
             <InputItem
              id={inputData.id}
              value={inputData.value}
              onChange={handleChangeInputValue}
              addMoreInput={addMoreInput}
              showDeleteButton={index !== inputList.length - 1}
              onDeleteInput={handleDeleteInputItem}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default React.memo(FormList);
