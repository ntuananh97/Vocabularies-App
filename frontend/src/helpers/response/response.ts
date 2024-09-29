import { notification } from 'antd';

export const handleErrorResponse = (error: unknown) => {
  if (error instanceof Error) {
    notification.error({ message: 'Error', description: error.message });
    return;
  }

  notification.error({
    message: 'Error',
    description: 'Unknown error occurred.',
  });
};

export const handleSuccessResponse = (message: string) => {
  notification.success({
    message: 'Success',
    description: message,
  });
};
