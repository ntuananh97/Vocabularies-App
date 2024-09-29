export type TTopicType = {
  _id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type TTopicFormData = Pick<TTopicType, 'name'>;

