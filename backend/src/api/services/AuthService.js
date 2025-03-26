// AuthService.js
require('dotenv').config();
const jwt = require('jsonwebtoken');
const redisClient = require('../../configs/redisClient')
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const mjml = require('mjml');
const fs = require('fs');
const path = require('path');
const sgMail = require('@sendgrid/mail');


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class AuthService {
  
  async register(username, password, role, name, email, phone) {
    // Kiểm tra tên đăng nhập hoặc email đã tồn tại
    const existingStudent = await Student.findOne({ $or: [{ username }, { email }] });
    const existingTeacher = await Teacher.findOne({ $or: [{ username }, { email }] });
    if (existingStudent || existingTeacher) {
      throw new Error('Tên đăng nhập đã tồn tại');
    }

    // Kiểm tra role hợp lệ
    const validRoles = ['student', 'teacher'];
    if (!validRoles.includes(role)) {
      throw new Error('Vai trò không hợp lệ');
    }
    var user;
    if (role === 'student') {
      const student = new Student({ username, password, role, name, email, phone });
      await student.save();
      user = student;
    } else {
      const teacher = new Teacher({ username, password, role, name, email, phone });
      await teacher.save();
      user = teacher;
    }
    

    const accessToken = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    await redisClient.set(user._id.toString(), refreshToken, 'EX', 7 * 24 * 60 * 60);

    return { accessToken, refreshToken, role: user.role };
  }

  async login(username, password) {
    const student = await Student.findOne({ username });
    const teacher = await Teacher.findOne({ username });
    if (!student && !teacher) {
      throw new Error('Sai tên đăng nhập');
    }
    var user = student || teacher;
    try {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new Error('Sai mật khẩu');
      }
    }
    catch (err) {
      throw new Error('Lỗi máy chủ');
    }
    const accessToken = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    await redisClient.set(user._id.toString(), refreshToken, 'EX', 7 * 24 * 60 * 60);

    return { accessToken, refreshToken, role: user.role, name: user.name };
  }
  
  async requestRefreshToken(refreshToken) {
    if (!refreshToken) throw new Error("You're not authenticated");
  
    try {
      // Giải mã refreshToken để lấy userId
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const userId = decoded.userId;
  
      // Kiểm tra refreshToken trong Redis
      const storedToken = await redisClient.get(userId.toString());
      if (!storedToken || storedToken !== refreshToken) {
        throw new Error("Refresh token is not valid");
      }
  
      // Tạo mới access token và refresh token
      const newAccessToken = jwt.sign({ userId, role: decoded.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
      const newRefreshToken = jwt.sign({ userId, role: decoded.role }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  
      // Cập nhật refresh token mới vào Redis
      await redisClient.set(userId.toString(), newRefreshToken, 'EX', 7 * 24 * 60 * 60);
  
      return { newAccessToken, newRefreshToken, role: decoded.role };
    } catch (err) {
      console.error("Error refreshing token:", err);
      throw new Error("Refresh token is not valid or expired");
    }
  }
  async logout(refreshToken) {
    if (!refreshToken) throw new Error("You're not authenticated");
  
    try {
      // Giải mã refreshToken để lấy userId
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const userId = decoded.userId;
  
      // Xóa refreshToken khỏi Redis
      await redisClient.del(userId.toString());
      console.log(`Logout successful for user: ${userId}`);
    } catch (err) {
      console.error("Error during logout:", err);
      throw new Error("Invalid or expired refresh token");
    }
  }
  async sendVerificationCodeWithSendGrid(email) {
    const user = await this.findUserByEmail(email);
    if (!user) {
        throw new Error('User not found');
    }

    // Generate a 6-digit verification code
    const cryptoRandomString = (await import('crypto-random-string')).default;
    const verificationCode = cryptoRandomString({ length: 6, type: 'numeric' });

    //Lưu vào redis
    await redisClient.set(user._id.toString()+'verifyCode', verificationCode, 'EX', 5 * 60);


    // Read and compile MJML template
    const mjmlTemplate = fs.readFileSync(path.resolve(__dirname, './emails/verification-code.mjml'), 'utf8');
    const { html } = mjml(mjmlTemplate, {
        filePath: path.resolve(__dirname,'./emails')
    });

    const msg = {
        to: user.email,
        from: `Vincent <${process.env.SENDGRID_EMAIL}>`, // Use the email address or domain you verified with SendGrid
        subject: 'Verification Code',
        html: html.replace('{{username}}', user.username).replace('{{verificationCode}}', verificationCode)
    };

    try {
        await sgMail.send(msg);
        console.log(`Verification code sent to ${user.email}`);
    } catch (error) {
        console.error(`Failed to send verification code to ${user.email}:`, error);
    }
  }
  async findUserByEmail(email) {
    const student = await Student
      .findOne({ email });
    if (student) {
      return student;
    }
    const teacher = await Teacher
      .findOne({ email })
      .select('_id username email');
    if (teacher) {
      return teacher;
    }
  }
  async findUserById(userId) {
    const student = await Student
      .findById(userId);
    if (student) {
      return student;
    }
    const teacher = await Teacher
      .findById(userId);
    if (teacher) {
      return teacher;
    }
  }

  async verifyCode( email, verificationCode) {
      const user = await this.findUserByEmail(email);
      if (!user) {
          throw new Error('User not found');
      }
      const storedCode = await redisClient.get(user._id.toString()+'verifyCode');
      if (verificationCode !== storedCode) {
          throw new Error('Invalid verification code');
      }
      
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return token;
  }

  async resetPassword(token, newPassword) {
      try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const user = await this.findUserById(decoded.userId);
          if (!user) {
              throw new Error('User not found');
          }
          user.password = newPassword;
          await user.save();
          return user;
      } catch (error) {
          throw new Error('Invalid or expired token');
      }
  }

}

module.exports = new AuthService();