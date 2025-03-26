const User = require('../models/Student');

class EditProfileService {
    async getProfile(userId) {
        return ( await User.findById(userId).select('-password -_id -__v'));
    }
    
    async updateProfile(userId, updateFields) {
        try {
          
          // Tạo đối tượng chứa các trường cần cập nhật
          const updateData = {};
    
          // Kiểm tra và thêm từng trường vào đối tượng updateData nếu có
          if (updateFields.name) updateData.name = updateFields.name;
          //if (updateFields.email) updateData.email = updateFields.email;
          if (updateFields.avatarUrl) updateData.avatar = updateFields.avatarUrl;
          if (updateFields.phone) updateData.phone = updateFields.phone;
          if (updateFields.facebook) updateData.facebook = updateFields.facebook;
          if (updateFields.gender) updateData.gender = updateFields.gender;
    
          // Nếu có mật khẩu cũ và mật khẩu mới, xử lý mật khẩu
          if (updateFields.currentPassword && updateFields.newPassword) {
            const user = await User.findById(userId);
    
            // Kiểm tra mật khẩu cũ
            const isMatch = await user.comparePassword(updateFields.currentPassword);
            if (!isMatch) {
              throw new Error('Current password is incorrect');
            }
    
            // Set the new password, pre-save hook will handle hashing
            user.password = updateFields.newPassword;
            await user.save();
            delete updateFields.currentPassword;
            delete updateFields.newPassword;
          }
    
          // Thực hiện cập nhật trong MongoDB
          const profile = await User.findByIdAndUpdate(userId, { $set: updateData }, { new: true }).select('-password -_id -__v');
    
          if (!profile) {
            throw new Error('User not found');
          }
    
          return profile;
        } catch (error) {
          console.error('Error updating profile:', error);
          throw new Error('Update failed');
        }
    }
    
}
module.exports = new EditProfileService();
