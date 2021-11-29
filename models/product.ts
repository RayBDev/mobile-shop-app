class Product {
  id: string;
  ownerId: string;
  /** The title of the product */
  title: string;
  /** The url of the product */
  imageUrl: string;
  description: string;
  price: number;

  constructor(
    id: string,
    ownerId: string,
    title: string,
    imageUrl: string,
    description: string,
    price: number
  ) {
    this.id = id;
    this.ownerId = ownerId;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }
}

export default Product;
