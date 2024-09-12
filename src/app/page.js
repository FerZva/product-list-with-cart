"use client"
import Image from "next/image";
import { useState } from "react";
import { product as products } from './services/data';
import iconAddToCart from './assets/images/icon-add-to-cart.svg';
import iconIncrementQuantity from './assets/images/icon-increment-quantity.svg';
import iconDecrementQuantity from './assets/images/icon-decrement-quantity.svg';


export default function Home() {
  const [cart, setCart] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const addToCart = (product) => {
    const existingProduct = cart.find(item => item.name === product.name);
    if (existingProduct) {
      setCart(cart.map(item => 
        item.name === product.name ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const increaseQuantity = (productName) => {
    setCart(cart.map(item => 
      item.name === productName ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const decreaseQuantity = (productName) => {
    const updatedCart = cart.map(item => 
      item.name === productName ? { ...item, quantity: item.quantity - 1 } : item
    ).filter(item => item.quantity > 0);
    setCart(updatedCart);
  };

  const removeFromCart = (productName) => {
    setCart(cart.filter(item => item.name !== productName));
  };

  const clearCart = () => {
    setCart([]);
    setIsPopupOpen(false);
  };

  const isInCart = (productName) => {
    return cart.some(item => item.name === productName);
  };

  const getQuantity = (productName) => {
    const product = cart.find(item => item.name === productName);
    return product ? product.quantity : 0;
  };

  return (
    <main className="flex flex-row">
      <div>
        <div>
          <h1>Desserts</h1>
        </div>
        <div className="flex flex-wrap">
          {products.map((product, index) => (
            <div key={index} style={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
              <div className="bg-slate-400 h-40 w-40 relative">
                <Image src={product.image.thumbnail} className="min-h-full w-full"/>
                {!isInCart(product.name) ? (
                  <button className="bg-white p-1 rounded-2xl absolute bottom-0 left-6" onClick={() => addToCart(product)}>
                    <Image src={iconAddToCart} className="inline"/>
                    Add to Cart
                  </button>
                ) : null}
                {isInCart(product.name) && (
                  <div style={{ marginTop: '10px' }} className="bg-orange-500">
                    <button onClick={() => decreaseQuantity(product.name)}>
                      <Image src={iconDecrementQuantity}/>
                    </button>
                    <p style={{ display: 'inline', margin: '0 10px' }}>Quantity: {getQuantity(product.name)}</p>
                    <button onClick={() => increaseQuantity(product.name)}>
                       <Image src={iconIncrementQuantity} className=""/>
                    </button>
                  </div>
                )}
              </div>
              <label>{product.category}</label>
              <h3>{product.name}</h3>
              <p>${product.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2>Shopping Cart</h2>
        <div className="flex flex-col">
          {cart.length > 0 ? (
            <>
              {cart.map((item, index) => (
                <div key={index} style={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
                  <p>{item.name} - Quantity: {item.quantity}</p>
                  <button onClick={() => removeFromCart(item.name)}>Remove</button>
                </div>
              ))}
              <button onClick={() => setIsPopupOpen(true)}>Show Summary</button>
            </>
          ) : (
            <p>Carrito vacío</p>
          )}
        </div>
      </div>
      
      {isPopupOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '10px', width: '300px' }}>
            <p>Gracias por la compra</p>
            {cart.map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <Image src={item.image.thumbnail} width={50} height={50} />
                <p style={{ marginLeft: '10px' }}>{item.name} - Quantity: {item.quantity}</p>
              </div>
            ))}
            <button onClick={clearCart} style={{ display: 'block', margin: '0 auto', marginTop: '20px' }}>
              Clear Cart & Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
