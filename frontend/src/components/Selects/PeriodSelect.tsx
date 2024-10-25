import { getPeriods } from '@/services/period';
import { TPeriodType } from '@/types/period';
import { Select, SelectProps } from 'antd';
import React, { useEffect, useState } from 'react';

interface IPeriodSelectProps extends SelectProps {
  onChange?: (_value: string) => void;
  value?: string;
}

const PeriodSelect: React.FC<IPeriodSelectProps> = ({
  onChange,
  value,
  ...props
}) => {

    const [periods, setPeriods] = useState<SelectProps['options']>([]);
    const [intervalValue, setIntervalValue] = useState<string | undefined>(undefined)

    useEffect(() => {
      if (value !== undefined) setIntervalValue(value);
    }, [value])
    

    useEffect(() => {
      const fetchData = async () => {
        const response = await getPeriods();
        const data = response.data as TPeriodType[];

        const newPeriods = data.map((period) => ({
          value: period.step.toString(),
          label: `${period.name} (${period.step - 1} review count)`,
        }));
        setPeriods(newPeriods);
      };

      fetchData();
    }, []);
    

  const handleChange = (val: string) => {
    if (value === undefined) setIntervalValue(val);
    onChange?.(val);
  };

  return (
    <Select
      {...props}
      value={intervalValue}
      onChange={handleChange}
      options={periods}
    />
  );
};

export default PeriodSelect;
