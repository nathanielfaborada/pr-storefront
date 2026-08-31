import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { useCart } from '../../context/CartContext.tsx';
import { useWishlist } from '../../context/WishlistContext.tsx';
import { INITIAL_PRODUCTS } from '../../data/products.ts';
import { formatPhp } from '../../utils/index.ts';
import { ShoppingBag, Heart, Package, Trash2, ExternalLink, User } from 'lucide-react';
import { Button } from '../../components/common/Button.tsx';
import { Badge } from '../../components/common/Badge.tsx';

export const AccountPage: React.FC = () => {
  const { user, isAuthenticated, setIsAuthModalOpen, logout } = useAuth();
  const { cart, removeFromCart } = useCart();
  const { wishlistIds, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'cart' | 'wishlist' | 'orders'>('cart');

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-md mx-auto py-24 text-center px-4 font-mono">
        <div className="w-14 h-14 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto mb-4 text-zinc-600">
          <User className="w-6 h-6" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-zinc-950">Customer Vault Portal</h2>
        <p className="text-xs text-zinc-500 mt-2">
          Sign in with Google or Facebook to view your active bag items, saved watchlist pieces, and past order manifests.
        </p>
        <Button
          variant="primary"
          size="md"
          className="mt-6 font-bold shadow-md"
          onClick={() => setIsAuthModalOpen(true)}
        >
          Sign In with Social Login
        </Button>
      </div>
    );
  }

  // Find wishlisted items
  const wishlistedItems = INITIAL_PRODUCTS.filter(p => wishlistIds.includes(p.id));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-mono text-zinc-950 animate-in fade-in duration-200">
      
      {/* 1. Account Profile Masthead */}
      <div className="bg-zinc-50 p-6 rounded-3xl border border-zinc-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-zinc-950 text-white flex items-center justify-center font-heading font-extrabold text-xl shadow-md border border-amber-500/30">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full rounded-2xl object-cover" />
            ) : (
              user.name.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-xl font-bold text-zinc-950">{user.name}</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Verified
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">{user.email}</p>
            <span className="text-[10px] text-zinc-400 capitalize">
              Connected via {user.provider || 'Google'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {user.role === 'admin' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin')}
              className="text-xs text-amber-800 border-amber-300 bg-amber-50/50 hover:bg-amber-100"
            >
              Seller Studio →
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="text-xs text-zinc-600 hover:text-black"
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="border-b border-zinc-200 flex items-center gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('cart')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'cart' ? 'text-zinc-950 font-bold' : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4" />
            <span>Shopping Bag ({cart.length})</span>
          </span>
          {activeTab === 'cart' && (
            <span className="absolute bottom-0 inset-x-0 h-0.5 bg-black rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'wishlist' ? 'text-zinc-950 font-bold' : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Heart className="w-4 h-4" />
            <span>Saved Pieces ({wishlistIds.length})</span>
          </span>
          {activeTab === 'wishlist' && (
            <span className="absolute bottom-0 inset-x-0 h-0.5 bg-black rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'orders' ? 'text-zinc-950 font-bold' : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Package className="w-4 h-4" />
            <span>Past Orders</span>
          </span>
          {activeTab === 'orders' && (
            <span className="absolute bottom-0 inset-x-0 h-0.5 bg-black rounded-full" />
          )}
        </button>
      </div>

      {/* 3. TAB CONTENT */}

      {/* A. Shopping Bag Items */}
      {activeTab === 'cart' && (
        <div className="space-y-4">
          {cart.length === 0 ? (
            <div className="py-16 text-center border-2 border-dashed border-zinc-200 rounded-3xl bg-zinc-50/50">
              <ShoppingBag className="w-8 h-8 mx-auto text-zinc-300 mb-2" />
              <p className="font-heading font-bold text-base text-zinc-900">Your Bag is Empty</p>
              <p className="text-xs text-zinc-500 mt-1">Explore Drop 08 and add your favorite archival pieces.</p>
              <Button
                variant="primary"
                size="sm"
                className="mt-4 text-xs font-bold"
                onClick={() => navigate('/')}
              >
                Browse Live Racks →
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="divide-y divide-zinc-200 border border-zinc-200 rounded-3xl overflow-hidden bg-white shadow-sm">
                {cart.map(cartItem => {
                  const item = cartItem.item;
                  const qty = cartItem.quantity || 1;
                  if (!item) return null;

                  return (
                    <div key={item.id} className="p-4 flex items-center justify-between gap-4 hover:bg-zinc-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.images?.[0] || ''}
                          alt={item.title}
                          className="w-16 h-20 object-cover rounded-xl border border-zinc-200 bg-zinc-100"
                        />
                        <div className="space-y-1">
                          <Badge variant="gold">1-of-1 Curated</Badge>
                          <h4 className="font-heading font-bold text-sm text-zinc-950">{item.title}</h4>
                          <p className="text-xs text-zinc-500">
                            Tag: {item.tagSize} {item.measurements?.pitToPitInches ? `· ${item.measurements.pitToPitInches}" Width` : ''} {qty > 1 ? `· Qty: ${qty}` : ''}
                          </p>
                          <span className="font-mono font-bold text-sm text-zinc-950 block">
                            {formatPhp(item.pricePhp * qty)}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove from Bag"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => navigate(`/drops/${item.id}`)}
                          className="text-xs"
                        >
                          View Piece
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* B. Saved Watchlist Pieces */}
      {activeTab === 'wishlist' && (
        <div className="space-y-4">
          {wishlistedItems.length === 0 ? (
            <div className="py-16 text-center border-2 border-dashed border-zinc-200 rounded-3xl bg-zinc-50/50">
              <Heart className="w-8 h-8 mx-auto text-zinc-300 mb-2" />
              <p className="font-heading font-bold text-base text-zinc-900">No Saved Watchlist Items</p>
              <p className="text-xs text-zinc-500 mt-1">Tap the heart icon on any drop piece to save it for quick inspection.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {wishlistedItems.map(item => (
                <div key={item.id} className="p-4 bg-white border border-zinc-200 rounded-2xl flex items-center justify-between gap-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <img src={item.images?.[0] || ''} alt={item.title} className="w-14 h-16 object-cover rounded-xl bg-zinc-100" />
                    <div>
                      <h4 className="font-heading font-bold text-xs text-zinc-950 line-clamp-1">{item.title}</h4>
                      <p className="text-xs font-mono font-bold text-zinc-900 mt-0.5">{formatPhp(item.pricePhp)}</p>
                      <span className="text-[10px] text-zinc-500">Tag: {item.tagSize}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="p-1.5 text-zinc-400 hover:text-red-600 rounded-md"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/drops/${item.id}`)}
                      className="text-xs"
                    >
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* C. Past Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="p-5 bg-white border border-zinc-200 rounded-3xl space-y-3 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <span className="font-bold text-xs text-zinc-950">Order #PR-202608-8841</span>
                <p className="text-[10px] text-zinc-500">Placed on August 31, 2026</p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                Payment Verified
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-600">Heavyweight 260 GSM Drop-Shoulder Boxy Tee</span>
              <span className="font-bold text-zinc-950">{formatPhp(2549)}</span>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/orders/PR-202608-8841')}
                className="text-xs flex items-center gap-1"
              >
                <span>Track J&amp;T Parcel</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
