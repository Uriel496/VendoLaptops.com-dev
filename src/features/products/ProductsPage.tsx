import ProductCard from '../../components/ui/ProductCard';

const products = [
  { id: 1, name: 'Laptop Pro 15', price: 999, image: '', stock: 5 },
  { id: 2, name: 'Laptop Air 13', price: 799, image: '', stock: 3 },
];

const ProductsPage = () => {
  return (
    <main>
      <h2>Laptops</h2>
      <div>
        {products.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>
    </main>
  );
};

export default ProductsPage;
