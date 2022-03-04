const mongoose = require("mongoose");
const { model, Schema } = mongoose;
const bcrypt = require("bcrypt");
const HASH_ROUND = 10;
const AutoIncrement = require("mongoose-sequence")(mongoose);

let userSchema = Schema(
  {
    user_id: {
      type: Number,
    },

    first_name: {
      type: String,
      required: [true, "Nama depan harus diisi"],
      maxlength: [255, "Panjang nama depan harus antara 3 - 255 karakter"],
      minlength: [3, "Panjang nama depan harus antara 3 - 255 karakter"],
    },
    last_name: {
      type: String,
      required: [true, "Nama belakang harus diisi"],
      maxlength: [255, "Panjang nama belakang harus antara 3 - 255 karakter"],
      minlength: [3, "Panjang nama belakang harus antara 3 - 255 karakter"],
    },
    email: {
      type: String,
      required: [true, "Email harus diisi"],
      maxlength: [50, "Panjang email maksimal 50 karakter"],
    },
    password: {
      type: String,
      required: [true, "Password harus diisi"],
      maxlength: [16, "Panjang password maksimal 16 karakter"],
    },

    role: {
      type: String,
      enum: ["candidate", "company", "super_admin"],
    },
    age: {
      type: Number,
      default: 0,
    },

    gender: {
      type: String,
      enum: ["pria", "wanita"],
    },

    phone_number: {
      type: Number,
      maxLength: 12,
    },

    about: {
      type: String,
    },

    token: [String],
    // resume_url: String,
    user_image_url: String,
  },
  { timestamps: true }
);

userSchema.path("email").validate(
  async function (value) {
    try {
      const count = await this.model("User").count({ email: value });

      return !count;
    } catch (err) {
      throw err;
    }
  },
  (attr) => `${attr.value} sudah terdaftar`
);

userSchema.path("email").validate(
  function (value) {
    const emailRE = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

    return emailRE.test(value);
  },
  (attr) => `${attr.value} harus merupakan email yang valid!`
);

userSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, HASH_ROUND);
  next();
});

userSchema.plugin(AutoIncrement, { inc_field: "user_id" });

module.exports = model("User", userSchema);
