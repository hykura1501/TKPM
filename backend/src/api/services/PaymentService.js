
const { checkPaid } = require('../../api/helpers/checkPayment');
const Payment = require('../models/Payment');
const Cart = require('../models/Cart');
const Course = require('../models/Course');
const Student = require('../models/Student');


class PaymentService {

    // Lấy giao dịch theo ID
    async getPaymentById(paymentId) {
        try {
            const payment = await Payment.findById(paymentId)
            .populate({
                path: 'course',
                model: 'Course', // Liên kết với bảng Course
                select: 'name price description image rating teacher', // Chỉ lấy các trường cần thiết
                populate: { path: 'teacher', model: 'Teacher', select: 'name -_id' }
            }).select('-student'); 
            if (!payment) {
                throw new Error("Payment not found");
            }
            
            // Tạo thông tin QR Code dựa trên giao dịch
            const bankInfo = {
                id: process.env.BANK_ID,
                accountNo: process.env.ACCOUNT_NO,
                accountName: process.env.ACCOUNT_NAME,
                template: process.env.TEMPLATE,
            };

            var qrCode = `https://img.vietqr.io/image/${bankInfo.id}-${bankInfo.accountNo}-${bankInfo.template}.png?amount=${payment.amount}&addInfo=${encodeURIComponent(payment.description)}&accountName=${bankInfo.accountName}`;
            const result = {
                ...payment.toObject(),
                qrCode,
            };
    
            return result;
        } catch (error) {
            throw new Error(`Error retrieving payment by ID: ${error.message}`);
        }
    }

    // Tạo giao dịch mới
    async createPayment(itemIds, userId) {
        try {
            //Kiểm tra itemIds có tồn tại không
            const cart = await Cart.findOne({ courseIds: { $all: itemIds }, userId: userId })
            .populate({
                path: 'courseIds',
                model: 'Course', // Liên kết với bảng Course
                select: 'name price description image rating teacher', // Chỉ lấy các trường cần thiết
                populate: { path: 'teacher', model: 'Teacher', select: 'name' }
            })
            if (!cart) {
                throw new Error('Cart not found');
            }
            console.log(cart.courseIds);
            // Lọc các khóa học trong giỏ hàng theo itemIds
            const order = cart.courseIds.filter(course =>
                itemIds.includes(course._id.toString())
              );
            //Kiểm tra học sinh đã mua những khóa đó chưa
            const student = await Student.findById(userId);
            if (!student) {
                throw new Error('Student not found');
            }
            for (const course of order) {
                if (student.registeredCourses.includes(course._id)) {
                    throw new Error('Student already registered');
                }
            }  
            if (order.length !== itemIds.length) {
                throw new Error('Some items are not in the cart');
            }

            // Tính tổng số tiền
            const amount = order.reduce((total, course) => total + course.price, 0);


            const newPayment = new Payment({
                student: userId,
                amount: amount,
                method: "bank",
                course: itemIds,
                status: "pending",
            });

            await newPayment.save();

            return newPayment;
        } catch (error) {
            throw new Error(`Error creating payment: ${error.message}`);
        }
    }

    // Xử lý thanh toán
    async processPayment(paymentId) {
        try {
            const payment = await Payment.findById(paymentId);
            if (!payment) {
                throw new Error("Payment not found");
            }

            if (payment.status !== "pending") {
                throw new Error("Payment is not pending");
            }

            const timeout = 5 * 60 * 1000; // 5 phút
            const checkInterval = 10 * 1000; // Kiểm tra mỗi 10 giây
            let elapsed = 0;

            while (elapsed < timeout) {
                //const isPaid = await checkPaid(payment.amount, payment.description);
                const isPaid = await checkPaid(12050, "OrderID6764512e7b1005eda9688255");

                if (isPaid.success) {
                    payment.status = "completed";
                    await payment.save();
                    //Xóa ra khỏi giỏ hàng
                    const cart = await Cart.findOne({ userId: payment.student });
                    if (!cart) {
                        throw new Error("Cart not found");
                    }
                    cart.courseIds = cart.courseIds.filter(course => !payment.course.includes(course));
                    await cart.save();
                    
                    //Thêm học sinh vào khóa học
                    const courses = await Course.find({ _id: { $in: payment.course } });
                    if (!courses) {
                        throw new Error("Course not found");
                    }
                    for (const course of courses) {
                        if (course.students.includes(payment.student)) {
                            throw new Error("Student already registered");
                        }
                        course.students.push(payment.student);
                        await course.save();
                    }

                    //Bổ sung khóa học vào thông tin học viên
                    const studentId = payment.student.toString();
                    const student = await Student.findById(studentId);
                    if (!student) {
                        throw new Error("Student not found");
                    }
                    if (student.registeredCourses.includes(payment.course)) {
                        throw new Error("Course already registered");
                    }
                    student.registeredCourses.push(...payment.course);
                    await student.save();


                    return payment;
                }

                await new Promise(resolve => setTimeout(resolve, checkInterval));
                elapsed += checkInterval;
            }

            payment.status = "failed";
            await payment.save();
            throw new Error("Payment timeout exceeded");
        } catch (error) {
            throw new Error(`Error processing payment: ${error.message}`);
        }
    }
    // Hủy thanh toán
    async cancelPayment(paymentId) {
        try {
            const payment = await Payment.findById(paymentId);
            if (!payment) {
                throw new Error("Payment not found");
            }
            if (payment.status !== "pending") {
                throw new Error("Payment is not pending");
            }
            // Cancel payment logic here
            payment.status = "failed";
            await payment.save();
            return payment;
        } catch (error) {
            throw new Error(`Error cancelling payment: ${error.message}`);
        }
    }
    async getAllPayments() {
        try {
            return await Payment.find().sort({ createdAt: -1 });
        } catch (error) {
            throw new Error(`Error retrieving all payments: ${error.message}`);
        }
    }
}

module.exports = new PaymentService();