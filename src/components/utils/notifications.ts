export const errorNotification = (title:string, message: string ) : {
        title: string,
        message: string,
        color: string,
        withBorder: boolean,
        radius: string,
} => {
        return {
                title: title,
                message: message,
                color: 'red',
                withBorder: true,
                radius: "md",
            }
}