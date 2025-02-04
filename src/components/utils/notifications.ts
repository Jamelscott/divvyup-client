import { NotificationPosition } from "node_modules/@mantine/notifications/lib/notifications.store"

export const errorNotification = (title:string, message: string ) : {
        title: string,
        message: string,
        color: string,
        withBorder: boolean,
        radius: string,
        position: NotificationPosition
} => {
        return {
                title: title,
                message: message,
                color: 'grape',
                withBorder: true,
                radius: "md",
                position:'top-center'
            }
}