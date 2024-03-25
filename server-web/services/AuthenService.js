const CommonService = require("./CommonService");
const AccountModel = require("../models/AccountModel");
const AccountRepository = require('../models/AccountModel/AccountRepository');
const UserRepository = require('../models/UserModel/UserRepository');
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

class AuthenService extends CommonService {
  async login(user) {}
  async checkEmail(email) {
    const emails = await AccountModel.executeQuery(
      AccountModel.checkExistEmail(email)
    );
    return emails.length > 0;
  }
  async register(account) {
    account.id = uuidv4();
    account.password = await bcrypt.hash(account.password, 10);
    const user = {
      id: uuidv4(),
      account_id: account.id,
      username: account.username,
      birth: account.birth,
      phone_number: account.phone_number,
      image: account.image,
      role: account.role,
    };
      await AccountRepository.add(account);
      await UserRepository.add(user);
  }
  async getAll() {
    await AccountRepository.getAllData();
  }
}
module.exports = new AuthenService();
