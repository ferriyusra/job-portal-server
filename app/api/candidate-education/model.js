const mongoose = require('mongoose');

const { model, Schema } = mongoose;

const candidateEducationSchema = Schema({

        user_candidate: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },

        institution: {
            type: String,
            required: [true, 'jurusan harus diisi.']
        },

        title: {
            type: String,
            required: [true, 'gelar harus diisi.']
        },

        field_of_study: {
            type: String,
            required: [true, 'jurusan harus diisi.']
        },

        start_date: {
            type: Date,
            required: [true, 'tanggal mulai harus diisi.']
        },

        end_date: {
            type: Date,
            required: [true, 'tanggal selesai harus diisi.']
        },


}, { timestamps: true });


module.exports = model('CandidateEducation', candidateEducationSchema, 'candidate_education');