import * as XLSX from 'xlsx';

export const exportStoreDataToExcel = ({ orders = [], products = [], customers = [], stats = {} }) => {
  const wb = XLSX.utils.book_new();

  // 1. Dashboard Overview Sheet
  const overviewData = [
    ['KIRANA STORE PERFORMANCE REPORT', ''],
    ['Generated Date', new Date().toLocaleString()],
    ['', ''],
    ['Metric', 'Value'],
    ['Total Sales (₹)', stats.totalSales || 0],
    ['Total Orders', stats.totalOrders || 0],
    ['Total Customers', stats.totalCustomers || 0],
    ['Pending Orders', stats.pendingOrdersCount || 0],
    ['Accepted Orders', stats.acceptedOrdersCount || 0],
    ['Packed Orders', stats.packedOrdersCount || 0],
    ['Delivered Orders', stats.completedOrdersCount || 0],
    ['UPI Sales (₹)', stats.upiSales || 0],
    ['COD Sales (₹)', stats.codSales || 0],
  ];
  const wsOverview = XLSX.utils.aoa_to_sheet(overviewData);
  XLSX.utils.book_append_sheet(wb, wsOverview, 'Sales Summary');

  // 2. Orders Sheet
  const ordersData = orders.map((o) => {
    const total = o.totalPrice || 0;
    const paid = o.paidAmount !== undefined ? o.paidAmount : (o.paymentStatus === 'Paid' || o.paymentStatus === 'Collected' ? total : 0);
    const remaining = o.remainingBalance !== undefined ? o.remainingBalance : Math.max(0, total - paid);

    return {
      'Order ID': o.id,
      'Customer Name': o.customerName,
      'Phone Number': o.phone,
      'Location': o.location,
      'Total Items': o.items ? o.items.length : 0,
      'Items Detail': o.items ? o.items.map((i) => `${i.name} (${i.unit} x ${i.quantity})`).join(', ') : '',
      'Total Amount (₹)': total,
      'Paid Amount (₹)': paid,
      'Remaining Balance (₹)': remaining,
      'Payment Method': o.paymentMethod,
      'Payment Status': o.paymentStatus || (remaining <= 0 ? 'Paid' : paid > 0 ? 'Partial' : 'Pending'),
      'Order Status': o.orderStatus,
      'Order Date': new Date(o.createdAt).toLocaleString()
    };
  });
  const wsOrders = XLSX.utils.json_to_sheet(ordersData);
  XLSX.utils.book_append_sheet(wb, wsOrders, 'Orders');

  // 3. Products Sheet
  const productsData = products.map((p) => ({
    'Product ID': p.id,
    'Name': p.name,
    'Category': p.category,
    'Price (₹)': p.price,
    'MRP (₹)': p.originalPrice || p.price,
    'Unit': p.unit,
    'Stock Qty': p.quantity,
    'Rating': p.rating || 5.0,
    'Description': p.description
  }));
  const wsProducts = XLSX.utils.json_to_sheet(productsData);
  XLSX.utils.book_append_sheet(wb, wsProducts, 'Inventory Catalog');

  // 4. Customers Sheet
  const customersData = customers.map((c) => ({
    'Customer ID': c.id,
    'Customer Name': c.name,
    'Phone': c.phone,
    'Address / Location': c.location,
    'Total Orders': c.totalOrders || 0,
    'Total Spent (₹)': c.totalSpent || 0,
    'Joined Date': c.joinedDate || ''
  }));
  const wsCustomers = XLSX.utils.json_to_sheet(customersData);
  XLSX.utils.book_append_sheet(wb, wsCustomers, 'Customer Ledger');

  // Write and Save file
  const fileName = `Kirana_Store_Data_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
};
