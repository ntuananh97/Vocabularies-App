const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const Role = require("./models/RoleModel");
const { CONFIG_PERMISSIONS } = require("./configs/constants");
const User = require("./models/UserModel");

const createDefaultRole = async () => {
  const defaultAdminRole = new Role({
    name: "Admin",
    permissions: [CONFIG_PERMISSIONS.ADMIN],
  });

  const defaultBasicRole = new Role({
    name: "Basic",
    permissions: [CONFIG_PERMISSIONS.BASIC],
  });

  await defaultAdminRole.save();
  await defaultBasicRole.save();
};

const createAdminUser = async () => {
  const roleAdmin = await Role.findOne({ name: "Admin" });
  if (!roleAdmin) return;

  const adminPass = "T123456@";
  const hashPassWork = bcrypt.hashSync(adminPass, 10);

  const defaultUser = new User({
    email: "admin@gmail.com",
    password: hashPassWork,
    role: roleAdmin,
  });
  await defaultUser.save();
};

const initializeDB = async () => {
  try {
    // eslint-disable-next-line no-undef
    await mongoose.connect(`${process.env.MONGO_DB}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await createDefaultRole();
    await createAdminUser();
    mongoose.connection.close();
  } catch (error) {
    console.log("initializeDB ~ error:", error);
  }
};

dotenv.config();
initializeDB();
