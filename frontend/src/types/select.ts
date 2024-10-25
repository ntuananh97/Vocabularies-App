import { SelectProps } from "antd";
import { DefaultOptionType } from "antd/es/select";

export interface ISelectProps extends SelectProps {
    onChange?: (_value: string) => void;
    value?: string;
    labelOfValue?: string; // label of value. Use for display value when value is not in options
    debounceTimeout?: number;
    fetchOptions: (search?: string) => Promise<DefaultOptionType[]>;
  }