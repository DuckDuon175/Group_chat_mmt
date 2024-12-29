"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("users", [
      {
        id: "ae4f7c10-5e36-4f9d-a02b-0a76f4d612e3",
        email: 'dung123@gmail.com',
        password:
          '$2b$10$O5wyQhDf48tIetzTHvPFJu9Ug1aZ/TUnaNcCRaZHbdbEv1UPLZfT2',
        username: "Cồ Huy Dũng",
        gender: 1,
        birth: 1053190800,
        phone_number: "0774565665",
        information: "Bác sĩ",
        createdAt: "2024-10-09T16:51:43.000",
        updatedAt: "2024-10-09T16:51:43.000",
      },
      {
        id: "de5824b0-781b-4ad5-943b-604714fd9113",
        email: 'nguyenduong1705@gmail.com',
        password:
          '$2b$10$O5wyQhDf48tIetzTHvPFJu9Ug1aZ/TUnaNcCRaZHbdbEv1UPLZfT2',
        username: "Nguyễn Đức Dương",
        gender: 2,
        birth: 1053104400,
        phone_number: "0914875443",
        information: "Kĩ sư",
        createdAt: "2024-10-09T17:33:25.000",
        updatedAt: "2024-10-09T17:33:25.000",
      },
      {
        id: "9dc38d89-55d1-4d41-8bfb-c885bc6ff0be",
        email: 'trantuan7541@gmail.com',
        password:
          '$2b$10$O5wyQhDf48tIetzTHvPFJu9Ug1aZ/TUnaNcCRaZHbdbEv1UPLZfT2',
        username: "Trần Minh Tuấn",
        gender: 1,
        birth: 1049562000,
        phone_number: "0774333060",
        information: "Kĩ sư",
        createdAt: "2024-10-10T03:56:20.000",
        updatedAt: "2024-10-10T03:56:20.000",
      },
      {
        id: "b067fcbc-c471-4898-a3f7-850b27d40797",
        email: 'tranquyen@gmail.com',
        password:
          '$2b$10$O5wyQhDf48tIetzTHvPFJu9Ug1aZ/TUnaNcCRaZHbdbEv1UPLZfT2',
        username: "Trần Xuân Quyến",
        gender: 1,
        birth: 1049562000,
        phone_number: "0774333060",
        information: "Bác sĩ",
        createdAt: "2024-10-10T03:56:20.000",
        updatedAt: "2024-10-10T03:56:20.000",
      },
      {
        id: "f7c1c6c7-a839-44c1-98e7-01b891f07c2f",
        email: 'huyquangpham@gmail.com',
        password:
          '$2b$10$O5wyQhDf48tIetzTHvPFJu9Ug1aZ/TUnaNcCRaZHbdbEv1UPLZfT2',
        username: "Phạm Quang Huy",
        gender: 1,
        birth: 1049562000,
        phone_number: "0774333060",
        information: "Giáo viên",
        createdAt: "2024-10-10T03:56:20.000",
        updatedAt: "2024-10-10T03:56:20.000",
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
