/**
 * PersonController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    // display-filtering
    homepage: async function (req, res) {

        var region1 = await Person.find({
            where: { Region: "HK Island" },
            sort: 'Expired_Date'
        });
        var region2 = await Person.find({
            where: { Region: "Kowloon" },
            sort: 'Expired_Date'
        });
        var region3 = await Person.find({
            where: { Region: "New Territories" },
            sort: 'Expired_Date'
        });

        return res.view("pages/homepage", {
            region1s: region1,
            region2s: region2,
            region3s: region3
        });
    },

    // action - create
    create: async function (req, res) {
        if (req.method == "GET") return res.view('person/create');
        var person = await Person.create(req.body).fetch();
        return res.status(201).redirect("http://localhost:1337")
    },

    //admin
    admin: async function (req, res) {
        var everyones = await Person.find();
        return res.view("person/admin", { Coupons: everyones });
    },

    // action - read
    read: async function (req, res) {

        var thatPerson = await Person.findOne(req.params.id);
        length = 0
        if (req.session.personid) {
            var thatlength = await User.findOne(req.session.personid).populate("coupons", { id: req.params.id });
            var length = thatlength.coupons.length
            var thatUser = await User.findOne(req.session.personid)
        }
        var thatrole = req.session.role


        return res.view('person/read', { Coupon: thatPerson, User: thatUser, Length: length, Role: thatrole });
    },

    // action - delete 
    delete: async function (req, res) {

        await Person.destroyOne(req.params.id);

        if (req.wantsJSON) {
            return res.status(204).send();	    // for ajax request
        } else {
            return res.redirect('/');			// for normal request
        }

    },

    // action - update
    update: async function (req, res) {

        if (req.method == "GET") {

            var thatPerson = await Person.findOne(req.params.id);

            return res.view('person/update', { Coupon: thatPerson });

        } else {

            var updatedPerson = await Person.updateOne(req.params.id).set(req.body);

            if (!updatedPerson) return res.notFound();

            return res.redirect("../admin");
        }
    },
    // searchandpaginate  function
    // searchandpaginate: async function (req, res) {

    //     var whereClause = {};

    //     if (req.query.Region) whereClause.Region = req.query.Region;

    //     var parsedMinCoin = parseInt(req.query.Min_Coins);
    //     var parsedMaxCoin = parseInt(req.query.Max_Coins);
    //     if (!isNaN(parsedMinCoin) && !isNaN(parsedMaxCoin)) {
    //         whereClause.Coins = { "<=": parsedMaxCoin, ">=": parsedMinCoin };
    //     } else if (!isNaN(parsedMinCoin)) {
    //         whereClause.Coins = { ">=": parsedMinCoin };
    //     } else if (!isNaN(parsedMaxCoin)) {
    //         whereClause.Coins = { "<=": parsedMaxCoin };
    //     }

    //     if (req.query.Expired_Date) whereClause.Expired_Date = req.query.Expired_Date;

    //     var limit = 2;
    //     var offset = Math.max(req.query.offset, 0) || 0;


    //     var thosePersons = await Person.find({
    //         where: whereClause,
    //         sort: 'Expired_Date',
    //         limit: limit,
    //         skip: offset
    //     });

    //     var count = await Person.count(
    //         { where: whereClause }
    //     );

    //     return res.view('person/searchandpaginate', { Coupons: thosePersons, numOfRecords: count });
    // },



    // search-Ajax function

    aginate: async function (req, res) {

        if (req.wantsJSON) {

            var whereClause = {};
            if (req.method == "POST") {

                if (req.body.Region) whereClause.Region = req.body.Region;

                var parsedMinCoin = parseInt(req.body.Min_Coins);
                var parsedMaxCoin = parseInt(req.body.Max_Coins);
                if (!isNaN(parsedMinCoin) && !isNaN(parsedMaxCoin)) {
                    whereClause.Coins = { "<=": parsedMaxCoin, ">=": parsedMinCoin };
                } else if (!isNaN(parsedMinCoin)) {
                    whereClause.Coins = { ">=": parsedMinCoin };
                } else if (!isNaN(parsedMaxCoin)) {
                    whereClause.Coins = { "<=": parsedMaxCoin };
                }

                if (req.body.Expired_Date) whereClause.Expired_Date = req.body.Expired_Date;

                var limit = 2;
                var offset = Math.max(req.query.offset,0)||0;

                var thosePersons = await Person.find({
                    where: whereClause,
                    sort: 'Expired_Date',
                    limit: limit,
                    skip: offset
                });


                var count = await Person.count(
                    { where: whereClause }
                );
                return res.json({ data: thosePersons, newcount: count });
            } else {
                var limit = 2;
                var offset = Math.max(req.query.offset,0)||0;

                var thosePersons = await Person.find({
                    where: whereClause,
                    sort: 'Expired_Date',
                    limit: limit,
                    skip: offset
                });


                var count = await Person.count(
                    { where: whereClause }
                );
                return res.json({ data: thosePersons, newcount: count });
            }
        } else {

            var count = await Person.count();

            return res.view('person/aginate', { numOfRecords: count });
        }
    },




    // action  -  paginate
    //     paginate: async function (req, res) {

    //         var limit=2;
    //         var offset=Math.max(req.query.offset,0)||0;

    //         var somePersons = await Person.find({
    //             sort: 'Expired_Date',
    //             limit: limit,
    //             skip: offset
    //         });

    //         var count = await Person.count();

    //         return res.view('person/searchandpaginate', { Coupons: somePersons, numOfRecords: count });
    //     },

    //MyRedeemedCoupons
    populatecoupons: async function (req, res) {

        var allCoupons = await User.findOne(req.session.personid).populate('coupons');
        if (!allCoupons) return res.notFound();
        thatCoupons = allCoupons.coupons
        var thatUser = await User.findOne(req.session.personid);
        
        if (req.wantsJSON) {
            return res.json(allCoupons)
        } else {
            return res.view('person/MyRedeemedCoupons', { Coupons: thatCoupons, User: thatUser });
        }

    },

    populatemembers: async function (req, res) {
        var allMembers = await Person.findOne(req.params.id).populate('members');
        thatMembers = allMembers.members

        return res.view('person/RedeemedMember', { Users: thatMembers });
    },

    AllCoupons: async function (req, res) {
        var AllCoupons = await Person.find()
        if (req.wantsJSON) return res.json(AllCoupons);
    },

    GetUser: async function (req, res) {
        if (req.session.personid) {
            var thatUser = await User.findOne(req.session.personid);
        };
        return res.json(thatUser)

    }
}
