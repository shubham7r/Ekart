import { Product } from "../models/productModel.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";

// ================= ADD PRODUCT =================
export const addProduct = async (req, res) => {
  try {
    const { productName, productDesc, productPrice, category, brand } =
      req.body;

    const userId = req.id;

    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    // ✅ Validation
    if (
      !productName?.trim() ||
      !productDesc?.trim() ||
      !productPrice ||
      !category?.trim() ||
      !brand?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (isNaN(productPrice)) {
      return res.status(400).json({
        success: false,
        message: "Price must be a number",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one image",
      });
    }

    let productImg = [];

    // ================= IMAGE UPLOAD =================
    for (let file of req.files) {
      // 🔥 DEBUG (IMPORTANT)
      console.log("FILE:", file);
      console.log("BUFFER:", file.buffer);

      const fileUri = getDataUri(file);

      // ❌ If conversion fails
      if (!fileUri || !fileUri.content) {
        console.log("❌ fileUri:", fileUri);
        return res.status(500).json({
          success: false,
          message: "File conversion failed",
        });
      }

      // ✅ Upload to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(fileUri.content, {
        folder: "mern_products",
      });

      productImg.push({
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      });
    }

    // ================= SAVE PRODUCT =================
    const product = await Product.create({
      userId,
      productName,
      productDesc,
      productPrice: Number(productPrice),
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

// ================= GET ALL PRODUCTS =================
export const getAllProduct = async (_, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

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

// ================= DELETE PRODUCT =================
export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    // ✅ Delete images from cloudinary
    if (product.productImg?.length > 0) {
      for (let img of product.productImg) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }
    }

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

// ================= UPDATE PRODUCT =================
export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.id;

    const { productName, productDesc, productPrice, category, brand } =
      req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    // ✅ Update fields
    product.productName = productName || product.productName;
    product.productDesc = productDesc || product.productDesc;
    product.productPrice = productPrice || product.productPrice;
    product.category = category || product.category;
    product.brand = brand || product.brand;

    // ================= UPDATE IMAGES =================
    if (req.files && req.files.length > 0) {
      // delete old images
      if (product.productImg?.length > 0) {
        for (let img of product.productImg) {
          if (img.public_id) {
            await cloudinary.uploader.destroy(img.public_id);
          }
        }
      }

      let newImages = [];

      for (let file of req.files) {
        const fileUri = getDataUri(file);

        const uploadResult = await cloudinary.uploader.upload(fileUri.content, {
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
