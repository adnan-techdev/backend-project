const Task = require("../models/Task");

// GET /api/tasks
const getTasks = async (req, res, next) => {
  try {
    const {
      completed,
      priority,
      search,
      sort = "-createdAt",
      page = 1,
      limit = 5,
    } = req.query;

    const filter = {
      user: req.user._id,
    };

    // Completion filter
    if (completed === "true") {
      filter.completed = true;
    }

    if (completed === "false") {
      filter.completed = false;
    }

    // Priority filter
    if (
      priority &&
      ["low", "medium", "high"].includes(priority)
    ) {
      filter.priority = priority;
    }

    // Search
    if (search) {
      filter.title = {
        $regex: search,
        $options: "i",
      };
    }

    // Sorting
    const allowedSortFields = [
      "createdAt",
      "title",
      "priority",
      "completed",
    ];

    let sortOption = {};

    let sortField = sort;
    let sortDirection = 1;

    if (sort.startsWith("-")) {
      sortField = sort.substring(1);
      sortDirection = -1;
    }

    if (allowedSortFields.includes(sortField)) {
      sortOption[sortField] = sortDirection;
    } else {
      sortOption.createdAt = -1;
    }

    // Pagination
    const pageNumber = Math.max(Number(page) || 1, 1);

    const limitNumber = Math.min(
      Math.max(Number(limit) || 5, 1),
      100
    );

    const skip = (pageNumber - 1) * limitNumber;

    // Count
    const totalTasks = await Task.countDocuments(filter);

    // Get tasks
    const tasks = await Task.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber);

    const totalPages = Math.ceil(
      totalTasks / limitNumber
    );

    res.status(200).json({
      success: true,

      count: tasks.length,

      pagination: {
        page: pageNumber,
        limit: limitNumber,
        totalTasks,
        totalPages,
        hasNextPage: pageNumber < totalPages,
        hasPreviousPage: pageNumber > 1,
      },

      filters: {
        completed:
          completed === "true"
            ? true
            : completed === "false"
            ? false
            : null,

        priority: priority || null,

        search: search || null,

        sort,
      },

      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};


// GET /api/tasks/:id
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};


// POST /api/tasks
const createTask = async (req, res, next) => {
  try {
    const {
      title,
      completed,
      priority,
    } = req.body;

    const task = await Task.create({
      title,
      completed,
      priority,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};


// PUT /api/tasks/:id
const updateTask = async (req, res, next) => {
  try {
    const {
      title,
      completed,
      priority,
    } = req.body;

    const updates = {};

    if (title !== undefined) {
      updates.title = title;
    }

    if (completed !== undefined) {
      updates.completed = completed;
    }

    if (priority !== undefined) {
      updates.priority = priority;
    }

    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};


// DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};


// GET /api/tasks/stats
const getStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const total = await Task.countDocuments({
      user: userId,
    });

    const completed = await Task.countDocuments({
      user: userId,
      completed: true,
    });

    const pending = await Task.countDocuments({
      user: userId,
      completed: false,
    });

    const highPriority = await Task.countDocuments({
      user: userId,
      priority: "high",
    });

    res.status(200).json({
      success: true,

      data: {
        total,
        completed,
        pending,
        highPriority,
      },
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getStats,
};