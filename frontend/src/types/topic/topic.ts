import { REVIEW_TOPIC_TYPES } from "@/views/pages/topic/constants";

export type TTopicType = {
  _id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type TTopicFormData = Pick<TTopicType, 'name'>;

export type TReviewTopicType = (typeof REVIEW_TOPIC_TYPES)[keyof typeof REVIEW_TOPIC_TYPES];

export type TUseTopicParams = {
  type?: TReviewTopicType;
}

