const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: "$99",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    name: "Smart Watch",
    price: "$199",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    name: "Bluetooth Speaker",
    price: "$49",
    image: "https://via.placeholder.com/150",
  },
];

const ProductCard = ({ product }) => (
  <div className="border rounded-lg shadow-md p-4 hover:shadow-lg transition">
    <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded" />
    <h3 className="mt-2 text-lg font-semibold">{product.name}</h3>
    <p className="text-gray-600">{product.price}</p>
    <button className="mt-4 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition">
      Buy Now
    </button>
  </div>
);

const ProductList = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
    {products.map((product) => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
);

export default ProductList;
