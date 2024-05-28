import { notification } from 'antd';
import { NotificationType } from '@/types/notification';

export const openNotificationWithIcon = (type: NotificationType, message: string, description: string) => {
    return notification[type]({
        message: message,
        description: description,
    });
};
