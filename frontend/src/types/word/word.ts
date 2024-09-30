import { Dayjs } from "dayjs";

export type TDatePickerValue = Dayjs | undefined

export type TWordType = {
  _id: string;
  title: string;
  keyWord: string;
  pronounciation: string;
  definition: string;
  description: string;
  sounds: string[];
  images: string[];
  examples: string[];
  reviewCount: number;
  step: number;
  nextReviewDate: string;
  reviewHistory: string[];
  lessonId: string;
  topicId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};



export type TWordSearchForm = TWordType & {
  fromCreatedAt: TDatePickerValue;
  toCreatedAt: TDatePickerValue;
  reviewCount: number | null
};

export type TSearchWordParams = {
  newFilter?: TWordSearchForm; 
};


