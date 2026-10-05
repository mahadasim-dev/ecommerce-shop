import { useState, useEffect } from 'react';
import './App.css';

interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface FetchResponse {
  products: Product[];
}

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch('https://dummyjson.com/products?limit=12');
        
        if (!response.ok) {
          throw new Error('Failed to fetch the product catalog');
        }

        const data: FetchResponse = await response.json();
        
        setProducts(data.products);
      }
      catch (error) {
        console.error('Error fetching data: ', error);
      }
    }
    loadProducts();
  }, []);

  function AddToCart(product: Product) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  }

  return (
    <div id='app-container'>
      <h1>Edge Shop</h1>
      <div id='app-layout'>
        <div className='products-grid'>
          {products.map((product) => (
            <div className='product-card' key={product.id}>
              <img src={product.thumbnail} alt={product.title} />
              <h3>{product.title}</h3>
              <p className='price'>${product.price.toFixed(2)}</p>
              <button onClick={() => AddToCart(product)}>Add to Cart</button>
            </div>
          ))}
        </div>
        <div className='cart-sidebar'>
          <h2>Your Basket</h2>
          
          {cart.length === 0 ? (
            <p className="empty-cart-message">Your basket is currently empty.</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-item-row">
                <h4>{item.title}</h4>
                <p>Price: ${item.price.toFixed(2)} x {item.quantity}</p>
              </div>
            ))
          )}
          {cart.length > 0 && (
            <div className="cart-total">
              <h3>
                Total: $
                {cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
              </h3>
              <button className="checkout-button">Proceed to Checkout</button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
