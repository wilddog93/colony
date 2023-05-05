import { DateModule, PhoneModule, faker } from '@faker-js/faker'

export type ColumnItems = {
    id: any
    fullName: string
    firstName: string
    lastName: string
    gender: string
    age: number
    email: string,
    phoneNumber: string | number
    images: string
    owned: number
    occupied: number
    date: string | number
    visits: number
    progress: number
    status: 'active' | 'inactive'
    subRows?: ColumnItems[]
}

const range = (len: number) => {
    const arr = []
    for (let i = 0; i < len; i++) {
        arr.push(i)
    }
    return arr
}

const newPerson = (): ColumnItems => {
    return {
        id: faker.datatype.uuid(),
        fullName: `${faker.name.firstName()} ${faker.name.lastName()}`,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        images: faker.image.dataUri(),
        email: `${faker.name.firstName()}@gmail.com`,
        gender: faker.helpers.shuffle<ColumnItems['gender']>([
            'male',
            'female',
            'any',
        ])[0]!,
        phoneNumber: faker.phone.phoneNumber('6281#########'),
        date: faker.date.recent().toDateString(),
        owned: faker.datatype.number(40),
        occupied: faker.datatype.number(100),
        age: faker.datatype.number(40),
        visits: faker.datatype.number(1000),
        progress: faker.datatype.number(100),
        status: faker.helpers.shuffle<ColumnItems['status']>([
            'active',
            'inactive',
        ])[0]!,

    }
}

export function makeData(...lens: number[]) {
    const makeDataLevel = (depth = 0): ColumnItems[] => {
        const len = lens[depth]!
        return range(len).map((d): ColumnItems => {
            return {
                ...newPerson(),
                subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
            }
        })
    }

    return makeDataLevel()
}
