import Schedule from "../models/ScheduleModel.js";
import SubSchedule from "../models/SubSchedulelModel.js";

export const getSchedules = async (req, res) => {};

export const createSchedule = async (req, res) => {
  try {
    const { _class, studentId, subSchedulesData } = req.body;
    console.log(_class);
    console.log(studentId);
    console.log(subSchedulesData);
    const newSchedule = await Schedule.create({
      class: _class,
      studentId: studentId,
    });

    const subSchedules = await Promise.all(
      subSchedulesData.map(async (subSchedule) => {
        return SubSchedule.create({
          meeting: subSchedule.meeting,
          material: subSchedule.material,
          date: subSchedule.date,
          startTime: subSchedule.startTime,
          endTime: subSchedule.endTime,
          scheduleId: newSchedule.id,
        });
      })
    );

    res
      .status(201)
      .json({ message: "Successfully created schedule", result: newSchedule });
  } catch (error) {
    console.error("Error creating schedule:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
