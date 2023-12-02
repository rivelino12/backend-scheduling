import Student from "../models/StudentModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";

export const getStudents = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search_query || "";
  const offset = limit * page;

  let response;
  let totalPage;
  let totalRows;

  let whereCondition = {
    name: {
      [Op.like]: "%" + search + "%",
    },
  };

  try {
    if (req.role === "admin") {
      totalRows = await Student.count({ where: { [Op.or]: [whereCondition] } });
      totalPage = Math.ceil(totalRows / limit);
      response = await Student.findAll({
        where: { [Op.or]: [whereCondition] },
        offset: offset,
        limit: limit,
        attributes: ["uuid", "name", "gender", "id"],
        include: [
          {
            model: User,
            attributes: ["name", "email", "id"],
          },
        ],
      });
    } else {
      totalRows = await Student.count({
        where: { [Op.or]: [whereCondition], userId: req.userId },
      });
      totalPage = Math.ceil(totalRows / limit);
      response = await Student.findAll({
        attributes: ["uuid", "name", "gender"],
        offset: offset,
        limit: limit,
        where: {
          [Op.or]: [whereCondition],
          userId: req.userId,
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    }
    res.status(200).json({
      result: response,
      page: page,
      limit: limit,
      totalRows: totalRows,
      totalPage: totalPage,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!student) return res.status(404).json({ msg: "Data tidak ditemukan" });
    let response;
    if (req.role === "admin") {
      response = await Student.findOne({
        attributes: ["uuid", "name", "gender", "id"],
        where: {
          id: student.id,
        },
        include: [
          {
            model: User,
            attributes: ["name", "email", "id"],
          },
        ],
      });
    } else {
      response = await Student.findOne({
        attributes: ["uuid", "name", "gender"],
        where: {
          [Op.and]: [{ id: student.id }, { userId: req.userId }],
        },
        include: [
          {
            model: User,
            attributes: ["name", "email", "id"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createStudent = async (req, res) => {
  const { name, gender, userId } = req.body;
  try {
    await Student.create({
      name: name,
      gender: gender,
      userId: userId,
    });
    res.status(201).json({ msg: "Student Created Successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!student) return res.status(404).json({ msg: "Murid tidak ditemukan" });
    const { name, gender, userId } = req.body;
    await Student.update(
      {
        name: name,
        gender: gender,
        userId: userId,
      },
      {
        where: {
          id: student.id,
        },
      }
    );
    res.status(200).json({ msg: "User Updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
};
