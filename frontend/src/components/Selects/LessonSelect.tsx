import { getLessons } from '@/services/lesson';
import { TGroupSelectImperativeRef } from '@/types/createFast';
import { TGroupType } from '@/types/lesson';
import { Select, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

interface ILessonSelectProps extends SelectProps {
  onChange?: (_value: string) => void;
  value?: string;
}

const LessonSelect = forwardRef<TGroupSelectImperativeRef, ILessonSelectProps>(({
  onChange,
  value,
  ...props
}, ref) => {
  const [lessons, setLessons] = useState<SelectProps['options']>([]);
  const [intervalValue, setIntervalValue] = useState("")

  useEffect(() => {
    if (value !== undefined) setIntervalValue(value);
  }, [value])

  useEffect(() => {
    console.log('fetching data in effect');

    const fetchData = async () => {
      const response = await getLessons();
      const data = response.data as TGroupType[];
      const newLessons = data.map((item) => ({
        value: item._id,
        label: item.name,
      }));
      setLessons(newLessons);
    };

    fetchData();
  }, []);

  useImperativeHandle(ref, () => {
    return {
      updateNewGroupValue(data: DefaultOptionType) {
        setIntervalValue(data.value as string);
        setLessons(prev => ([data, ...(prev || [])]))
      }
    };
  }, []);

  const handleChange = (value: string) => {
    if (value === undefined) setIntervalValue(value);
    onChange?.(value);
  };

  return (
    <Select
      {...props}
      value={intervalValue}
      onChange={handleChange}
      options={lessons}
    />
  );
});

export default LessonSelect;
