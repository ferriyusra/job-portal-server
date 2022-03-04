const Skill = require("./model");


async function index(req, res, next) {
    try {

        let skills = await Skill.find().select('-__v');
        return res.status(200).json({
            code: 200,
            status: "OK",
            message: 'Success get all skills',
            data: skills
        });
    } catch (err) {
        next(err)
    }
}

async function store(req, res, next) {

    try {

        let payload = req.body;

        let skill = new Skill(payload);

        await skill.save();

        return res.status(201).json({
            code: 200,
            status: "OK",
            message: 'Success create skill',
            data: skill
        });

    } catch (err) {

        if (err && err.name === 'ValidationError') {
            return res.status(400).json({
                code: 400,
                status: "BAD REQUEST",
                message: err.message,
                fields: err.errors
            });
        }

        next(err)
    }

}

async function update(req, res, next) {

    try {

        let payload = req.body;

        let skillId = req.params.id;


        let skill = await Skill.findOneAndUpdate(
            {
                _id: skillId
            },
            payload,
            {
                new: true,
                runValidators: true
            }
        )

        if (skill) {
            return res.status(201).json({
                code: 200,
                status: "OK",
                message: 'Success update skill',
                data: skill
            });

        } else {
            return res.status(404).json({
                code: 404,
                status: "NOT FOUND",
                message: 'Id skill not found',
            });
        }


    } catch (err) {

        if (err && err.name === 'ValidationError') {
            return res.status(400).json({
                code: 400,
                status: "BAD REQUEST",
                message: err.message,
                fields: err.errors
            });
        }

        next(err)
    }

}

async function destroy(req, res, next) {

    try {

        let skillId = req.params.id;

        let skill = await Skill.findOneAndDelete(
            {
                _id: skillId
            },
        )

        if (skill) {
            return res.status(200).json({
                code: 200,
                status: "OK",
                message: 'Success delete skill',
                data: skill
            });

        } else {
            return res.status(404).json({
                code: 404,
                status: "NOT FOUND",
                message: 'Id skill not found',
            });
        }

    } catch (err) {

        next(err)
    }

}


module.exports = {
    index,
    store,
    update,
    destroy
}