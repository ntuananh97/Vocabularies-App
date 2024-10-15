export type TGroupType = {
  _id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type TGroupFormData = Pick<TGroupType, 'name'>;
