let products = require('./../data/mockData').products;

// GET all products
const getAllProducts = (req, res) => {
  res.json(products);
};

// GET product by ID
const getProductById = (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  product ? res.json(product) : res.status(404).json({ message: 'Product not found' });
};

// POST new product
const createProduct = (req, res) => {
  const { name, price, thumbnail } = req.body;
  const newProduct = {
    id: products.length ? products.length + 1 : 1, // Auto-increment ID
    name,
    price,
    thumbnail,
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
};

// PUT update product
const updateProduct = (req, res) => {
  const id = parseInt(req.params.id);
  const { name, price, thumbnail } = req.body;
  const index = products.findIndex(p => p.id === id); // index : -1
  if (index !== -1) {
    products[index] = { id, name, price, thumbnail };
    res.json(products[index]);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

// DELETE product
const deleteProduct = (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id); // index: 0
  if (index !== -1) {
    const deleted = products.splice(index, 1); // 0 cut 1 element
    res.json(deleted[0]);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
