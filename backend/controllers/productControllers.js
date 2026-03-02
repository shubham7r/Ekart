import { Product } from "../models/productModel.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";

export const addProduct = async (req, res) => {
  try {
    const { productName, productDesc, productPrice, category, brand } =
      req.body;

    const userId = req.id;

    if (!productName || !productDesc || !productPrice || !category || !brand) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ================= IMAGE UPLOAD =================
    let productImg = [];

    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const fileUri = getDataUri(file);

        const uploadResult = await cloudinary.uploader.upload(fileUri, {
          folder: "mern_products",
        });

        productImg.push({
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
        });
      }
    }

    // ================= SAVE PRODUCT =================
    const product = await Product.create({
      userId,
      productName,
      productDesc,
      productPrice,
      category,
      brand,
      productImg,
    });

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error("ADD PRODUCT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllProduct = async (_, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No product available",
        products: [],
      });
    }

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("GET ALL PRODUCT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.id;

    // ===== Find product =====
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // ===== Authorization (owner only) =====
    if (product.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this product",
      });
    }

    // ===== Delete images from Cloudinary =====
    if (product.productImg && product.productImg.length > 0) {
      for (let img of product.productImg) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }
    }

    // ===== Delete product from DB =====
    await Product.findByIdAndDelete(productId);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.id;

    const { productName, productDesc, productPrice, category, brand } =
      req.body;

    // ===== Find product =====
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // ===== Authorization =====
    if (product.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this product",
      });
    }

    // ===== Update fields =====
    product.productName = productName || product.productName;
    product.productDesc = productDesc || product.productDesc;
    product.productPrice = productPrice || product.productPrice;
    product.category = category || product.category;
    product.brand = brand || product.brand;

    // ===== If new images uploaded =====
    if (req.files && req.files.length > 0) {
      // delete old images from cloudinary
      if (product.productImg && product.productImg.length > 0) {
        for (let img of product.productImg) {
          if (img.public_id) {
            await cloudinary.uploader.destroy(img.public_id);
          }
        }
      }

      // upload new images
      let newImages = [];

      for (let file of req.files) {
        const fileUri = getDataUri(file);

        const uploadResult = await cloudinary.uploader.upload(fileUri, {
          folder: "mern_products",
        });

        newImages.push({
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
        });
      }

      product.productImg = newImages;
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};