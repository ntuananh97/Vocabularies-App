import React, { forwardRef, useCallback } from 'react'
import DebounceSelect from './DebounceSelect'
import { SelectProps } from 'antd';
import { getLessons } from '@/services/lesson';
import { PAGE_SIZE_SELECT } from '@/configs/constants';
import { TQueryParams } from '@/types/common';
import { TGroupSelectImperativeRef } from '@/types/createFast';
import { ISelectProps } from '@/types/select';

interface ILessonSelectProps extends  SelectProps, Pick<ISelectProps, 'labelOfValue'>{
    onChange?: (_value: string) => void;
    value?: string;
}

const LessonSelect = forwardRef<TGroupSelectImperativeRef, ILessonSelectProps>(({onChange, value, ...props}, ref) => {
    const handleSearch = useCallback(
      async (search?: string) => {
        const fetchData = async () => {
          const params: TQueryParams = {
            limit: PAGE_SIZE_SELECT,
          };
          if (search) params.filter = JSON.stringify({ name: search });

          const response = await getLessons(params);
          const groupList = response.data.list
          const newLessons = groupList.map((item) => ({
            value: item._id,
            label: item.name,
          }));
          return newLessons;
        };

        return fetchData();
      },
      [],
    )


  return (
    <DebounceSelect
      {...props}
      ref={ref}
      showSearch
      onChange={onChange}
      value={value}
      fetchOptions={handleSearch}
    />
  )
}
);
export default LessonSelect
