// backend/controllers/productController.js
import Product from "../models/ProductModel.js";

/**
 * =========================================================
 *  PUBLIC — GET ALL PRODUCTS
 * =========================================================
 */
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.json({ success: true, products });
  } catch (error) {
    console.error("❌ Get Products Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * =========================================================
 *  ADMIN — GET ALL PRODUCTS
 * =========================================================
 */
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.json({ success: true, products });
  } catch (error) {
    console.error("❌ Admin Get All Products Error:", error);
    return res.status(500).json({ success: false, message: "Error fetching products" });
  }
};

/**
 * =========================================================
 *  ADMIN — ADD PRODUCT (FULLY FIXED ✔)
 * =========================================================
 */
export const addProduct = async (req, res) => {
  try {
    const {
      title,
      price,
      unit,
      image,
      category,
      description = "",
      brand = "",
      stock = 0,
      weight = "",
    } = req.body;

    // BASIC SAFE CHECK (no crashing)
    if (!title || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, price, and category are required.",
      });
    }

    const newProduct = new Product({
      title,
      price,
      unit: unit || "",
      image: image || "",
      category,
      description,
      brand,
      stock,
      weight,
    });

    const saved = await newProduct.save();

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: saved,
    });
  } catch (error) {
    console.error("❌ Add Product Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error adding product",
      error: error.message,
    });
  }
};

/**
 * =========================================================
 *  ADMIN — UPDATE PRODUCT
 * =========================================================
 */
export const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      message: "Product updated successfully",
      product: updated,
    });
  } catch (error) {
    console.error("❌ Update Product Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error.message,
    });
  }
};

/**
 * =========================================================
 *  ADMIN — DELETE PRODUCT
 * =========================================================
 */
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete Product Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message,
    });
  }
};
