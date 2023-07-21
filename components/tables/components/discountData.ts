import { faker } from "@faker-js/faker";

export type DiscountProps = {
  id?: number | string;
  discountID?: any | string;
  discountCode?: string | number;
  discountName?: string | number;
  description?: string;
  amount?: string | number;
  type?: string | number;
  createdAt: Date | string | any;
  updatedAt: Date | string | any;
};

const range = (len: number) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const generateMoneyFormat = (): string => {
  const amount = faker.datatype.number({ min: 1, max: 10000 });
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
  return formattedAmount;
};

export const newDiscount = (): DiscountProps => {
  return {
    id: faker.datatype.uuid(),
    discountID: faker.datatype.number(10),
    description: faker.lorem.words(),
    amount: generateMoneyFormat(),
    discountCode: faker.datatype.number(10000),
    discountName: faker.lorem.words(),
    createdAt: faker.date.recent().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    type: faker.helpers.shuffle<DiscountProps["type"]>(["Amount"])[0]!,
  };
};

export function discountData(...lens: number[]) {
  const makeTaskLevel = (depth = 0): DiscountProps[] => {
    const len = lens[depth]!;
    return range(len).map((d): DiscountProps => {
      return {
        ...newDiscount(),
      };
    });
  };

  return makeTaskLevel();
}
