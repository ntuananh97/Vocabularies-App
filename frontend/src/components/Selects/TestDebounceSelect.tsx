import React from 'react'
import DebounceSelect from './DebounceSelect'
import { SelectProps } from 'antd';
import { getLessons } from '@/services/lesson';
import { TGroupType } from '@/types/lesson';

interface ILessonSelectProps extends SelectProps {
    onChange?: (_value: string) => void;
    value?: string;
  }
  

const TestDebounceSelect: React.FC<ILessonSelectProps> = ({onChange, value, ...props}) => {

    const handleSearch = async (search: string) => {
        console.log('fetching data in effect');
    
        const fetchData = async () => {
            const response = await getLessons();
            const data = response.data as TGroupType[];
            const newLessons = data.map((item) => ({
                value: item._id,
                label: item.name,
            }));
            return newLessons;
        };
    
        return fetchData();
    }

  return (
    <DebounceSelect
        {...props}
      showSearch
      onChange={onChange}
      value={value}
      fetchOptions={handleSearch}
      // onSearch={handleSearch}
    />
  )
}

export default TestDebounceSelect