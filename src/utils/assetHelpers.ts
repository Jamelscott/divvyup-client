import grocery from '../../../assets/expenseOptions/grocery.svg'
import household from '../../../assets/expenseOptions/household.svg'
import mortgage from '../../../assets/expenseOptions/mortgage.svg'
import pet from '../../../assets/expenseOptions/pet.svg'
import rent from '../../../assets/expenseOptions/rent.svg'

export const navOptions = [
    {
        id: 'home',
        image: homeIcon,
        route: '/',
        active: false
    },
    {
        id: 'profile',
        image: profileIcon,
        route: '/profile',
        active: false
    },
    {
        id: 'friends',
        image: friendsIcon,
        route: '/friends',
        active: false
    },
    {
        id: 'analytics',
        image: analyticsIcon,
        route: '/analytics',
        active: false
    },
    {
        id: 'logout',
        image: logoutIcon,
        route: null,
        active: false
    },
]
export const expenseOptions = {
    houseold: household,
    rent: rent,
    mortgage: mortgage,
    diningOut: diningOut,
    grocery: grocery,
    pet: pet
}