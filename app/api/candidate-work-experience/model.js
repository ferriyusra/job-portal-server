const mongoose = require('mongoose');

const { model, Schema } = mongoose;

const candidateWorkExperienceSchema = Schema({

        user_candidate: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },

        position: {
            type: String,
            required: [true, 'posisi harus diisi.']
        },

        company_name: {
            type: String,
            required: [true, 'perusahaan harus diisi.']
        },

        start_date: {
            type: Date,
            required: [true, 'tanggal mulai harus diisi.']
        },

        end_date: {
            type: Date,
            required: [true, 'tanggal selesai harus diisi.']
        },

        detail: {
            type: String,
        }

}, { timestamps: true });


module.exports = model('CandidateWorkExperience', candidateWorkExperienceSchema, 'candidate_work_experience');