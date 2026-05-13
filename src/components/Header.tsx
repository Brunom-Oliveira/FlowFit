"use client";

import { useState } from 'react';
import { ShoppingBag, Menu, X, User } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount } = useCart();

  return (
    <header className="header">
      <div className="container header-content">
        <div className="logo-container">
          <Link href="/" className="logo">
            FLOWFIT
          </Link>
          <span className="logo-slogan">VISTA SUA FORÇA</span>
        </div>
        
        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <Link href="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>Início</Link>
          <Link href="/shop" className="nav-link" onClick={() => setIsMenuOpen(false)}>Catálogo</Link>
          <Link href="/shop" className="nav-link" onClick={() => setIsMenuOpen(false)}>Lançamentos</Link>
        </nav>

        <div className="header-actions">
          <Link href="/login" className="icon-btn" title="Minha Conta">
            <User size={24} />
          </Link>
          <Link href="/cart" className="icon-btn" title="Sacola">
            <ShoppingBag size={24} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          <button className="icon-btn mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}
