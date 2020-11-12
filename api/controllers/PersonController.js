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
        var thatid = req.session.personid
        var thatlength = await User.findOne(req.session.personid).populate("coupons", { id: req.params.id });
        var length=thatlength.coupons.length


        return res.view('person/read', { Coupon: thatPerson, Userid: thatid, Length:length });
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
    // search  function
    searchandpaginate: async function (req, res) {

        var whereClause = {};

        if (req.query.Region) whereClause.Region = req.query.Region;

        var parsedMinCoin = parseInt(req.query.Min_Coins);
        var parsedMaxCoin = parseInt(req.query.Max_Coins);
        if (!isNaN(parsedMinCoin) && !isNaN(parsedMaxCoin)) {
            whereClause.Coins = { "<=": parsedMaxCoin, ">=": parsedMinCoin };
        } else if (!isNaN(parsedMinCoin)) {
            whereClause.Coins = { ">=": parsedMinCoin };
        } else if (!isNaN(parsedMaxCoin)) {
            whereClause.Coins = { "<=": parsedMaxCoin };
        }

        if (req.query.Expired_Date) whereClause.Expired_Date = req.query.Expired_Date;

        var limit = 2;
        var offset = Math.max(req.query.offset, 0) || 0;


        var thosePersons = await Person.find({
            where: whereClause,
            sort: 'Expired_Date',
            limit: limit,
            skip: offset
        });

        var count = await Person.count(
            { where: whereClause }
        );

        return res.view('person/searchandpaginate', { Coupons: thosePersons, numOfRecords: count });
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
    MyRedeemedCoupons: async function (req, res) {

        var allCoupons = await User.findOne(req.session.personid).populate('coupons');
        if (!allCoupons) return res.notFound();
        thatCoupons=allCoupons.coupons
        var thatUser = await User.findOne(req.session.personid);

        return res.view('person/MyRedeemedCoupons', { Coupons: thatCoupons, User: thatUser });


    },
}
