import { getPeriods } from '@/services/period';
import { TPeriodType } from '@/types/period';
import { Select, SelectProps } from 'antd';
import React, { useEffect, useState } from 'react';

interface IPeriodSelectProps extends SelectProps {
  onChange: (_value: string) => void;
  value: string;
}

const PeriodSelect: React.FC<IPeriodSelectProps> = ({
  onChange,
  value,
  ...props
}) => {

    const [periods, setPeriods] = useState<SelectProps['options']>([])

    useEffect(() => {
        const  fetchData = async () => {
            const response = await getPeriods();
            const data = response.data as TPeriodType[];
            const newPeriods = data.map((period) => ({
                value: period.step.toString(),
                label: period.name, 
            }))
            setPeriods(newPeriods);
        }

        fetchData();
    
      
    }, [])
    

  const handleChange = (value: string) => {
    onChange(value);
  };

  return (
    <Select
      {...props}
      value={value}
      onChange={handleChange}
      options={periods}
    />
  );
};

export default PeriodSelect;
