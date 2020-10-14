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
            sort: 'Expired_Date'
        });
        var region2= await Person.find({
            where: {Region: "Kowloon"}, 
            sort: 'Expired_Date'
        });
        var region3= await Person.find({ 
            where: {Region: "New Territories"}, 
            sort: 'Expired_Date'
        }); 

        return res.view("pages/homepage",{
            region1s: region1,
            region2s: region2,
            region3s: region3
        });
    } ,

    // action - create
    create: async function (req, res) {
        if (req.method == "GET") return res.view('person/create');
        var person = await Person.create(req.body).fetch();
        return res.status(201).json({ id: person.id });
    },

    //admin
    admin: async function (req, res) {
    var everyones = await Person.find();
    return res.view("person/admin", { Coupons: everyones });
  },
 
    // action - read
    read: async function (req, res) {

        var thatPerson = await Person.findOne(req.params.id);

        return res.view('person/read', { Coupon: thatPerson });
    },

    // action - delete 
    delete: async function (req, res) {

        var deletedPerson = await Person.destroyOne(req.params.id);

        if (!deletedPerson) return res.notFound();

        return res.redirect("../admin");
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
    search: async function (req, res) {

        var whereClause = {};

        if (req.query.Region) whereClause.Region = { contains: req.query.Region };

        var parseMinCoins = parseInt(req.query.Min_Coins);
        if (!isNaN(parseMinCoins)) whereClause.Min_Coins = { contains: parseMinCoins};
        
        var parseMaxCoins = parseInt(req.query.Max_Coins);
        if (!isNaN(parseMaxCoins)) whereClause.Max_Coins = { contains: parseMaxCoins};
        
        if(req.query.Expired_Date) whereClause.Expired_Date={ contains: req.query.Expired_Date}

        retrivebetween(parseMinCoins,parseMaxCoins)


        var thosePersons = await Person.find({
            where: whereClause,
            sort: 'Expired_Date'
        });

        var Coins=await Person.find();

        var count = await Person.count();

        return res.view('person/searchandpaginate', { Coupons: thosePersons, numOfRecords: count });
    },

    // action  -  paginate
    paginate: async function (req, res) {

        var limit=2;
        var offset=Math.max(req.query.offset,0)||0;

        var somePersons = await Person.find({
            sort: 'Expired_Date',
            limit: limit,
            skip: offset
        });

        var count = await Person.count();

        return res.view('person/searchandpaginate', { Coupons: somePersons, numOfRecords: count });
    },
};

<script>

function retrivebetween(start,end) {
    inter=await Person.find();
    var each;
    for (each in inter.Coins) {
        if (each>start || each<end){
            whereClause.Coins.insert(each);
        }
    }    
}


</script>