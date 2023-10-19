export interface superMenuModal{
  name: string;
  categories: category[]
}

interface category{
  name: string;
  products: product[];
}

interface product{
  name:string;
  imgUrl:string;
}
