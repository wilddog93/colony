import { faker } from "@faker-js/faker";

export type Items = {
  images?: string;
  id?: any | string;
  productName?: string;
  code?: number;
  category?: string;
  price?: number | string;
  status?: "active" | "inactive";
  subRows?: Items[];
  description?: string;
  quantity?: number;
  transId?: number;
  transName?: string;
  transDate?: string;
};

const range = (len: number) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const generateMoneyFormat = (): string => {
  const amount = faker.datatype.number({ min: 1000, max: 100000 });
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
  return formattedAmount;
};

const newItem = (): Items => {
  return {
    images: faker.image.imageUrl(400, 400, "product", true),
    id: faker.datatype.uuid(),
    productName: faker.commerce.productName(),
    code: faker.datatype.number(10),
    category: faker.helpers.shuffle<Items["category"]>([
      "Drinks",
      "Food",
      "Snacks",
    ])[0]!,
    price: generateMoneyFormat(),
    status: faker.helpers.shuffle<Items["status"]>(["active", "inactive"])[0]!,
    quantity: faker.datatype.number(10),
  };
};

export function itemData(...lens: number[]) {
  const makeDataLevel = (depth = 0): Items[] => {
    const len = lens[depth]!;
    console.log(newItem());
    return range(len).map((d): Items => {
      return {
        ...newItem(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      };
    });
  };

  return makeDataLevel();
}
