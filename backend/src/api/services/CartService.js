const Cart = require("../models/Cart");
const Course = require("../models/Course");

class CartService {
    async findCartByUserId(userId) {
        return await Cart.findOne({ userId }).populate({
        path: 'courseIds',
        model: 'Course', // Liên kết với bảng Course
        select: 'name price description image rating teacher', // Chỉ lấy các trường cần thiết
        populate: { path: 'teacher', model: 'Teacher', select: 'name' }
      })
      .lean();
    }

    async addItem(userId, courseIds) {
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, courseIds });
        } else {
            cart.courseIds = [...cart.courseIds, ...courseIds]; // Thêm vào cuối mảng items
        }
        return await cart.save();
    }

    async removeFromCart(userId, courseId) {
        try {
          // Tìm giỏ hàng theo userId
          let cart = await Cart.findOne({ userId });
          if (!cart) {
            throw new Error('Cart not found');
          }
      
          // Lọc bỏ courseId cần xóa
          cart.courseIds = cart.courseIds.filter(
            (id) => id.toString() !== courseId.toString()
          );
      
          // Lưu lại thay đổi
          await cart.save();
      
          console.log('Updated cart:', cart);
          return cart;
        } catch (error) {
          console.error('Error removing course from cart:', error);
          throw error;
        }
    }
}

module.exports = new CartService();
