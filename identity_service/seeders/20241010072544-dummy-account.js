'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('account', [
      {
        id: 'ae4f7c10-5e36-4f9d-a02b-0a76f4d612e3',
        email: 'codung2909@gmail.com',
        password:
          '$2b$10$O5wyQhDf48tIetzTHvPFJu9Ug1aZ/TUnaNcCRaZHbdbEv1UPLZfT2',
        role: 2,
        verify: false,
        createdAt: '2024-10-09T15:48:48.000',
        updatedAt: '2024-10-09T15:48:48.000',
      },
      {
        id: 'de5824b0-781b-4ad5-943b-604714fd9113',
        email: 'nguyenduong1705@gmail.com',
        password:
          '$2b$10$O5wyQhDf48tIetzTHvPFJu9Ug1aZ/TUnaNcCRaZHbdbEv1UPLZfT2',
        role: 2,
        verify: false,
        createdAt: '2024-10-09T16:07:09.000',
        updatedAt: '2024-10-09T16:07:09.000',
      },
      {
        id: 'b067fcbc-c471-4898-a3f7-850b27d40796',
        email: 'trantuan7541@gmail.com',
        password:
          '$2b$10$O5wyQhDf48tIetzTHvPFJu9Ug1aZ/TUnaNcCRaZHbdbEv1UPLZfT2',
        role: 1,
        verify: false,
        createdAt: '2024-10-09T16:08:24.000',
        updatedAt: '2024-10-09T16:08:24.000',
      },
      {
        id: '9dc38d89-55d1-4d41-8bfb-c885bc6ff0be',
        email: 'tranquyen@gmail.com',
        password:
          '$2b$10$O5wyQhDf48tIetzTHvPFJu9Ug1aZ/TUnaNcCRaZHbdbEv1UPLZfT2',
        role: 2,
        verify: false,
        createdAt: '2024-10-10T03:52:29.000',
        updatedAt: '2024-10-10T03:52:29.000',
      },
      {
        id: '13b8a64f-6311-4ae4-a25a-7f5b77b64852',
        email: 'huyquangpham@gmail.com',
        password:
          '$2b$10$O5wyQhDf48tIetzTHvPFJu9Ug1aZ/TUnaNcCRaZHbdbEv1UPLZfT2',
        role: 3,
        verify: false,
        createdAt: '2024-10-10T03:52:29.000',
        updatedAt: '2024-10-10T03:52:29.000',
      },
      {
        id: 'f7c1c6c7-a839-44c1-98e7-01b891f07c2f',
        email: 'lethuan2212@gmail.com',
        password:
          '$2b$10$O5wyQhDf48tIetzTHvPFJu9Ug1aZ/TUnaNcCRaZHbdbEv1UPLZfT2',
        role: 3,
        verify: false,
        createdAt: '2024-10-11T12:30:55.000',
        updatedAt: '2024-10-11T12:30:55.000',
      },
      {
        id: 'c8d5a8b9-7735-402d-841d-7a2a958ce88e',
        email: 'hoangnhung3108@gmail.com',
        password:
          '$2b$10$O5wyQhDf48tIetzTHvPFJu9Ug1aZ/TUnaNcCRaZHbdbEv1UPLZfT2',
        role: 3,
        verify: false,
        createdAt: '2024-10-12T09:15:32.000',
        updatedAt: '2024-10-12T09:15:32.000',
      },
      {
        id: '43fa2d3f-58b2-4867-8aaf-c29b39b4c7be',
        email: 'nguyenbinh0507@gmail.com',
        password:
          '$2b$10$O5wyQhDf48tIetzTHvPFJu9Ug1aZ/TUnaNcCRaZHbdbEv1UPLZfT2',
        role: 3,
        verify: false,
        createdAt: '2024-10-12T13:45:22.000',
        updatedAt: '2024-10-12T13:45:22.000',
      },
      {
        id: '70f74b32-405e-4de1-bcd7-27d421f8c20b',
        email: 'phongtran2209@gmail.com',
        password:
          '$2b$10$O5wyQhDf48tIetzTHvPFJu9Ug1aZ/TUnaNcCRaZHbdbEv1UPLZfT2',
        role: 3,
        verify: false,
        createdAt: '2024-10-13T17:22:11.000',
        updatedAt: '2024-10-13T17:22:11.000',
      },
      {
        id: '8d4377d3-8c4d-43c4-bb29-207c5cf074ef',
        email: 'ngocquynh0410@gmail.com',
        password:
          '$2b$10$O5wyQhDf48tIetzTHvPFJu9Ug1aZ/TUnaNcCRaZHbdbEv1UPLZfT2',
        role: 3,
        verify: false,
        createdAt: '2024-10-14T08:50:40.000',
        updatedAt: '2024-10-14T08:50:40.000',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('account', null, {});
  },
};
