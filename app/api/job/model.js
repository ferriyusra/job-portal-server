const mongoose = require("mongoose");

const { model, Schema } = mongoose;

const jobSchema = Schema(
  {
    user_company: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    company_name: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },

    job_category: {
      type: Schema.Types.ObjectId,
      ref: "JobCategory",
    },

    job_position: {
      type: String,
      minlength: [3, "Panjang posisi pekerjaan minimal 3 karakter"],
      maxlength: [255, "Panjang posisi pekerjaan maksimal 255 karakter"],
      required: [true, "posisi pekerjaan perushaan harus diisi"],
    },

    job_description: {
      type: String,
      minlength: [3, "Panjang deskripsi pekerjaan minimal 3 karakter"],
      required: [true, "deskripsi pekerjaan harus diisi"],
    },

    job_location: {
      type: String,
      minlength: [3, "Panjang lokasi pekerjaan minimal 3 karakter"],
      maxlength: [255, "Panjang lokasi pekerjaan maksimal 255 karakter"],
      required: [true, "lokasi pekerjaan harus diisi"],
    },

    job_salaries_min: {
      type: Number,
      required: [true, "gaji pekerjaan harus diisi"],
    },
    job_salaries_max: {
      type: Number,
      required: [true, "gaji pekerjaan harus diisi"],
    },

    job_benefits: {
      type: Array,
      required: [true, "tunjangan dan keuntungan pekerjaan harus diisi"],
    },

    job_skills: [
      {
        type: Schema.Types.ObjectId,
        ref: "Skill",
      },
    ],

    minYearsOfExperience: {
      type: Number,
      default: 0,
      required: [true, "minimal pengalaman harus diisi"],
    },

    maxYearsOfExperience: {
      type: Number,
      required: [true, "maksimal pengalaman harus diisi"],
    },

    is_remote: {
      type: Boolean,
      default: false,
    },

    is_publish: {
      type: Boolean,
      default: true,
    },

    type: {
      type: String,
      required: [true, "tipe pekerjaan harus diisi"],
    },

    status: {
      type: String,
      required: [true, "status pekerjaan harus diisi"],
    },
  },
  { timestamps: true }
);

module.exports = model("Job", jobSchema);
