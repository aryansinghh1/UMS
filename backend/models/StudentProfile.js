const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true 
  },
  enrolledCourses: [{
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    enrolledAt: { type: Date, default: Date.now }
  }],
  grades: [{
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    grade: { type: String }, // e.g., 'A', 'B+'
    semester: { type: Number }
  }],
  attendance: [{
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    percentage: { type: Number, default: 0 }
  }],
  cgpa: { type: Number, default: 0.0 }
}, { timestamps: true });

module.exports = mongoose.model('StudentProfile', studentProfileSchema);