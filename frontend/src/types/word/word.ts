import { Dayjs } from "dayjs";
import { ENABLE_USE_REVIEW, UN_ENABLE_USE_REVIEW } from '../../configs/words';
import { TFileListType } from "@/components/UploadFile/UploadFile";
import { TInputListType } from "@/components/FormList/FormList";
import { TLessonType } from "../lesson";

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
  reviewHistory: {reviewDate: string, step: number}[];
  lessonId: string;
  topicId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  lesson?: TLessonType;
};



export type TWordSearchForm = TWordType & {
  fromCreatedAt: TDatePickerValue;
  toCreatedAt: TDatePickerValue;
  reviewCount: number | null
};

export type TSearchWordParams = {
  filter?: Partial<TWordSearchForm>;
  topicId?: string
  useReviewToday?: typeof  ENABLE_USE_REVIEW | typeof UN_ENABLE_USE_REVIEW
  page?: number
  pageSize?: number
  sort?: string
};

export type TApiSearchWordParams = TSearchWordParams & {
  filter?: string;
};

export type TWordFormDataType = Partial<TWordType> & {
  localImages?: TFileListType[];
  localExamples?: TInputListType[];
}


