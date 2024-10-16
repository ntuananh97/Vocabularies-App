import { getLessons } from '@/services/lesson';
import { TGroupSelectImperativeRef } from '@/types/createFast';
import { TGroupType } from '@/types/lesson';
import { Select, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import debounce from 'lodash/debounce';

interface ISelectProps extends SelectProps {
  onChange?: (_value: string) => void;
  value?: string;
  debounceTimeout?: number;
  fetchOptions: (search: string) => Promise<DefaultOptionType[]>;
}

const PAGINATION_LIMIT = 10;
const DEBOUNCE_TIMEOUT = 300; // ms

const DebounceSelect = forwardRef<TGroupSelectImperativeRef, ISelectProps>(({
  onChange,
  value,
  debounceTimeout = DEBOUNCE_TIMEOUT,
  fetchOptions,
  ...props
}, ref) => {
  const [options, setOptions] = useState<SelectProps['options']>([]);
  const [intervalValue, setIntervalValue] = useState("");
  const [searchValue, setSearchValue] = useState<string>('');
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (value !== undefined) setIntervalValue(value);
  }, [value])

  // useEffect(() => {
  //   console.log('fetching data in effect');

  //   const fetchData = async () => {
  //     const response = await getLessons();
  //     const data = response.data as TGroupType[];
  //     const newLessons = data.map((item) => ({
  //       value: item._id,
  //       label: item.name,
  //     }));
  //     setOptions(newLessons);
  //   };

  //   fetchData();
  // }, []);

  const debouncedFetchOptions = useCallback(
    debounce(async (search: string) => {
      setLoading(true);
      try {
        const newOptions = await fetchOptions(search);
        setOptions(newOptions);
      } catch (error) {
        console.error('Error fetching options:', error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, debounceTimeout),
    [fetchOptions, debounceTimeout]
  );

  useEffect(() => {
    debouncedFetchOptions(searchValue);
    return () => {
      debouncedFetchOptions.cancel();
    };
  }, [searchValue, debouncedFetchOptions]);

  useImperativeHandle(ref, () => {
    return {
      updateNewGroupValue(data: DefaultOptionType) {
        setIntervalValue(data.value as string);
        setOptions(prev => ([data, ...(prev || [])]))
      }
    };
  }, []);

  const handleChange = (value: string) => {
    if (value === undefined) setIntervalValue(value);
    onChange?.(value);
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  return (
    <Select
      {...props}
      value={intervalValue}
      onChange={handleChange}
      options={options}
      showSearch
      onSearch={handleSearch}
      loading={loading}
    />
  );
});

export default DebounceSelect;
