import Task from "../models/task.js";
import User from "../models/user.js";

export const createTask = async (req, res) => {
  try {
    const userId = req.userId;

    const { title, description, stage, date, priority } = req.body;
    if (!title || !description || !stage || !date || !priority) {
      return res.status(400).json({
        status: false,
        message: "Please fill all fields",
      });
    }

    const task = await Task.create({
      userId,
      title,
      description,
      stage: stage.toLowerCase(),
      date,
      priority: priority.toLowerCase(),
    });

    res
      .status(200)
      .json({ status: true, task, message: "Task created successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const userId = req.userId;

    let tasks = await Task.find({ userId: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      tasks,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const updateStage = async (req, res) => {
  try {
    const { id } = req.params;
    const { stage } = req.body;
    const task = await Task.findById(id);
    task.stage = stage.toLowerCase();

    await task.save();

    res.status(200).json({
      status: true,
      task,
      message: "Task stage Changed successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, stage, date, priority } = req.body;
    if (!title || !description || !stage || !date || !priority) {
      return res.status(400).json({
        status: false,
        message: "Please fill all fields",
      });
    }

    const task = await Task.findById(id);

    task.title = title;
    task.description = description;
    task.priority = priority.toLowerCase();
    task.stage = stage.toLowerCase();
    task.date = date;

    await task.save();

    res
      .status(200)
      .json({ status: true, task, message: "Task duplicated successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    await Task.findByIdAndDelete(id);

    res.status(200).json({
      status: true,
      message: `Operation performed successfully.`,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const dashboardStatistics = async (req, res) => {
  try {
    const userId = req.userId;

    const allTasks = await Task.find({ userId: userId }).sort({
      createdAt: -1,
    });

    //   group task by stage and calculate counts
    const groupTasks = allTasks.reduce((result, task) => {
      const stage = task.stage;

      if (!result[stage]) {
        result[stage] = 1;
      } else {
        result[stage] += 1;
      }

      return result;
    }, {});

    // Group tasks by priority
    const chartData = Object.entries(
      allTasks.reduce((result, task) => {
        const { priority } = task;

        result[priority] = (result[priority] || 0) + 1;
        return result;
      }, {})
    ).map(([name, total]) => ({ name, total }));

    // calculate total tasks
    const totalTasks = allTasks?.length;
    const last10Task = allTasks?.slice(0, 10);

    const summary = {
      totalTasks,
      last10Task,
      tasks: groupTasks,
      chartData,
    };

    res.status(200).json({
      status: true,
      message: "Successfully",
      ...summary,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getTask = async (req, res) => {
  try {
    console.log("in task");
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        status: false,
        message: "Please provide task id",
      });
    }
    const task = await Task.findById(id);
    res.status(200).json({
      status: true,
      task,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};
