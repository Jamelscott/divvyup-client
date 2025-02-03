function StackedDate({ date }: { date: Date }) {
        return (
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <h1 style={{ fontSize: '19px', fontWeight: 'normal', lineHeight: '23px' }}>{months[new Date(date).getMonth() + 1]}</h1>
                        <h2 style={{ fontSize: '25px', fontWeight: 'bold', lineHeight: '23px' }}>{new Date(date).getDate()}</h2>
                </div>
        );
}

export default StackedDate;

const months: { [key: number]: string } = {
        1: 'Jan',
        2: 'Feb',
        3: 'Mar',
        4: 'Apr',
        5: 'May',
        6: "Jun",
        7: "Jul",
        8: "Aug",
        9: 'Sep',
        10: "Oct",
        11: "Nov",
        12: "Dec"
}