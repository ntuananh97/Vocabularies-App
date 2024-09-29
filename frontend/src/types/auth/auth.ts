export type TSignUpType = {
  name: string;
  password: string;
  confirmPass: string;
  email: string;
  avatar: string;
};

export type TLoginType = {
  email: string;
  password: string;
  remember?: string;
};

export type TUser = {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
};