/**
 * PersonController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    // display-filtering
    homepage: async function(req,res){

        var region1= await Person.find({ 
            where: {Region: "HK Island"}, 
            sort: 'date'
        });
        var region2= await Person.find({
            where: {Region: "Kowloon"}, 
            sort: 'date'
        });
        var region3= await Person.find({ 
            where: {Region: "New Territories"}, 
            sort: 'date'
        }); 

        return res.json(region1)
        // return res.view("person/list",{
        //     region1s: region1,
        //     region2s: region2,
        //     region3s: region3
        // });
    } ,

    // action - create
    create: async function (req, res) {
        if (req.method == "GET") return res.view('person/create');
        var person = await Person.create(req.body).fetch();
        return res.status(201).json({ id: person.id });
    },

 
    // action - read
    read: async function (req, res) {

        var thatPerson = await Person.findOne(req.params.id);

        if (!thatPerson) return res.notFound();

        return res.view('person/read', { person: thatPerson });
    },

    // action - delete 
    delete: async function (req, res) {

        var deletedPerson = await Person.destroyOne(req.params.id);

        if (!deletedPerson) return res.notFound();

        return res.ok();
    },

    // action - update
    update: async function (req, res) {

        if (req.method == "GET") {

            var thatPerson = await Person.findOne(req.params.id);

            if (!thatPerson) return res.notFound();

            return res.view('person/update', { person: thatPerson });

        } else {

            var updatedPerson = await Person.updateOne(req.params.id).set(req.body);

            if (!updatedPerson) return res.notFound();

            return res.ok();
        }
    },
    // search  function
    search: async function (req, res) {

        var whereClause = {};

        if (req.query.name) whereClause.name = { contains: req.query.name };

        var parsedAge = parseInt(req.query.age);
        if (!isNaN(parsedAge)) whereClause.age = parsedAge;

        var thosePersons = await Person.find({
            where: whereClause,
            sort: 'name'
        });

        return res.view('person/list', { persons: thosePersons });
    },

    // action  -  paginate
    paginate: async function (req, res) {

        var limit = Math.max(req.query.limit, 2) || 2;
        var offset = Math.max(req.query.offset, 0) || 0;

        var somePersons = await Person.find({
            limit: limit,
            skip: offset
        });

        var count = await Person.count();

        return res.view('person/paginate', { persons: somePersons, numOfRecords: count });
    },
};

