import Schedule from "../models/ScheduleModel.js";
import SubSchedule from "../models/SubSchedulelModel.js";
import Student from "../models/StudentModel.js";
import path from "path";

export const getSchedules = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search_query || "";
  const offset = limit * page;

  let response;
  let totalPage;
  let totalRows;

  try {
    if (req.role === "admin") {
      totalRows = await Student.count();
      totalPage = Math.ceil(totalRows / limit);
      response = await Schedule.findAll({
        offset: offset,
        limit: limit,
        include: {
          model: Student,
        },
      });
    } else {
      totalRows = await Student.count({
        where: {
          userId: req.userId,
        },
      });
      totalPage = Math.ceil(totalRows / limit);
      response = await Schedule.findAll({
        offset: offset,
        limit: limit,
        include: {
          model: Student,
          where: {
            userId: req.userId,
          },
        },
      });
    }
    res.status(200).json({
      message: "Berhasil",
      result: response,
      page: page,
      limit: limit,
      totalRows: totalRows,
      totalPage: totalPage,
    });
  } catch (error) {}
};

export const createSchedule = async (req, res) => {
  try {
    const { _class, studentId, subSchedulesData } = req.body;
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

export const getScheduleById = async (req, res) => {
  const { id } = req.params;

  try {
    // Menggunakan findOne karena Anda mencari satu jadwal dengan UUID tertentu
    const schedule = await Schedule.findOne({
      where: {
        uuid: id,
      },
      include: {
        model: Student,
      },
    });

    // Periksa apakah jadwal ditemukan sebelum melanjutkan
    if (!schedule) {
      return res.status(404).json({
        message: "Jadwal tidak ditemukan",
      });
    }

    console.log(schedule.id);

    const subSchedules = await SubSchedule.findAll({
      where: {
        scheduleId: schedule.id,
      },
    });

    res.status(200).json({
      message: "Berhasil",
      result: {
        schedule: schedule,
        subSchedules: subSchedules,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Terjadi kesalahan server",
    });
  }
};

export const getCountByClass = async (req, res) => {
  const { classType } = req.params;

  try {
    const total = await Schedule.count({
      where: {
        class: classType,
      },
    });
    console.log(total);
    res.status(200).json({ message: "Berhasil", result: total });
  } catch (error) {
    console.log(error);
  }
};

export const addImageToSubSchedule = async (req, res) => {
  const { id } = req.params;

  try {
    const subSchedule = await SubSchedule.findOne({
      where: {
        uuid: id,
      },
    });

    if (!subSchedule)
      res.status(400).json({ message: "Sub Schedule tidak ada" });

    const { files } = req;

    if (!files || !files.file) {
      return res
        .status(400)
        .json({ message: "Tidak ada gambar yang diupload" });
    }

    const { file } = files;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);

    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedTypes = [".png", ".jpg", ".jpeg"];
    const maxFileSize = 5000000;

    if (!allowedTypes.includes(ext.toLowerCase())) {
      return res.status(422).json({ message: "Format gambar tidak valid" });
    }

    if (fileSize > maxFileSize) {
      return res.status(422).json({ message: "Gambar harus kurang dari 5 MB" });
    }

    file.mv(`public/images/${fileName}`, async (err) => {
      if (err) {
        throw new Error(err.message);
      }

      await SubSchedule.update(
        {
          image: fileName,
          url,
        },
        {
          where: {
            id: subSchedule.id,
          },
        }
      );

      res.status(200).json({ message: "Berhasil" });
    });
  } catch (error) {
    console.log(error);
  }
};
