// Utility for parsing unit strings, calculating proportional prices, and providing unit presets

export const parseQuantityUnit = (str) => {
  if (!str) return { amount: 1, type: 'pc', unitLabel: 'pc' };
  const normalized = String(str).trim().toLowerCase();

  // Match pattern like "10 kg", "500 gm", "250 g", "1.5 kg", "500 ml", "1 L"
  const match = normalized.match(/^([\d.]+)\s*([a-z]+)?$/);
  if (!match) return { amount: 1, type: 'pc', unitLabel: 'pc' };

  const val = parseFloat(match[1]) || 1;
  const unit = match[2] || 'pc';

  if (['kg', 'kilo', 'kilogram', 'kgs'].includes(unit)) {
    return { amount: val * 1000, type: 'weight', unitLabel: 'g' };
  }
  if (['g', 'gm', 'gms', 'gram', 'grams'].includes(unit)) {
    return { amount: val, type: 'weight', unitLabel: 'g' };
  }
  if (['l', 'ltr', 'liter', 'litre', 'litres', 'liters'].includes(unit)) {
    return { amount: val * 1000, type: 'volume', unitLabel: 'ml' };
  }
  if (['ml', 'mls', 'milliliter', 'millilitre'].includes(unit)) {
    return { amount: val, type: 'volume', unitLabel: 'ml' };
  }

  return { amount: val, type: 'pc', unitLabel: 'pc' };
};

export const calculateUnitPrice = (basePrice, baseUnitStr, targetUnitStr) => {
  if (!targetUnitStr || targetUnitStr.trim() === '' || targetUnitStr === baseUnitStr) {
    return basePrice;
  }

  const base = parseQuantityUnit(baseUnitStr);
  const target = parseQuantityUnit(targetUnitStr);

  if (base.type === target.type && base.amount > 0) {
    const pricePerBaseUnit = basePrice / base.amount;
    const calcPrice = Math.round(pricePerBaseUnit * target.amount);
    return Math.max(1, calcPrice);
  }

  if (target.amount > 0 && base.amount > 0) {
    return Math.max(1, Math.round((basePrice / base.amount) * target.amount));
  }

  return basePrice;
};

export const getUnitPresets = (baseUnitStr) => {
  const parsed = parseQuantityUnit(baseUnitStr);
  if (parsed.type === 'weight') {
    if (parsed.amount >= 10000) {
      return ['1 kg', '2 kg', '5 kg', '10 kg'];
    }
    if (parsed.amount <= 200) {
      return ['50 g', '100 g', '200 g', '500 g', '1 kg'];
    }
    return ['250 g', '500 g', '1 kg', '2 kg', '5 kg'];
  }
  if (parsed.type === 'volume') {
    if (parsed.amount <= 200) {
      return ['100 ml', '200 ml', '500 ml', '1 L'];
    }
    return ['250 ml', '500 ml', '1 L', '2 L'];
  }
  return ['1 pc', '2 pcs', '5 pcs', '10 pcs'];
};
