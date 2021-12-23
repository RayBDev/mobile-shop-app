// class Product {
//   id: string;
//   ownerId: string;
//   /** The title of the product */
//   title: string;
//   /** The url of the product */
//   imageUrl: string;
//   description: string;
//   price: number;

//   constructor(
//     id: string,
//     ownerId: string,
//     title: string,
//     imageUrl: string,
//     description: string,
//     price: number
//   ) {
//     this.id = id;
//     this.ownerId = ownerId;
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//   }
// }

type Product = {
  /** Unique ID of the product */
  id: string;
  /** Unique ID of the product owner */
  ownerId: string;
  /** The title of the product */
  title: string;
  /** The url of the product */
  imageUrl: string;
  /** Description of the product */
  description: string;
  /** Price of the product */
  price: number;
};

export type DatabaseProduct = {
  [key: string]: Omit<Product, 'id'>;
};

export default Product;
