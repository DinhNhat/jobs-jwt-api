const Student = require('../models/Student');

const getAllStudentsStatic = async (req, res) => {
    const fieldsSelect = { name: 1 };
    const students = await Student
        .find({})
        .skip(10)
        .limit(10)
        .sort({ '_id': 'asc' })
        .select(fieldsSelect);

    //   const page = Number(req.query.page) || 1;
    //   const limit = Number(req.query.limit) || 10;
    //   const skip = (page - 1) * limit;

    //   result = result.skip(skip).limit(limit);

    res.status(200).json({ nbHits: students.length, students });
};

const getAllStudents = async (req, res) => {
    const { name, sort, fields, scoreFilters } = req.query;
    const queryObject = {};

    if (name) {
        queryObject.name = { $regex: name, $options: 'i' };
    }

    if (scoreFilters) {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
        };
        const regEx = /\b(<|>|>=|=|<|<=)\b/g;
        let filters = scoreFilters.replace(
            regEx,
            (match) => `-${operatorMap[match]}-`
        );
        const options = ['score', 'type'];
        const elementMatch = {};
        const nestedMatchObj = {};
        // console.log(`Query find filter: `, filters);
        filters = filters.split(',').forEach(item => {
            const [field, operator, value] = item.split('-');
            if (options.includes(field) && field === 'score') {
                nestedMatchObj.score = { [operator]: Number(value) };
            } else if (options.includes(field) && field === 'type') {
                nestedMatchObj.type = { [operator]: value };
            }
            elementMatch['$elemMatch'] = nestedMatchObj;
            queryObject['scores'] = elementMatch;
        });
        // $elemMatch: { score: { $gt: 96 }, type: { $eq: 'quiz' } }
        console.log(`Query find: `, queryObject);
    }

    let result = Student.find(queryObject);
    // sort
    if (sort) {
        const scoreSort = sort.includes('scores');
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList);
    } else {
        result = result.sort('createdAt');
    }

    if (fields) {
        // handle scores filter
        const staticScoreType = ['exam', 'quiz', 'homework'];
        const fieldsSelectCustom = {};
        const fieldsArray = fields.split(',');
        // { name: 1, scores: { $slice: 0} }
        fieldsArray.forEach(el => {
            if (!el.includes('scores')) {
                fieldsSelectCustom[el] = 1;
            }
        });

        const scoresFilter = fieldsArray.find(element => element.includes('scores'));
        if (!scoresFilter) {
            // do not filter any scores
            fieldsSelectCustom['scores'] = { $slice: 0 };
        } else {
            const sliceArray = [];
            const filterArray = scoresFilter.split('.').filter(el => !el.includes('scores'));
            const skipNumber = staticScoreType.indexOf(filterArray[0]);
            const numberReturn = filterArray.length;
            sliceArray.push(skipNumber);
            sliceArray.push(numberReturn);
            fieldsSelectCustom['scores'] = { $slice: sliceArray };
        }
        console.log(`Fields select custom: `, fieldsSelectCustom);
        result = result.select(fieldsSelectCustom);
    }
    //   const page = Number(req.query.page) || 1;
    //   const limit = Number(req.query.limit) || 10;
    //   const skip = (page - 1) * limit;

    //   result = result.skip(skip).limit(limit);
    // 23
    // 4 7 7 7 2

    const students = await result;
    res.status(200).json({ nbHits: students.length, students });
};

module.exports = {
    getAllStudents,
    getAllStudentsStatic
};
