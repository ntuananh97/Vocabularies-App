import { TGroupSelectImperativeRef } from '@/types/createFast';
import { Select, SelectProps, Spin } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import debounce from 'lodash/debounce';

interface ISelectProps extends SelectProps {
  onChange?: (_value: string) => void;
  value?: string;
  debounceTimeout?: number;
  fetchOptions: (search?: string) => Promise<DefaultOptionType[]>;
}

const DEBOUNCE_TIMEOUT = 500; // ms

const DebounceSelect = forwardRef<TGroupSelectImperativeRef, ISelectProps>(({
  onChange,
  value,
  debounceTimeout = DEBOUNCE_TIMEOUT,
  fetchOptions,
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
