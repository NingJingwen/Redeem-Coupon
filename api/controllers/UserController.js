/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    // login users
    login: async function (req, res) {

        if (req.method == "GET") return res.view('user/login');

        if (!req.body.username || !req.body.password) return res.badRequest();

        var user = await User.findOne({ username: req.body.username });

        if (!user) return res.status(401).json("User not found");

        var match = await sails.bcrypt.compare(req.body.password, user.password);

        if (!match) return res.status(401).json("Wrong Password");

        // Reuse existing session 
        if (!req.session.username) {
            req.session.username = user.username;
            req.session.personid = user.id;
            req.session.coins = user.coins;
            req.session.role = user.role;
            if (req.wantsJSON) {
                return res.status(204).send()

            } else {
                return res.redirect('/');
            }
        }


        // Start a new session for the new login user
        req.session.regenerate(function (err) {

            if (err) return res.serverError(err);

            req.session.username = user.username;
            req.session.coins = user.coins;
            req.session.role = user.role;
            req.session.personid = user.id;
            if (req.wantsJSON) {
                return res.json(user);
            } else {
                return res.redirect('/');
            }
        });
    },

    logout: async function (req, res) {

        req.session.destroy(function (err) {

            if (err) return res.serverError(err);

            return res.status(204).send();

        });
    },

    populate: async function (req, res) {

        var user = await User.findOne(req.params.id).populate("coupons");

        if (!user) return res.notFound();

        return res.json(user);
    },

    add: async function (req, res) {

        if (!await User.findOne(req.params.id)) return res.status(404).json("User not found.");

        var thatPerson = await Person.findOne(req.params.fk).populate("members", { id: req.params.id });

        if (!thatPerson) return res.status(404).json("Coupon not found.");

        if (thatPerson.members.length > 0)
            return res.status(409).json("Already added.");   // conflict

        await User.addToCollection(req.params.id, "coupons").members(req.params.fk);

        return res.ok();
    },
    remove: async function (req, res) {

        if (!await User.findOne(req.params.id)) return res.status(404).json("User not found.");

        var thatPerson = await Person.findOne(req.params.fk).populate("coupons", { id: req.params.id });

        if (!thatPerson) return res.status(404).json("Coupon not found.");

        if (thatPerson.coupons.length == 0)
            return res.status(409).json("Nothing to delete.");    // conflict

        await User.removeFromCollection(req.params.id, "members").members(req.params.fk);

        return res.ok();
    },



    getSession: function (req, res) {
        if (!req.session) {
            return res.json('don\'t exist');
        } else {
            if (req.wantsJSON) {
                return res.json({ session: req.session });
            }
        }
    }
};

