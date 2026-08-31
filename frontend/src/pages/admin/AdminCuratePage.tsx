import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productService } from '../../services/productService.ts';
import { Item, CategoryType } from '../../types/index.ts';
import { formatPhp } from '../../utils/index.ts';
import { PRMonogramLogo } from '../../components/common/PRMonogramLogo.tsx';
import {
  ArrowLeft,
  UploadCloud,
  Image as ImageIcon,
  Video,
  X,
  Coins,
  CheckCircle2,
  Ruler,
  Tag,
  Zap,
  Layers,
  Check,
  Plus,
  Minus,
  FileText,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { Button } from '../../components/common/Button.tsx';

export const AdminCuratePage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);

  // Mobile Tab Switcher: 'specs' | 'media'
  const [mobileTab, setMobileTab] = useState<'specs' | 'media'>('specs');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [bufferPhp, setBufferPhp] = useState<number>(5);
  const [hasCustomSizePricing, setHasCustomSizePricing] = useState<boolean>(false);
  const [sizePricing, setSizePricing] = useState<Record<string, number>>({
    S: 150,
    M: 150,
    L: 150,
    XL: 150,
    XXL: 150,
    OSFA: 150,
  });

  const [formData, setFormData] = useState({
    title: '',
    brand: 'P&R Thrift & Style Studio',
    category: 'boxy-tees' as CategoryType,
    pricePhp: 150,
    originalEstimatedPricePhp: 200,
    tagSize: 'XL',
    sizeInventory: {
      S: 0,
      M: 0,
      L: 0,
      XL: 1,
      XXL: 0,
      OSFA: 0,
    } as Record<string, number>,
    recommendedFit: 'Drop-Shoulder Boxy Large',
    silhouette: 'Drop-Shoulder Boxy',
    pitToPitInches: 25.5,
    lengthInches: 26.0,
    shoulderDropInches: 22.0,
    sleeveInches: 9.0,
    fabricGsm: 260,
    grade: 'Pristine Sample (10/10)',
    ratingValue: 9.8,
    defectsSummary: 'Clean garment condition, zero structural flaws. Eco-steam washed & sanitized.',
    images: [] as string[],
    videoUrl: '',
    description: 'Curated 1-of-1 streetwear drop piece with hand-measured boxy dimensions.',
  });

  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      productService.getById(id).then(item => {
        if (item) {
          const initialSizeInv: Record<string, number> = item.sizeInventory || {
            S: 0,
            M: 0,
            L: 0,
            XL: 0,
            XXL: 0,
            OSFA: 0,
            [item.tagSize || 'XL']: item.stockQuantity || 1,
          };

          if (item.sizePricing) {
            setSizePricing(item.sizePricing);
            setHasCustomSizePricing(Boolean(item.hasCustomSizePricing));
          }

          const isStandard = [
            'Boxy Tees',
            'Cropped Hoodies',
            'Parachute & Cargos',
            'Outerwear & Jackets',
            'Vintage Denim',
            'Accessories',
          ].includes(item.category);

          if (!isStandard) {
            setIsCustomCategory(true);
          }

          setFormData({
            title: item.title,
            brand: item.brand,
            category: item.category,
            pricePhp: item.pricePhp,
            originalEstimatedPricePhp: item.originalEstimatedPricePhp || 0,
            tagSize: item.tagSize,
            sizeInventory: initialSizeInv,
            recommendedFit: item.recommendedFit,
            silhouette: item.silhouette,
            pitToPitInches: item.measurements.pitToPitInches,
            lengthInches: item.measurements.lengthInches,
            shoulderDropInches: item.measurements.shoulderDropInches || 0,
            sleeveInches: item.measurements.sleeveInches || 0,
            fabricGsm: item.condition.fabricGsm || 260,
            grade: item.condition.grade,
            ratingValue: item.condition.ratingValue,
            defectsSummary: item.condition.defectsSummary,
            images: item.images || [],
            videoUrl: item.videoUrl || '',
            description: item.description,
          });
        }
        setIsLoading(false);
      });
    }
  }, [id]);

  // Keyboard shortcut: Ctrl+S / Cmd+S to submit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        const form = document.getElementById('curate-form') as HTMLFormElement;
        if (form) form.requestSubmit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const presetCategories = [
    'Boxy Tees',
    'Cropped Hoodies',
    'Parachute & Cargos',
    'Outerwear & Jackets',
    'Vintage Denim',
    'Accessories',
  ];

  const standardSizes = ['S', 'M', 'L', 'XL', 'XXL', 'OSFA'];

  const totalStockQuantity = Object.values(formData.sizeInventory).reduce((sum, qty) => sum + (Number(qty) || 0), 0);

  const basePrice = Number(formData.pricePhp) || 0;
  const retailPrice = Number(formData.originalEstimatedPricePhp) || 0;
  const buffer = Number(bufferPhp || 0);
  const effectiveQty = Math.max(1, totalStockQuantity);
  const activeSizes = Object.entries(formData.sizeInventory).filter(([_, q]) => q > 0);

  let minFinalPrice = basePrice + buffer;
  let maxFinalPrice = basePrice + buffer;
  let projectedGrossSales = (basePrice + buffer) * effectiveQty;

  if (hasCustomSizePricing && activeSizes.length > 0) {
    const pricesWithBuffer = activeSizes.map(([s]) => (Number(sizePricing[s]) || basePrice) + buffer);
    minFinalPrice = Math.min(...pricesWithBuffer);
    maxFinalPrice = Math.max(...pricesWithBuffer);
    projectedGrossSales = activeSizes.reduce((sum, [s, qty]) => {
      const p = (Number(sizePricing[s]) || basePrice) + buffer;
      return sum + (p * qty);
    }, 0);
  } else {
    minFinalPrice = basePrice + buffer;
    maxFinalPrice = basePrice + buffer;
    projectedGrossSales = (basePrice + buffer) * effectiveQty;
  }

  const finalDropPriceDisplay = minFinalPrice === maxFinalPrice 
    ? formatPhp(minFinalPrice) 
    : `${formatPhp(minFinalPrice)} – ${formatPhp(maxFinalPrice)}`;
  const totalRetailValue = retailPrice * effectiveQty;
  const totalShopperSavings = Math.max(0, totalRetailValue - projectedGrossSales);
  const totalBufferReserve = buffer * effectiveQty;

  const updateSizePrice = (sizeKey: string, newPrice: number) => {
    setSizePricing(prev => ({
      ...prev,
      [sizeKey]: Math.max(0, newPrice),
    }));
  };

  const updateSizeStock = (sizeKey: string, newQty: number) => {
    setFormData(prev => {
      let updated: Record<string, number> = { ...prev.sizeInventory };

      if (!hasCustomSizePricing) {
        // Single size mode: Base Price applies to only one size (1-of-1 piece)
        standardSizes.forEach(s => {
          updated[s] = s === sizeKey ? Math.max(0, newQty) : 0;
        });
      } else {
        // Multi-size custom pricing mode: multiple sizes can have independent stock & pricing
        updated[sizeKey] = Math.max(0, newQty);
      }
      
      const activeSizes = Object.entries(updated).filter(([_, q]) => q > 0).map(([s]) => s);
      const newTagSize = activeSizes.length > 0 ? activeSizes.join('/') : prev.tagSize;

      return {
        ...prev,
        sizeInventory: updated,
        tagSize: newTagSize,
      };
    });
  };

  // Image Upload Handler
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const newImg = reader.result;
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, newImg],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Video Upload Handler
  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setFormData(prev => ({
          ...prev,
          videoUrl: reader.result as string,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSetCoverPhoto = (index: number) => {
    if (index === 0) return;
    setFormData(prev => {
      const newImages = [...prev.images];
      const [chosen] = newImages.splice(index, 1);
      return {
        ...prev,
        images: [chosen, ...newImages],
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalImages =
      formData.images.length > 0
        ? formData.images
        : ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'];

    const effectiveTotalStock = Math.max(1, totalStockQuantity);
    const is1of1 = effectiveTotalStock === 1;

    const activeSizesList = Object.entries(formData.sizeInventory)
      .filter(([_, q]) => q > 0)
      .map(([s]) => s);
    
    const tagSizeDisplay = activeSizesList.length > 0 ? activeSizesList.join('/') : formData.tagSize || 'XL';

    const finalSizePricing: Record<string, number> = {};
    standardSizes.forEach(sz => {
      finalSizePricing[sz] = (Number(sizePricing[sz]) || basePrice) + buffer;
    });

    const piecePayload: Item = {
      id: id || `PR-${(formData.category || 'DROP').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4) || 'PIEC'}-${Math.floor(100 + Math.random() * 900)}`,
      title: formData.title || 'Untitled Streetwear Piece',
      brand: formData.brand || 'P&R Thrift & Style Studio',
      category: formData.category,
      pricePhp: minFinalPrice,
      originalEstimatedPricePhp: Number(formData.originalEstimatedPricePhp),
      tagSize: tagSizeDisplay,
      stockQuantity: effectiveTotalStock,
      sizeInventory: formData.sizeInventory,
      hasCustomSizePricing,
      sizePricing: hasCustomSizePricing ? finalSizePricing : undefined,
      minPricePhp: minFinalPrice,
      maxPricePhp: maxFinalPrice,
      isOneOfOne: is1of1,
      recommendedFit: formData.recommendedFit,
      silhouette: formData.silhouette,
      measurements: {
        pitToPitInches: Number(formData.pitToPitInches),
        lengthInches: Number(formData.lengthInches),
        shoulderDropInches: Number(formData.shoulderDropInches),
        sleeveInches: Number(formData.sleeveInches),
        bottomHemInches: Number(formData.pitToPitInches),
      },
      condition: {
        grade: formData.grade as any,
        ratingValue: Number(formData.ratingValue),
        fabricGsm: Number(formData.fabricGsm),
        defectsSummary: formData.defectsSummary,
        isSanitized: true,
        originCountry: 'Made in Japan',
      },
      images: finalImages,
      videoUrl: formData.videoUrl || undefined,
      isSoldOut: false,
      isReserved: false,
      dropNumber: 'DROP-08',
      tags: [formData.silhouette, `${formData.fabricGsm} GSM`],
      description: formData.description,
    };

    if (isEditing) {
      productService.update(piecePayload.id, piecePayload);
    } else {
      productService.create(piecePayload);
    }

    setIsSavedSuccess(true);
    setTimeout(() => {
      navigate('/admin');
    }, 600);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center font-mono text-zinc-500 text-xs bg-zinc-50">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
          <span>Loading blueprint...</span>
        </div>
      </div>
    );
  }

  const primaryImage = formData.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="h-screen max-h-screen flex flex-col overflow-hidden font-mono text-zinc-950 bg-zinc-100/70">
      
      {/* 1. 🧼 Decongested Top Header Bar */}
      <header className="shrink-0 h-14 bg-white border-b border-zinc-200 px-4 sm:px-6 flex items-center justify-between shadow-xs z-20">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="flex items-center gap-1.5 py-1 px-2 -ml-1 rounded-lg text-xs font-bold text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Racks</span>
          </button>
          
          <div className="h-4 w-px bg-zinc-200 hidden sm:block" />

          <div className="flex items-center gap-2.5">
            <PRMonogramLogo size="sm" showSubtitle={false} />
            <h1 className="font-heading text-sm font-bold text-zinc-950 tracking-tight">
              {isEditing ? 'Edit Piece' : 'New Drop'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <kbd className="hidden md:inline-block px-2 py-0.5 text-[10px] text-zinc-400 bg-zinc-100 border border-zinc-200 rounded">
            ⌘S to Publish
          </kbd>
        </div>
      </header>

      {/* 📱 2. Clean 50/50 Stepper Tabs (Mobile Only) */}
      <div className="lg:hidden shrink-0 bg-white border-b border-zinc-200 px-3 py-2 flex items-center gap-2 z-10">
        <button
          type="button"
          onClick={() => setMobileTab('specs')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all ${
            mobileTab === 'specs'
              ? 'bg-zinc-950 text-white shadow-xs'
              : 'bg-zinc-50 text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">1. Specs &amp; Stock</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileTab('media')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all ${
            mobileTab === 'media'
              ? 'bg-zinc-950 text-white shadow-xs'
              : 'bg-zinc-50 text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">2. Photos</span>
          {formData.images.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-orange-500 text-white text-[9px] flex items-center justify-center font-bold shrink-0">
              {formData.images.length}
            </span>
          )}
        </button>
      </div>

      {/* 3. Main Form Body with pb-28/pb-32 to protect against sticky dock */}
      <form
        id="curate-form"
        onSubmit={handleSubmit}
        className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 overflow-hidden"
      >
        
        {/* LEFT COLUMN: Specs & Stock (7 Cols Desktop, Tab on Mobile) */}
        <div className={`lg:col-span-7 h-full overflow-y-auto p-3.5 sm:p-5 space-y-4 pb-28 sm:pb-32 ${
          mobileTab === 'specs' ? 'block' : 'hidden lg:block'
        }`}>
          
          {/* Card 1: Piece Details */}
          <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <span className="text-xs font-bold text-zinc-950 flex items-center gap-2 font-heading">
                <Tag className="w-4 h-4 text-orange-600" />
                <span>Piece Details</span>
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">Step 1</span>
            </div>

            {/* Title Input */}
            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-700 mb-1">
                Piece Name / Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Heavyweight 260 GSM Drop-Shoulder Boxy Tee"
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-950 focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-medium"
              />
            </div>

            {/* 🏷️ Single Clean Category Selector (No Duplicate Stack) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono font-semibold text-zinc-700">
                  Category *
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomCategory(!isCustomCategory)}
                  className="text-[11px] font-mono text-orange-600 hover:text-orange-700 font-bold"
                >
                  {isCustomCategory ? '← Choose from Presets' : '+ Custom Category'}
                </button>
              </div>

              {isCustomCategory ? (
                <input
                  type="text"
                  required
                  autoFocus
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Enter custom category name..."
                  className="w-full px-3 py-2.5 rounded-xl bg-orange-50/40 border border-orange-300 text-xs text-zinc-950 font-bold focus:outline-none focus:border-orange-500"
                />
              ) : (
                <div className="w-full overflow-x-auto no-scrollbar py-0.5">
                  <div className="flex items-center gap-1.5 min-w-max">
                    {presetCategories.map(cat => {
                      const isSelected = formData.category.toLowerCase() === cat.toLowerCase();
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setFormData({ ...formData, category: cat })}
                          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all select-none ${
                            isSelected
                              ? 'bg-zinc-950 text-white shadow-xs font-bold ring-1 ring-orange-500/50'
                              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 border border-transparent'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Brand / Studio Line */}
            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-700 mb-1">
                Brand / Studio Line
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={e => setFormData({ ...formData, brand: e.target.value })}
                placeholder="P&R Thrift & Style Studio"
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-950 font-medium focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Card 2: Pricing & Revenue Yield Projection */}
          <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <span className="text-xs font-bold text-zinc-950 flex items-center gap-2 font-heading">
                <Coins className="w-4 h-4 text-orange-600" />
                <span>Pricing &amp; Revenue Projection</span>
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">Step 2</span>
            </div>

            {/* 3-Column Input Grid: Base Drop Price, Buffer Markup, Retail Value */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              {/* 1. Base Drop Price */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono font-medium text-zinc-600 whitespace-nowrap truncate">
                    Base Price (₱) *
                  </label>
                  {hasCustomSizePricing ? (
                    <span className="text-[9px] font-mono font-bold text-zinc-500 bg-zinc-100 px-1.5 py-0.2 rounded border border-zinc-200">
                      🔒 Multi-Size
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono font-bold text-orange-700 bg-orange-50 px-1.5 py-0.2 rounded border border-orange-200">
                      1-of-1 Size
                    </span>
                  )}
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-3 font-mono font-bold text-zinc-400 text-sm pointer-events-none select-none">
                    ₱
                  </span>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="150"
                    disabled={hasCustomSizePricing}
                    value={formData.pricePhp || ''}
                    onChange={e => setFormData({ ...formData, pricePhp: Number(e.target.value) })}
                    className={`w-full h-11 pl-7 pr-3.5 rounded-lg border font-mono text-base font-semibold transition-all ${
                      hasCustomSizePricing
                        ? 'bg-zinc-100/90 border-zinc-200 text-zinc-400 cursor-not-allowed select-none'
                        : 'bg-orange-50/40 border-orange-200 text-zinc-950 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30'
                    }`}
                    title={hasCustomSizePricing ? 'Locked because Custom Price per Size is active in Step 3' : 'Single Size 1-of-1 Price'}
                  />
                </div>
              </div>

              {/* 2. Editable Operational / Packaging Buffer */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono font-medium text-zinc-600 whitespace-nowrap truncate">
                    + Buffer / Markup (₱)
                  </label>
                  <span className="text-[9px] font-mono font-bold text-orange-700 bg-orange-50 px-1.5 py-0.2 rounded border border-orange-200">
                    Editable
                  </span>
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-3 font-mono font-bold text-zinc-400 text-sm pointer-events-none select-none">
                    +₱
                  </span>
                  <input
                    type="number"
                    min="0"
                    placeholder="5"
                    value={bufferPhp !== undefined ? bufferPhp : ''}
                    onChange={e => setBufferPhp(Number(e.target.value))}
                    className="w-full h-11 pl-9 pr-3.5 rounded-lg bg-amber-50/40 border border-amber-300 text-zinc-950 font-mono text-base font-semibold focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all"
                    title="Packaging, pouch, and transaction fee buffer"
                  />
                </div>
              </div>

              {/* 3. Retail Market Value (Unified SRP across all sizes) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono font-medium text-zinc-600 whitespace-nowrap truncate">
                    Retail Value (₱)
                  </label>
                  {hasCustomSizePricing ? (
                    <span className="text-[9px] font-mono font-bold text-orange-700 bg-orange-50 px-1.5 py-0.2 rounded border border-orange-200">
                      Unified SRP
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono font-bold text-zinc-600 bg-zinc-100 px-1.5 py-0.2 rounded border border-zinc-200">
                      1-of-1 Size
                    </span>
                  )}
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-3 font-mono font-bold text-zinc-400 text-sm pointer-events-none select-none">
                    ₱
                  </span>
                  <input
                    type="number"
                    min="0"
                    placeholder="200"
                    value={formData.originalEstimatedPricePhp || ''}
                    onChange={e => setFormData({ ...formData, originalEstimatedPricePhp: Number(e.target.value) })}
                    className="w-full h-11 pl-7 pr-3.5 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-950 font-mono text-base font-semibold focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-all"
                    title="Brand/Market estimated retail value applied across all sizes"
                  />
                </div>
              </div>
            </div>

            {/* 📊 Live Yield & Revenue Projection Summary Card (Matched with Admin Studio Theme) */}
            <div className="p-3 sm:p-3.5 bg-zinc-50/80 rounded-2xl border border-zinc-200 space-y-2.5 font-mono shadow-2xs">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200 text-xs">
                <span className="flex items-center gap-1.5 font-heading font-bold text-xs text-zinc-950">
                  <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                  <span>Real-Time Earnings &amp; Yield Forecast</span>
                </span>
                <span className="text-[10px] font-mono font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                  {hasCustomSizePricing ? `Multi-Size: ${effectiveQty} pcs` : `1-of-1 Size: ${formData.tagSize || 'XL'}`}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {/* 1. Final Drop Price */}
                <div className="p-2 sm:p-2.5 rounded-xl bg-white border border-zinc-200 shadow-2xs text-center">
                  <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-mono block">Final Drop Price</span>
                  <span className="text-sm sm:text-base font-bold font-mono text-zinc-950 block mt-0.5 truncate">
                    {finalDropPriceDisplay}
                  </span>
                  <span className="text-[9px] text-zinc-400 font-mono block truncate">
                    {hasCustomSizePricing ? 'Multi-Tier Sizes' : `Base + ₱${bufferPhp || 0} buffer`}
                  </span>
                </div>

                {/* 2. Projected Gross Sales */}
                <div className="p-2 sm:p-2.5 rounded-xl bg-white border border-zinc-200 shadow-2xs text-center">
                  <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-mono block">Gross Revenue</span>
                  <span className="text-sm sm:text-base font-bold font-mono text-emerald-600 block mt-0.5">
                    {formatPhp(projectedGrossSales)}
                  </span>
                  <span className="text-[9px] text-zinc-400 font-mono block truncate">{effectiveQty} pcs total</span>
                </div>

                {/* 3. Operational Buffer Reserve */}
                <div className="p-2 sm:p-2.5 rounded-xl bg-white border border-zinc-200 shadow-2xs text-center">
                  <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-mono block">Buffer Reserve</span>
                  <span className="text-sm sm:text-base font-bold font-mono text-orange-600 block mt-0.5">
                    {formatPhp(totalBufferReserve)}
                  </span>
                  <span className="text-[9px] text-zinc-400 font-mono block truncate">Pouch &amp; Gateway Fees</span>
                </div>

                {/* 4. Shopper Value / Savings */}
                <div className="p-2 sm:p-2.5 rounded-xl bg-white border border-zinc-200 shadow-2xs text-center">
                  <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-mono block">Buyer Savings</span>
                  <span className="text-sm sm:text-base font-bold font-mono text-amber-700 block mt-0.5">
                    {formatPhp(totalShopperSavings)}
                  </span>
                  <span className="text-[9px] text-zinc-400 font-mono block truncate">vs {formatPhp(totalRetailValue)} retail</span>
                </div>
              </div>
            </div>

          </div>

          {/* Card 3: Tailoring Blueprint & Size Inventory */}
          <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <span className="text-xs font-bold text-zinc-950 flex items-center gap-2 font-heading">
                <Ruler className="w-4 h-4 text-orange-600" />
                <span>Tailoring Blueprint &amp; Size Stocks</span>
              </span>

              {/* ⚡ Custom Price per Size Toggle */}
              <button
                type="button"
                onClick={() => setHasCustomSizePricing(!hasCustomSizePricing)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold flex items-center gap-1.5 transition-all shadow-2xs ${
                  hasCustomSizePricing
                    ? 'bg-orange-600 text-white border border-orange-600 ring-2 ring-orange-500/20'
                    : 'bg-white text-zinc-600 border border-zinc-200 hover:border-orange-300 hover:text-orange-600'
                }`}
                title="Toggle custom individual pricing per size"
              >
                <Coins className="w-3 h-3" />
                <span>{hasCustomSizePricing ? '⚡ Custom Price / Size ON' : '+ Custom Price per Size'}</span>
              </button>
            </div>

            {/* 📦 Size Inventory Grid with ZERO Clipped Text */}
            <div className="p-3 bg-zinc-50/80 rounded-2xl border border-zinc-200 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <div>
                  <label className="block text-xs font-mono font-bold text-zinc-950">
                    Available Stock per Size *
                  </label>
                  <p className="text-[10px] text-zinc-500 font-mono">
                    {hasCustomSizePricing ? 'Multi-size batch run: Adjust quantity & price per size' : 'Single size mode: Tap size to select 1-of-1 piece'}
                  </p>
                </div>

                <span className={`text-[11px] font-bold font-mono px-2.5 py-0.5 rounded-full border shadow-2xs ${
                  totalStockQuantity === 1
                    ? 'bg-orange-500 text-white border-orange-600'
                    : totalStockQuantity > 1
                    ? 'bg-orange-50 text-orange-800 border-orange-300'
                    : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                }`}>
                  {totalStockQuantity === 1
                    ? '1-of-1 Piece'
                    : totalStockQuantity > 1
                    ? `${totalStockQuantity} Total Pcs`
                    : '0 Selected'}
                </span>
              </div>

              {/* Presets (Horizontal Scroll on mobile) */}
              <div className="w-full overflow-x-auto no-scrollbar py-0.5">
                <div className="flex items-center gap-1.5 min-w-max">
                  <span className="text-[10px] text-zinc-400 font-mono mr-0.5">Quick:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        sizeInventory: { S: 1, M: 0, L: 0, XL: 0, XXL: 0, OSFA: 0 },
                        tagSize: 'S',
                      }));
                    }}
                    className="px-2 py-0.5 rounded-lg bg-white border border-zinc-200 hover:border-orange-400 hover:text-orange-600 text-[10px] font-mono font-medium transition-colors shadow-2xs"
                  >
                    1-of-1 (S)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        sizeInventory: { S: 0, M: 1, L: 0, XL: 0, XXL: 0, OSFA: 0 },
                        tagSize: 'M',
                      }));
                    }}
                    className="px-2 py-0.5 rounded-lg bg-white border border-zinc-200 hover:border-orange-400 hover:text-orange-600 text-[10px] font-mono font-medium transition-colors shadow-2xs"
                  >
                    1-of-1 (M)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        sizeInventory: { S: 0, M: 0, L: 1, XL: 0, XXL: 0, OSFA: 0 },
                        tagSize: 'L',
                      }));
                    }}
                    className="px-2 py-0.5 rounded-lg bg-white border border-zinc-200 hover:border-orange-400 hover:text-orange-600 text-[10px] font-mono font-medium transition-colors shadow-2xs"
                  >
                    1-of-1 (L)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        sizeInventory: { S: 0, M: 0, L: 0, XL: 1, XXL: 0, OSFA: 0 },
                        tagSize: 'XL',
                      }));
                    }}
                    className="px-2 py-0.5 rounded-lg bg-white border border-zinc-200 hover:border-orange-400 hover:text-orange-600 text-[10px] font-mono font-medium transition-colors shadow-2xs"
                  >
                    1-of-1 (XL)
                  </button>
                  {hasCustomSizePricing && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          sizeInventory: { S: 1, M: 2, L: 2, XL: 1, XXL: 0, OSFA: 0 },
                          tagSize: 'S/M/L/XL',
                        }));
                      }}
                      className="px-2.5 py-0.5 rounded-lg bg-orange-50 border border-orange-300 text-orange-800 text-[10px] font-mono font-bold transition-colors shadow-2xs"
                    >
                      Full Run (S-XL)
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        sizeInventory: { S: 0, M: 0, L: 0, XL: 0, XXL: 0, OSFA: 0 },
                        tagSize: '',
                      }));
                    }}
                    className="px-2 py-0.5 rounded-lg text-zinc-400 hover:text-red-600 text-[10px] font-mono transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Responsive 3x2 Grid on Desktop/Tablet, 2-Cols on Mobile */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5 pt-1">
                {standardSizes.map(sz => {
                  const qty = formData.sizeInventory[sz] || 0;
                  const hasStock = qty > 0;
                  const sizeBasePrice = sizePricing[sz] !== undefined ? sizePricing[sz] : (formData.pricePhp || 150);
                  const finalSizeWithBuffer = (Number(sizeBasePrice) || basePrice) + buffer;

                  return (
                    <div
                      key={sz}
                      className={`p-2 sm:p-2.5 rounded-xl border transition-all flex flex-col justify-center select-none shadow-2xs ${
                        hasStock
                          ? 'bg-orange-50/50 border-2 border-orange-500 ring-1 ring-orange-500/20 shadow-xs'
                          : 'bg-white border border-zinc-200 hover:border-zinc-300'
                      }`}
                    >
                      {/* Row 1: Header (Size Name + mini stock) & Stepper */}
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className={`text-xs sm:text-sm font-heading font-extrabold truncate ${
                            hasStock ? 'text-orange-600' : 'text-zinc-800'
                          }`}>
                            {sz}
                          </span>
                          <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-md font-semibold truncate ${
                            hasStock
                              ? 'bg-orange-100/90 text-orange-900'
                              : 'bg-zinc-100 text-zinc-400'
                          }`}>
                            {hasStock ? `${qty} pc${qty > 1 ? 's' : ''}` : '0'}
                          </span>
                        </div>

                        {/* Inline Micro Stepper */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => updateSizeStock(sz, Math.max(0, qty - 1))}
                            className={`h-6 w-6 sm:h-7 sm:w-7 rounded-lg flex items-center justify-center font-bold text-xs transition-all ${
                              qty > 0
                                ? 'bg-white hover:bg-orange-100 text-zinc-700 hover:text-orange-700 border border-zinc-200 active:scale-95 shadow-2xs'
                                : 'bg-zinc-50 text-zinc-300 border border-zinc-100 cursor-not-allowed'
                            }`}
                            disabled={qty === 0}
                            title="Decrease"
                          >
                            <Minus className="w-3 h-3" />
                          </button>

                          <span className={`text-xs sm:text-sm font-mono font-bold w-6 text-center select-none ${
                            hasStock ? 'text-zinc-950' : 'text-zinc-400'
                          }`}>
                            {qty}
                          </span>

                          <button
                            type="button"
                            onClick={() => updateSizeStock(sz, qty + 1)}
                            className="h-6 w-6 sm:h-7 sm:w-7 rounded-lg bg-zinc-950 hover:bg-orange-600 text-white flex items-center justify-center font-bold text-xs transition-all active:scale-95 shadow-2xs"
                            title="Increase"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Row 2: Compact Inline Custom Price Override (When Toggled ON) */}
                      {hasCustomSizePricing && (
                        <div className="mt-1.5 pt-1.5 border-t border-zinc-200/70 font-mono flex items-center justify-between gap-1 text-[10px]">
                          <span className="text-zinc-500 font-medium truncate">
                            Final: <strong className="text-orange-700">{formatPhp(finalSizeWithBuffer)}</strong>
                          </span>
                          <div className="relative flex items-center w-20 shrink-0">
                            <span className="absolute left-1.5 text-zinc-400 font-bold text-[9px] pointer-events-none">₱</span>
                            <input
                              type="number"
                              min="0"
                              value={sizeBasePrice}
                              onChange={e => updateSizePrice(sz, Number(e.target.value))}
                              placeholder={String(formData.pricePhp || 150)}
                              className="w-full h-6 pl-4 pr-1 text-right rounded-md bg-white border border-zinc-200 text-zinc-950 font-mono font-bold text-[10px] focus:outline-none focus:border-orange-500 shadow-2xs"
                              title="Base price for this size"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 📏 4. Clean 2x2 Measurements Grid */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-mono font-semibold text-orange-700 mb-1">
                  P2P Width (") *
                </label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={formData.pitToPitInches}
                  onChange={e => setFormData({ ...formData, pitToPitInches: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 rounded-xl bg-orange-50/60 border border-orange-300 text-xs text-zinc-950 font-bold focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-zinc-700 mb-1">
                  Length (") *
                </label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={formData.lengthInches}
                  onChange={e => setFormData({ ...formData, lengthInches: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-950 font-bold focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-zinc-700 mb-1">
                  Shoulder Drop (")
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.shoulderDropInches}
                  onChange={e => setFormData({ ...formData, shoulderDropInches: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-950 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-zinc-700 mb-1">
                  Fabric GSM
                </label>
                <input
                  type="number"
                  value={formData.fabricGsm}
                  onChange={e => setFormData({ ...formData, fabricGsm: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-950 font-bold focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Condition Notes */}
            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-700 mb-1">
                Transparency &amp; Condition Notes
              </label>
              <textarea
                rows={2}
                value={formData.defectsSummary}
                onChange={e => setFormData({ ...formData, defectsSummary: e.target.value })}
                className="w-full p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-950 leading-relaxed resize-none focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Media Upload & Live Storefront Preview (5 Cols Desktop, Tab 2 on Mobile) */}
        <div className={`lg:col-span-5 h-full overflow-y-auto p-3.5 sm:p-5 space-y-4 border-t lg:border-t-0 lg:border-l border-zinc-200 bg-white/70 pb-28 sm:pb-32 ${
          mobileTab === 'media' ? 'block' : 'hidden lg:block'
        }`}>
          
          {/* Photos Upload Dropzone */}
          <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <span className="text-xs font-bold text-zinc-950 flex items-center gap-2 font-heading">
                <ImageIcon className="w-4 h-4 text-orange-600" />
                <span>Garment Photos ({formData.images.length})</span>
              </span>
              <span className="text-[10px] text-zinc-400">Multi-Upload</span>
            </div>

            {/* Hidden Input */}
            <input
              type="file"
              ref={imageFileInputRef}
              onChange={handleImageFileUpload}
              accept="image/*"
              multiple
              className="hidden"
            />

            {/* Clickable Dropzone */}
            <div
              onClick={() => imageFileInputRef.current?.click()}
              className="border-2 border-dashed border-zinc-200 hover:border-orange-500 hover:bg-orange-50/20 rounded-2xl p-4 text-center cursor-pointer transition-all bg-zinc-50/50"
            >
              <UploadCloud className="w-6 h-6 mx-auto text-orange-600 mb-1" />
              <p className="font-bold text-xs text-zinc-950">Tap to Upload Photos</p>
              <p className="text-[10px] text-zinc-400 mt-0.5">Camera roll, files or flat lays</p>
            </div>

            {/* Photo Preview Strip */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 pt-1">
                {formData.images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`relative rounded-xl overflow-hidden border aspect-4/5 group bg-zinc-100 ${
                      idx === 0 ? 'ring-2 ring-orange-500 border-transparent' : 'border-zinc-200'
                    }`}
                  >
                    <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                    
                    {idx === 0 ? (
                      <span className="absolute bottom-0 inset-x-0 bg-orange-600 text-[8px] text-white text-center font-bold py-0.5 uppercase">
                        COVER
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetCoverPhoto(idx)}
                        className="absolute bottom-0 inset-x-0 bg-black/75 hover:bg-orange-600 text-[8px] text-white text-center font-bold py-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Set Cover
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-zinc-950/80 hover:bg-red-600 text-white rounded-md transition-colors"
                      title="Remove"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {/* Add More Button */}
                <button
                  type="button"
                  onClick={() => imageFileInputRef.current?.click()}
                  className="rounded-xl border-2 border-dashed border-zinc-200 hover:border-orange-400 hover:bg-orange-50/20 aspect-4/5 flex flex-col items-center justify-center text-zinc-400 hover:text-orange-600 transition-colors"
                >
                  <Plus className="w-5 h-5 mb-0.5" />
                  <span className="text-[10px] font-bold">+ Add</span>
                </button>
              </div>
            )}
          </div>

          {/* Optional Fit Video Clip */}
          <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <span className="text-xs font-bold text-zinc-950 flex items-center gap-2 font-heading">
                <Video className="w-4 h-4 text-orange-600" />
                <span>10s Drape Video Loop</span>
              </span>
              <span className="text-[10px] text-zinc-400">Optional</span>
            </div>

            <input
              type="file"
              ref={videoFileInputRef}
              onChange={handleVideoFileUpload}
              accept="video/*"
              className="hidden"
            />

            {!formData.videoUrl ? (
              <button
                type="button"
                onClick={() => videoFileInputRef.current?.click()}
                className="w-full py-2.5 px-3 rounded-xl border border-zinc-200 hover:border-orange-400 hover:bg-orange-50/20 text-xs text-zinc-600 font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Video className="w-4 h-4 text-orange-600" />
                <span>Upload Short Fit Clip</span>
              </button>
            ) : (
              <div className="relative rounded-xl overflow-hidden bg-black aspect-video max-h-32 mx-auto">
                <video src={formData.videoUrl} controls className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, videoUrl: '' }))}
                  className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  <span>Remove</span>
                </button>
              </div>
            )}
          </div>

          {/* 🖼️ 5. Constrained & Scaled Live Storefront Product Card Preview */}
          <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-bold text-zinc-950 flex items-center gap-2 font-heading">
                <Layers className="w-4 h-4 text-orange-600" />
                <span>Storefront Live Preview</span>
              </span>
              <span className="text-[10px] text-emerald-600 font-bold">Real-Time</span>
            </div>

            {/* Constrained Card: max-w-[200px] / max-h-[360px] */}
            <div className="w-48 sm:w-56 mx-auto rounded-2xl border border-zinc-200 overflow-hidden bg-white shadow-xs">
              <div className="aspect-4/5 max-h-[240px] sm:max-h-[280px] relative bg-zinc-100 overflow-hidden">
                <img
                  src={primaryImage}
                  alt="Live Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-[9px] shadow-xs">
                    {totalStockQuantity <= 1 ? '1-of-1' : `${totalStockQuantity} Pcs`}
                  </span>
                </div>
              </div>

              <div className="p-2.5 sm:p-3 space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-orange-600 font-bold uppercase truncate max-w-[100px]">
                    {formData.brand}
                  </span>
                  <span className="text-zinc-500 font-bold">
                    {Object.entries(formData.sizeInventory).filter(([_, q]) => q > 0).map(([s]) => s).join('/') || formData.tagSize}
                  </span>
                </div>

                <p className="font-heading font-bold text-xs text-zinc-950 truncate leading-tight">
                  {formData.title || 'Untitled Piece'}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-zinc-100">
                  <span className="font-bold text-xs text-zinc-950 font-mono">
                    {finalDropPriceDisplay}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-zinc-950 text-white text-[10px] font-bold font-mono flex items-center gap-1">
                    <ShoppingBag className="w-2.5 h-2.5 text-zinc-300" />
                    + Cart
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </form>

      {/* 3. Sticky Bottom Action Dock */}
      <footer className="shrink-0 h-16 bg-white border-t border-zinc-200 px-4 sm:px-6 flex items-center justify-between shadow-xs z-20">
        <button
          type="button"
          onClick={() => navigate('/admin')}
          className="px-4 py-2 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 transition-colors"
        >
          Cancel
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          {isSavedSuccess && (
            <span className="text-emerald-600 text-xs font-bold flex items-center gap-1 animate-in fade-in">
              <Check className="w-4 h-4" />
              <span className="hidden sm:inline">Published successfully!</span>
            </span>
          )}

          <Button
            type="submit"
            form="curate-form"
            variant="primary"
            size="md"
            className="px-5 sm:px-6 py-2 text-xs font-bold shadow-md shadow-orange-500/20 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isEditing ? 'Save Blueprint' : 'Publish Drop'}</span>
          </Button>
        </div>
      </footer>

    </div>
  );
};
