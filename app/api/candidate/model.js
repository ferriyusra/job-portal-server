const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const candidateSchema = Schema(
  {
    user_candidate: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    resume_url: String,
  },
  { timestamps: true }
);

module.exports = model("Candidate", candidateSchema);
