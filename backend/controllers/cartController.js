import Cart from "../models/cartModel.js";
import { Product } from "../models/productModel.js";

// 📦 Get Cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: [],
      });
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.log("GET CART ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 🛒 Add to Cart
export const addToCart = async (req, res) => {
  try {
    // 🔥 DEBUG START
    console.log("USER:", req.user);
    console.log("BODY:", req.body);
    // 🔥 DEBUG END

    const userId = req.user._id;
    const { productId } = req.body;

    console.log("PRODUCT ID:", productId);

    // 🔍 Check product exists
    const product = await Product.findById(productId);
    console.log("PRODUCT:", product);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [
          {
            productId,
            quantity: 1,
            price: product.productPrice,
          },
        ],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId,
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += 1;
      } else {
        cart.items.push({
          productId,
          quantity: 1,
          price: product.productPrice,
        });
      }
    }

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate(
      "items.productId",
    );

    res.status(200).json({
      success: true,
      message: "Item added to cart",
      cart: updatedCart,
    });
  } catch (error) {
    console.log("ADD TO CART ERROR:", error); // 🔥 VERY IMPORTANT
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 🔄 Update Quantity
export const updateQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, type } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId,
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    if (type === "increase") item.quantity += 1;
    if (type === "decrease" && item.quantity > 1) item.quantity -= 1;

    await cart.save();

    cart = await cart.populate("items.productId");

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.log("UPDATE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ❌ Remove from Cart
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    let cart = await Cart.findOne({ userId });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId,
    );

    await cart.save();

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.log("REMOVE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 🧹 Clear Cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    let cart = await Cart.findOne({ userId });

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.log("CLEAR ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
