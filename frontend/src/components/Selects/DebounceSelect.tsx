import { TGroupSelectImperativeRef } from '@/types/createFast';
import { Select, SelectProps, Spin } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import debounce from 'lodash/debounce';
import { ISelectProps } from '@/types/select';

const DEBOUNCE_TIMEOUT = 500; // ms

const DebounceSelect = forwardRef<TGroupSelectImperativeRef, ISelectProps>(({
  onChange,
  value,
  debounceTimeout = DEBOUNCE_TIMEOUT,
  fetchOptions,
  labelOfValue,
  ...props
}, ref) => {
  const [options, setOptions] = useState<SelectProps['options']>([]);
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(
    async (search?: string) => {
      setLoading(true);

      const newOptions = await fetchOptions(search);
      setOptions(newOptions);

      setLoading(false);
    },
    [fetchOptions],
  )


  const debouncedFetchOptions = useCallback(
    debounce(async (search: string) => {
      fetchData(search)
    }, debounceTimeout),
    [fetchData, debounceTimeout]
  );

  useEffect(() => {
    fetchData();
  }, [])


  useEffect(() => {
    return () => {
      debouncedFetchOptions.cancel();
    };
  }, [debouncedFetchOptions]);

  
  // Add new option if not exist
  useEffect(() => {

    const addNewOptionIfNotExist = () => {
      if (!value || !labelOfValue) return;

      const isValueExist = options?.some(option => option.value === value);
      if (isValueExist) return

      const newOption: DefaultOptionType = {
        value,
        label: labelOfValue
      }

      setOptions(prev => ([newOption, ...(prev || [])]))
    }

    addNewOptionIfNotExist();

  }, [value, labelOfValue, options])
  

  useImperativeHandle(ref, () => {
    return {
      updateNewGroupValue(data: DefaultOptionType) {
        onChange?.(data.value as string);
        setOptions(prev => ([data, ...(prev || [])]))
      }
    };
  }, []);

  const handleChange = (value: string) => {
    onChange?.(value);
  };

  return (
    <Select
      {...props}
      value={value}
      onChange={handleChange}
      options={options}
      onSearch={debouncedFetchOptions}
      filterOption={false}
      notFoundContent={loading ? <Spin size="small" /> : null}
      loading={loading}
    />
  );
});

export default DebounceSelect;
