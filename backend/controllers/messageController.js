const Message = require('../models/Message');
const Course = require('../models/Course');

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { receiverId, courseId, content } = req.body;
    const senderId = req.user._id;

    if (!receiverId || !courseId || !content) {
      return res.status(400).json({ message: 'receiverId, courseId, and content are required' });
    }

    // Verify the course exists and both users are part of it
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const isSenderFaculty = course.faculty?.toString() === senderId.toString();
    const isSenderStudent = course.enrolledStudents.some(
      (s) => s.toString() === senderId.toString()
    );

    if (!isSenderFaculty && !isSenderStudent) {
      return res.status(403).json({ message: 'You are not part of this course' });
    }

    const isReceiverFaculty = course.faculty?.toString() === receiverId.toString();
    const isReceiverStudent = course.enrolledStudents.some(
      (s) => s.toString() === receiverId.toString()
    );

    if (!isReceiverFaculty && !isReceiverStudent) {
      return res.status(403).json({ message: 'Receiver is not part of this course' });
    }

    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      course: courseId,
      content,
    });

    const populated = await message.populate([
      { path: 'sender', select: 'name role' },
      { path: 'receiver', select: 'name role' },
    ]);

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get conversations list for the logged-in user
const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all messages where the user is sender or receiver
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .sort({ createdAt: -1 })
      .populate('sender', 'name role')
      .populate('receiver', 'name role')
      .populate('course', 'title courseCode');

    // Group by course + other person
    const conversationMap = new Map();

    for (const msg of messages) {
      const otherUser =
        msg.sender._id.toString() === userId.toString() ? msg.receiver : msg.sender;
      const key = `${msg.course._id}_${otherUser._id}`;

      if (!conversationMap.has(key)) {
        // Count unread messages in this conversation
        const unreadCount = await Message.countDocuments({
          sender: otherUser._id,
          receiver: userId,
          course: msg.course._id,
          isRead: false,
        });

        conversationMap.set(key, {
          otherUser: { _id: otherUser._id, name: otherUser.name, role: otherUser.role },
          course: { _id: msg.course._id, title: msg.course.title, courseCode: msg.course.courseCode },
          lastMessage: { content: msg.content, createdAt: msg.createdAt, senderId: msg.sender._id },
          unreadCount,
        });
      }
    }

    res.json(Array.from(conversationMap.values()));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get messages between logged-in user and another user for a course
const getMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId, userId: otherUserId } = req.params;

    const messages = await Message.find({
      course: courseId,
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'name role')
      .populate('receiver', 'name role');

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark all messages in a conversation as read
const markAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId, userId: otherUserId } = req.params;

    await Message.updateMany(
      {
        sender: otherUserId,
        receiver: userId,
        course: courseId,
        isRead: false,
      },
      { isRead: true }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get people the user can message (faculty/students in their courses)
const getContacts = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    let courses;
    if (userRole === 'faculty') {
      courses = await Course.find({ faculty: userId }).populate('enrolledStudents', 'name email role');
    } else {
      courses = await Course.find({ enrolledStudents: userId }).populate('faculty', 'name email role');
    }

    const contacts = courses.map((course) => ({
      course: { _id: course._id, title: course.title, courseCode: course.courseCode },
      people:
        userRole === 'faculty'
          ? course.enrolledStudents.map((s) => ({ _id: s._id, name: s.name, role: s.role }))
          : course.faculty
            ? [{ _id: course.faculty._id, name: course.faculty.name, role: course.faculty.role }]
            : [],
    }));

    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send announcement to all enrolled students in a course (faculty only)
const sendAnnouncement = async (req, res) => {
  try {
    const { courseId, content } = req.body;
    const senderId = req.user._id;

    if (!courseId || !content) {
      return res.status(400).json({ message: 'courseId and content are required' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Only the faculty of this course can send announcements
    if (course.faculty?.toString() !== senderId.toString()) {
      return res.status(403).json({ message: 'Only the course faculty can send announcements' });
    }

    if (course.enrolledStudents.length === 0) {
      return res.status(400).json({ message: 'No students enrolled in this course' });
    }

    // Create one message per enrolled student
    const messageDocs = course.enrolledStudents.map((studentId) => ({
      sender: senderId,
      receiver: studentId,
      course: courseId,
      content,
      isAnnouncement: true,
    }));

    const created = await Message.insertMany(messageDocs);

    res.status(201).json({
      message: `Announcement sent to ${created.length} students`,
      count: created.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendMessage, getConversations, getMessages, markAsRead, getContacts, sendAnnouncement };
