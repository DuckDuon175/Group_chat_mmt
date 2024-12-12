"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("notifications_schedule", [
      {
        id: "9b2a5f71-23b7-47c8-b9b5-4a7d5e5f6d2b",
        patient_id: "bc372cb1-2e6f-4727-b2ad-bd041bd9fbb5",
        doctor_id: "de5824b0-781b-4ad5-943b-604714fd9113",
        schedule_start_time: 1704958200,
        is_seen: true,
        status: 1,
        type: 0,
        createdAt: "2024-10-12T08:45:33.000",
        updatedAt: "2024-10-12T08:45:33.000",
      },
      {
        id: "6c28faba-d431-41db-b5a9-2dcb5fe2a241",
        patient_id: "ecb4b5a1-58f6-4b33-bc26-d8bca0c2f22e",
        doctor_id: "b067fcbc-c471-4898-a3f7-850b27d40797",
        schedule_start_time: 1730601000,
        is_seen: false,
        status: 1,
        type: 0,
        createdAt: "2024-10-12T09:10:12.000",
        updatedAt: "2024-10-12T09:10:12.000",
      },
      {
        id: "6c28faba-d438-41db-a5a9-2dcb5fh2a241",
        patient_id: "d1c344b0-23a6-4c15-9b5b-927f55f22ae4",
        doctor_id: "b067fcbc-c471-4898-a3f7-850b27d40797",
        schedule_start_time: 1730862000,
        is_seen: true,
        status: 3,
        type: 0,
        createdAt: "2024-10-12T09:10:12.000",
        updatedAt: "2024-10-12T09:10:12.000",
      },
      {
        id: "6c28faba-d431-91db-a5a9-2dcb5fh2a211",
        patient_id: "f3a45cb9-1d8a-4f1e-92e4-5c731d0b45a4",
        doctor_id: "b067fcbc-c471-4898-a3f7-850b27d40797",
        schedule_start_time: 1730964600,
        is_seen: true,
        status: 1,
        type: 1,
        createdAt: "2024-10-12T09:10:12.000",
        updatedAt: "2024-10-12T09:10:12.000",
      },
      {
        id: "7c28faba-d431-41db-a5a7-2dcb5fh2a211",
        patient_id: "bc372cb1-2e6f-4727-b2ad-bd041bd9fbb5",
        doctor_id: "b067fcbc-c471-4898-a3f7-850b27d40797",
        schedule_start_time: 1730797200,
        is_seen: false,
        status: 3,
        type: 1,
        createdAt: "2024-10-12T09:10:12.000",
        updatedAt: "2024-10-12T09:10:12.000",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("notifications_schedule", null, {});
  },
};