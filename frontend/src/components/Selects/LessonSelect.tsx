import { getLessons } from '@/services/lesson';
import { TLessonType } from '@/types/lesson';
import { Select, SelectProps } from 'antd';
import React, { useEffect, useState } from 'react';

interface ILessonSelectProps extends SelectProps {
  onChange: (_value: string) => void;
  value: string;
}

const LessonSelect: React.FC<ILessonSelectProps> = ({
  onChange,
  value,
  ...props
}) => {
  const [lessons, setLessons] = useState<SelectProps['options']>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getLessons();
      const data = response.data as TLessonType[];
      const newLessons = data.map((item) => ({
        value: item._id,
        label: item.name,
      }));
      setLessons(newLessons);
    };

    fetchData();
  }, []);

  const handleChange = (value: string) => {
    onChange(value);
  };

  return (
    <Select
      {...props}
      value={value}
      onChange={handleChange}
      options={lessons}
    />
  );
};

export default LessonSelect;
