import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { useCart } from '../context/CartContext.tsx';
import { useWishlist } from '../context/WishlistContext.tsx';
import { INITIAL_PRODUCTS } from '../data/products.ts';
import { formatPhp } from '../utils/index.ts';
import { ShoppingBag, Heart, Package, ShieldCheck, CheckCircle2, ArrowRight, Clock, Trash2, ExternalLink, User } from 'lucide-react';
import { Button } from '../components/common/Button.tsx';
import { Badge } from '../components/common/Badge.tsx';

export const AccountPage: React.FC = () => {
  const { user, isAuthenticated, setIsAuthModalOpen, logout } = useAuth();
  const { cart, removeFromCart, secondsRemaining } = useCart();
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
          Sign in with Google or Facebook to view your active 15-minute holds, saved watchlist pieces, and past order manifests.
        </p>
        <Button
          variant="primary"
          size="md"
          className="mt-6 shadow-sm"
          onClick={() => setIsAuthModalOpen(true)}
        >
          Sign In with Google / Facebook
        </Button>
      </div>
    );
  }

  // Wishlist items from dataset
  const wishlistedItems = INITIAL_PRODUCTS.filter(p => wishlistIds.includes(p.id));

  // Mock past orders history for verified shopper
  const orderHistory = [
    {
      orderId: 'PR-202608-8841',
      date: 'August 30, 2026',
      items: [INITIAL_PRODUCTS[0]],
      totalAmountPhp: INITIAL_PRODUCTS[0]?.pricePhp || 2850,
      status: 'Out for Delivery (J&T Express)',
      waybillNumber: 'WB-JNT-49201948-MNL',
      paymentMethod: 'GCash QR',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 font-mono text-zinc-950 animate-in fade-in duration-200">
      
      {/* 1. Member Profile Masthead Card */}
      <div className="bg-zinc-50 rounded-3xl border border-zinc-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-zinc-300 shadow-sm"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-zinc-950 text-white flex items-center justify-center text-2xl font-bold font-heading">
              {user.name.charAt(0)}
            </div>
          )}

          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-zinc-950">
                {user.name}
              </h1>
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {user.provider} Verified Pass
              </span>
            </div>

            <p className="text-xs text-zinc-500">{user.email}</p>
            <p className="text-[11px] text-amber-800 font-semibold pt-1">
              Member ID: {user.id} · Priority 15-Minute Bag Hold Privilege Active
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="text-xs"
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* 2. Customer Portal Tabs */}
      <div className="border-b border-zinc-200 flex items-center gap-2 sm:gap-4 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('cart')}
          className={`flex items-center gap-2 pb-3 px-3 border-b-2 transition-all shrink-0 ${
            activeTab === 'cart'
              ? 'border-zinc-950 text-zinc-950 font-bold'
              : 'border-transparent text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Active Holds ({cart.length})</span>
          {secondsRemaining > 0 && cart.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`flex items-center gap-2 pb-3 px-3 border-b-2 transition-all shrink-0 ${
            activeTab === 'wishlist'
              ? 'border-zinc-950 text-zinc-950 font-bold'
              : 'border-transparent text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Watchlist ({wishlistIds.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 pb-3 px-3 border-b-2 transition-all shrink-0 ${
            activeTab === 'orders'
              ? 'border-zinc-950 text-zinc-950 font-bold'
              : 'border-transparent text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Order Manifests ({orderHistory.length})</span>
        </button>
      </div>

      {/* 3. Tab Content */}
      <div className="space-y-6">
        
        {/* TAB 1: ACTIVE CART & 15-MIN HOLDS */}
        {activeTab === 'cart' && (
          <div className="space-y-4">
            {cart.length === 0 ? (
              <div className="p-12 text-center bg-zinc-50 rounded-3xl border border-zinc-200 space-y-3">
                <ShoppingBag className="w-10 h-10 text-zinc-300 mx-auto" />
                <h3 className="font-heading font-bold text-base text-zinc-900">Your Bag is Empty</h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Explore our live Drop 08 archive to mine curated 1-of-1 pieces with 15-minute reservation locks.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/')}
                  className="mt-2"
                >
                  Browse Drop Racks
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Hold Timer Alert */}
                {secondsRemaining > 0 && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-amber-900 font-bold">
                      <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                      <span>
                        Exclusive Hold Expires in {Math.floor(secondsRemaining / 60)}m {secondsRemaining % 60}s
                      </span>
                    </div>
                    <span className="text-[10px] font-bold uppercase text-amber-800">
                      Auto-Restock Protection Active
                    </span>
                  </div>
                )}

                {/* Items List */}
                <div className="border border-zinc-200 rounded-3xl divide-y divide-zinc-200 overflow-hidden bg-white shadow-sm">
                  {cart.map(({ item }) => (
                    <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate(`/drops/${item.id}`)}>
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-16 h-20 object-cover rounded-xl bg-zinc-100 border border-zinc-200 shrink-0"
                        />
                        <div className="space-y-1">
                          <Badge variant="gold">1-of-1 Locked</Badge>
                          <h4 className="font-heading font-bold text-sm text-zinc-950 hover:text-amber-700 transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-xs text-zinc-500">
                            Tag: <strong>{item.tagSize}</strong> · {item.measurements.pitToPitInches}" P2P · {item.silhouette}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
                        <span className="font-bold text-base text-zinc-950 font-mono">
                          {formatPhp(item.pricePhp)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-zinc-400 hover:text-red-600 rounded-lg hover:bg-zinc-100 transition-colors"
                          title="Release Hold"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: WATCHLIST */}
        {activeTab === 'wishlist' && (
          <div className="space-y-4">
            {wishlistedItems.length === 0 ? (
              <div className="p-12 text-center bg-zinc-50 rounded-3xl border border-zinc-200 space-y-3">
                <Heart className="w-10 h-10 text-zinc-300 mx-auto" />
                <h3 className="font-heading font-bold text-base text-zinc-900">No Saved Pieces Yet</h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Click the heart icon on any curated drop piece to save it to your personal vault watchlist.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishlistedItems.map(item => (
                  <div key={item.id} className="bg-white border border-zinc-200 rounded-2xl p-4 flex gap-4 shadow-sm hover:shadow-md transition-shadow">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-20 h-24 object-cover rounded-xl bg-zinc-100 border border-zinc-200 shrink-0 cursor-pointer"
                      onClick={() => navigate(`/drops/${item.id}`)}
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] text-amber-700 font-bold uppercase">{item.brand}</span>
                        <h4
                          onClick={() => navigate(`/drops/${item.id}`)}
                          className="font-heading font-bold text-xs text-zinc-950 truncate cursor-pointer hover:text-amber-700"
                        >
                          {item.title}
                        </h4>
                        <span className="font-bold text-sm text-zinc-950 font-mono block mt-1">
                          {formatPhp(item.pricePhp)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => navigate(`/drops/${item.id}`)}
                          className="px-2.5 py-1 rounded-lg bg-zinc-950 text-white text-[11px] font-semibold"
                        >
                          Inspect
                        </button>
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="p-1 text-zinc-400 hover:text-red-500"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ORDER MANIFESTS & TRACKING */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orderHistory.map(order => (
              <div key={order.orderId} className="p-5 sm:p-6 bg-white rounded-3xl border border-zinc-200 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-200 gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-base text-zinc-950">
                        Order #{order.orderId}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {order.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-0.5">{order.date} · Paid via {order.paymentMethod}</p>
                  </div>

                  <button
                    onClick={() => navigate(`/orders/${order.orderId}`)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-semibold transition-colors"
                  >
                    <span>View Live Waybill Tracker</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="divide-y divide-zinc-100">
                  {order.items.map(item => (
                    <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-12 h-14 object-cover rounded-lg bg-zinc-100 border border-zinc-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-xs text-zinc-950">{item.title}</p>
                          <p className="text-[11px] text-zinc-500">
                            Tag {item.tagSize} · {item.measurements.pitToPitInches}" P2P
                          </p>
                        </div>
                      </div>

                      <span className="font-bold text-xs text-zinc-950 font-mono">
                        {formatPhp(item.pricePhp)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-zinc-200 flex justify-between items-center text-xs">
                  <span className="text-zinc-500">Waybill: <strong>{order.waybillNumber}</strong></span>
                  <span className="text-zinc-950 font-bold">Total: {formatPhp(order.totalAmountPhp)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
};
