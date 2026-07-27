import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_CUSTOMERS, INITIAL_CATEGORIES, INITIAL_REVIEWS } from '../data/mockData';
import { 
  COLLECTIONS, 
  seedInitialDataIfEmpty, 
  subscribeToCollection, 
  saveItemToFirestore, 
  deleteItemFromFirestore 
} from '../services/firebaseService';

const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  // Categories State
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('kirana_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  // Products State
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('kirana_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Orders State
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('kirana_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // Customers State
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('kirana_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  // Reviews State
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('kirana_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  // Shopping Cart State
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('kirana_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Dashboard Filters
  const [dashboardDayFilter, setDashboardDayFilter] = useState('all'); // 'all' | 'Monday' | 'Tuesday' etc.
  const [dashboardStartDate, setDashboardStartDate] = useState('');
  const [dashboardEndDate, setDashboardEndDate] = useState('');

  // Search & Category Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Initialize Firebase Data & Subscriptions
  useEffect(() => {
    // 1. Seed Firestore if collections are empty
    seedInitialDataIfEmpty();

    // 2. Real-time Firebase Firestore Sync
    const unsubCat = subscribeToCollection(COLLECTIONS.CATEGORIES, (data) => {
      if (data && data.length > 0) setCategories(data);
    });

    const unsubProd = subscribeToCollection(COLLECTIONS.PRODUCTS, (data) => {
      if (data && data.length > 0) setProducts(data);
    });

    const unsubOrd = subscribeToCollection(COLLECTIONS.ORDERS, (data) => {
      if (data && data.length > 0) setOrders(data);
    });

    const unsubCust = subscribeToCollection(COLLECTIONS.CUSTOMERS, (data) => {
      if (data && data.length > 0) setCustomers(data);
    });

    const unsubRev = subscribeToCollection(COLLECTIONS.REVIEWS, (data) => {
      if (data && data.length > 0) setReviews(data);
    });

    return () => {
      unsubCat();
      unsubProd();
      unsubOrd();
      unsubCust();
      unsubRev();
    };
  }, []);

  // Sync to LocalStorage as offline fallback
  useEffect(() => {
    localStorage.setItem('kirana_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('kirana_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('kirana_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('kirana_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('kirana_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('kirana_cart', JSON.stringify(cart));
  }, [cart]);

  // Category CRUD
  const addCategory = (name, icon = 'Store') => {
    const id = 'cat_' + name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const newCat = { id, name, icon, count: 0 };
    setCategories((prev) => [...prev, newCat]);
    saveItemToFirestore(COLLECTIONS.CATEGORIES, newCat);
    return newCat;
  };

  const editCategory = (id, newName) => {
    setCategories((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, name: newName } : c));
      const target = updated.find((c) => c.id === id);
      if (target) saveItemToFirestore(COLLECTIONS.CATEGORIES, target);
      return updated;
    });
  };

  const deleteCategory = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    deleteItemFromFirestore(COLLECTIONS.CATEGORIES, id);
  };

  // Product CRUD
  const addProduct = (newProd) => {
    const id = 'p_' + Date.now();
    const product = {
      id,
      rating: 5.0,
      reviewsCount: 1,
      featured: false,
      ...newProd
    };
    setProducts((prev) => [product, ...prev]);
    saveItemToFirestore(COLLECTIONS.PRODUCTS, product);
    return product;
  };

  const editProduct = (id, updatedFields) => {
    setProducts((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p));
      const target = updated.find((p) => p.id === id);
      if (target) saveItemToFirestore(COLLECTIONS.PRODUCTS, target);
      return updated;
    });
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    deleteItemFromFirestore(COLLECTIONS.PRODUCTS, id);
  };

  // Cart Operations
  const addToCart = (product, quantityToAdd = 1, selectedUnit = null, calculatedPrice = null) => {
    const finalUnit = selectedUnit && selectedUnit.trim() !== '' ? selectedUnit : product.unit;
    const finalPrice = calculatedPrice !== null ? calculatedPrice : product.price;
    const cartItemId = `${product.id}_${finalUnit.replace(/\s+/g, '')}`;

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === cartItemId || item.cartItemId === cartItemId);
      if (existing) {
        return prevCart.map((item) =>
          (item.id === cartItemId || item.cartItemId === cartItemId)
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      }
      return [
        ...prevCart,
        {
          id: cartItemId,
          cartItemId,
          productId: product.id,
          name: product.name,
          price: finalPrice,
          unit: finalUnit,
          baseUnit: product.unit,
          image: product.image,
          quantity: quantityToAdd
        }
      ];
    });
  };

  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId && item.cartItemId !== cartItemId));
  };

  const updateCartQty = (cartItemId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId || item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const cartTotalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Order Operations
  const placeOrder = (orderData) => {
    const orderId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
    const totalPrice = orderData.totalPrice;
    const isUpi = orderData.paymentMethod === 'UPI';
    const paidAmount = isUpi ? totalPrice : 0;
    const remainingBalance = isUpi ? 0 : totalPrice;
    const paymentStatus = isUpi ? 'Paid' : 'Pending';

    const newOrder = {
      id: orderId,
      customerId: orderData.customerId || 'c_' + Date.now(),
      customerName: orderData.customerName,
      phone: orderData.phone,
      location: orderData.location,
      items: orderData.items,
      totalPrice,
      paidAmount,
      remainingBalance,
      paymentMethod: orderData.paymentMethod, // 'UPI' or 'Cash on Delivery'
      paymentStatus,
      utrNumber: orderData.utrNumber || '',
      orderStatus: 'Pending', // Pending -> Accepted -> Packed -> Delivered -> Rejected
      createdAt: new Date().toISOString()
    };

    setOrders((prev) => [newOrder, ...prev]);
    saveItemToFirestore(COLLECTIONS.ORDERS, newOrder);

    // Stock deduction
    setProducts((prevProds) =>
      prevProds.map((prod) => {
        const itemInOrder = orderData.items.find((item) => item.id === prod.id);
        if (itemInOrder) {
          const updatedProd = {
            ...prod,
            quantity: Math.max(0, prod.quantity - itemInOrder.quantity)
          };
          saveItemToFirestore(COLLECTIONS.PRODUCTS, updatedProd);
          return updatedProd;
        }
        return prod;
      })
    );

    // Customer ledger update
    setCustomers((prevCusts) => {
      const existingCust = prevCusts.find((c) => c.phone === orderData.phone);
      if (existingCust) {
        const updatedCust = {
          ...existingCust,
          totalOrders: (existingCust.totalOrders || 0) + 1,
          totalSpent: (existingCust.totalSpent || 0) + totalPrice,
          location: orderData.location
        };
        saveItemToFirestore(COLLECTIONS.CUSTOMERS, updatedCust);
        return prevCusts.map((c) => (c.phone === orderData.phone ? updatedCust : c));
      } else {
        const newCust = {
          id: orderData.customerId || 'c_' + Date.now(),
          name: orderData.customerName,
          phone: orderData.phone,
          location: orderData.location,
          role: 'Customer',
          totalOrders: 1,
          totalSpent: totalPrice,
          joinedDate: new Date().toISOString().split('T')[0]
        };
        saveItemToFirestore(COLLECTIONS.CUSTOMERS, newCust);
        return [newCust, ...prevCusts];
      }
    });

    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          let updatedPaid = ord.paidAmount;
          let updatedRemaining = ord.remainingBalance;
          let updatedPaymentStatus = ord.paymentStatus;

          if (newStatus === 'Delivered' && ord.paymentMethod === 'Cash on Delivery') {
            updatedPaid = ord.totalPrice;
            updatedRemaining = 0;
            updatedPaymentStatus = 'Paid';
          }
          const updatedOrd = {
            ...ord,
            orderStatus: newStatus,
            paidAmount: updatedPaid,
            remainingBalance: updatedRemaining,
            paymentStatus: updatedPaymentStatus
          };
          saveItemToFirestore(COLLECTIONS.ORDERS, updatedOrd);
          return updatedOrd;
        }
        return ord;
      })
    );
  };

  // Edit Payment Values (Admin feature: Total = 2000, Paid = 100 -> Remaining = 1900)
  const updateOrderPayment = (orderId, newTotal, newPaid) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const total = Number(newTotal);
          const paid = Number(newPaid);
          const remaining = Math.max(0, total - paid);

          let status = 'Pending';
          if (remaining <= 0 && total > 0) {
            status = 'Paid';
          } else if (paid > 0 && remaining > 0) {
            status = 'Partial';
          }

          const updatedOrd = {
            ...ord,
            totalPrice: total,
            paidAmount: paid,
            remainingBalance: remaining,
            paymentStatus: status
          };
          saveItemToFirestore(COLLECTIONS.ORDERS, updatedOrd);
          return updatedOrd;
        }
        return ord;
      })
    );
  };

  const editOrder = (orderId, updatedFields) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updated = { ...ord, ...updatedFields };
          saveItemToFirestore(COLLECTIONS.ORDERS, updated);
          return updated;
        }
        return ord;
      })
    );
  };

  const deleteOrder = (orderId) => {
    setOrders((prev) => prev.filter((ord) => ord.id !== orderId));
    deleteItemFromFirestore(COLLECTIONS.ORDERS, orderId);
  };

  // Customer CRUD Operations
  const addCustomer = (customerData) => {
    const newCust = {
      id: 'c_' + Date.now(),
      role: 'Customer',
      totalOrders: 0,
      totalSpent: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      email: '',
      notes: '',
      ...customerData
    };
    setCustomers((prev) => [newCust, ...prev]);
    saveItemToFirestore(COLLECTIONS.CUSTOMERS, newCust);
    return newCust;
  };

  const editCustomer = (id, updatedFields) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updated = { ...c, ...updatedFields };
          saveItemToFirestore(COLLECTIONS.CUSTOMERS, updated);
          return updated;
        }
        return c;
      })
    );
  };

  const deleteCustomer = (id) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    deleteItemFromFirestore(COLLECTIONS.CUSTOMERS, id);
  };

  // Enriched Customers list with real-time dynamic order & payment stats
  const customersWithStats = useMemo(() => {
    return customers.map((cust) => {
      const custOrders = orders.filter(
        (o) => (o.customerId && o.customerId === cust.id) || (o.phone && o.phone === cust.phone)
      );

      if (custOrders.length === 0) {
        return {
          ...cust,
          email: cust.email || '',
          notes: cust.notes || '',
          totalOrders: cust.totalOrders || 0,
          completedOrders: 0,
          pendingOrders: 0,
          totalSpent: cust.totalSpent || 0,
          paidAmount: cust.totalSpent || 0,
          pendingBalance: 0,
          paymentLedgerStatus: 'Paid',
          customerOrders: []
        };
      }

      const completedOrders = custOrders.filter((o) => o.orderStatus === 'Delivered').length;
      const pendingOrders = custOrders.filter(
        (o) => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Rejected' && o.orderStatus !== 'Not Accepted'
      ).length;

      const totalSpent = custOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
      const paidAmount = custOrders.reduce((sum, o) => {
        if (o.paidAmount !== undefined) return sum + o.paidAmount;
        if (o.paymentStatus === 'Paid' || o.paymentStatus === 'Collected') return sum + o.totalPrice;
        return sum;
      }, 0);

      const pendingBalance = custOrders.reduce((sum, o) => {
        if (o.remainingBalance !== undefined) return sum + o.remainingBalance;
        const paid = o.paidAmount !== undefined ? o.paidAmount : (o.paymentStatus === 'Paid' ? o.totalPrice : 0);
        return sum + Math.max(0, (o.totalPrice || 0) - paid);
      }, 0);

      let ledgerStatus = 'Paid';
      if (pendingBalance > 0 && paidAmount > 0) {
        ledgerStatus = 'Partial';
      } else if (pendingBalance > 0 && paidAmount === 0) {
        ledgerStatus = 'Pending';
      }

      return {
        ...cust,
        email: cust.email || '',
        notes: cust.notes || '',
        totalOrders: Math.max(cust.totalOrders || 0, custOrders.length),
        completedOrders,
        pendingOrders,
        totalSpent: Math.max(cust.totalSpent || 0, totalSpent),
        paidAmount,
        pendingBalance,
        paymentLedgerStatus: ledgerStatus,
        customerOrders: custOrders
      };
    });
  }, [customers, orders]);

  // Review Operations
  const addReview = (newReview) => {
    const reviewObj = {
      id: 'rev_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      featured: false,
      ...newReview
    };
    setReviews((prev) => [reviewObj, ...prev]);
    saveItemToFirestore(COLLECTIONS.REVIEWS, reviewObj);
  };

  const deleteReview = (reviewId) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    deleteItemFromFirestore(COLLECTIONS.REVIEWS, reviewId);
  };

  const toggleFeatureReview = (reviewId) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          const updated = { ...r, featured: !r.featured };
          saveItemToFirestore(COLLECTIONS.REVIEWS, updated);
          return updated;
        }
        return r;
      })
    );
  };

  // Dashboard Stats Calculations (with Filter logic)
  const filteredOrdersForDashboard = useMemo(() => {
    return orders.filter((o) => {
      // Exclude rejected
      if (o.orderStatus === 'Not Accepted' || o.orderStatus === 'Rejected') return false;

      const orderDate = new Date(o.createdAt);

      // Day of week filter (Monday-wise)
      if (dashboardDayFilter !== 'all') {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = days[orderDate.getDay()];
        if (dayName !== dashboardDayFilter) return false;
      }

      // Date range filter
      if (dashboardStartDate) {
        const start = new Date(dashboardStartDate);
        start.setHours(0, 0, 0, 0);
        if (orderDate < start) return false;
      }

      if (dashboardEndDate) {
        const end = new Date(dashboardEndDate);
        end.setHours(23, 59, 59, 999);
        if (orderDate > end) return false;
      }

      return true;
    });
  }, [orders, dashboardDayFilter, dashboardStartDate, dashboardEndDate]);

  const stats = useMemo(() => {
    const validOrders = filteredOrdersForDashboard;

    const totalOrdersCount = validOrders.length;
    const totalSales = validOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const totalPaidCollected = validOrders.reduce((sum, o) => sum + (o.paidAmount !== undefined ? o.paidAmount : o.totalPrice), 0);
    const totalRemainingDue = validOrders.reduce((sum, o) => sum + (o.remainingBalance !== undefined ? o.remainingBalance : 0), 0);

    const pendingOrdersCount = orders.filter((o) => o.orderStatus === 'Pending').length;
    const acceptedOrdersCount = orders.filter((o) => o.orderStatus === 'Accepted').length;
    const packedOrdersCount = orders.filter((o) => o.orderStatus === 'Packed').length;
    const completedOrdersCount = orders.filter((o) => o.orderStatus === 'Delivered').length;

    const upiSales = validOrders
      .filter((o) => o.paymentMethod === 'UPI')
      .reduce((sum, o) => sum + o.totalPrice, 0);

    const codSales = validOrders
      .filter((o) => o.paymentMethod === 'Cash on Delivery')
      .reduce((sum, o) => sum + o.totalPrice, 0);

    return {
      totalOrders: totalOrdersCount,
      totalCustomers: customers.length,
      totalSales,
      totalPaidCollected,
      totalRemainingDue,
      pendingOrdersCount,
      acceptedOrdersCount,
      packedOrdersCount,
      completedOrdersCount,
      upiSales,
      codSales
    };
  }, [filteredOrdersForDashboard, orders, customers]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCategory === 'all' || p.category === selectedCategory;
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <StoreContext.Provider
      value={{
        categories,
        addCategory,
        editCategory,
        deleteCategory,
        products,
        filteredProducts,
        orders,
        customers: customersWithStats,
        rawCustomers: customers,
        addCustomer,
        editCustomer,
        deleteCustomer,
        reviews,
        addReview,
        deleteReview,
        toggleFeatureReview,
        cart,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        dashboardDayFilter,
        setDashboardDayFilter,
        dashboardStartDate,
        setDashboardStartDate,
        dashboardEndDate,
        setDashboardEndDate,
        addProduct,
        editProduct,
        deleteProduct,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        cartSubtotal,
        cartTotalItems,
        placeOrder,
        updateOrderStatus,
        updateOrderPayment,
        editOrder,
        deleteOrder,
        stats
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
