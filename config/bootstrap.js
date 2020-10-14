/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function () {

  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return;
  // }
  //
  // await User.createEach([
  //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
  //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
  // ```

  if (await Person.count() > 0) {
    return;
  }

  await Person.createEach([
    {Title:"30% off on Chinese Food",Restaurant:"Bo Innovation",Region:"HK Island",Mall:"IFC MaLL",Image:"http://img6.16fan.com/201511/06/140037rjq44mbohthdhmhb.jpg-700",Quota:200,Coins:20,Expired_Date:"2020-12-23",Detail:"Original Price: HK$800 per person"},
    {Title:"30% off on Cantonese Food",Restaurant:"Lung King Heen",Region:"Kowloon",Mall:"Pacific Place",Image:"http://img6.16fan.com/201511/06/144042xpuaarhf24y2yzga.jpg-700",Quota:200,Coins:20,Expired_Date:"2020-12-23",Detail:"Original Price: HK$800 per person"},
    {Title:"30% off on cavior, truffle and fat foir gras",Restaurant:"L'Atelier de Joël Robuchon",Region:"Kowloon",Mall:"Pacific Place",Image:"http://img6.16fan.com/201511/06/140845u1dyhw96zq9u9w9t.jpg-700",Quota:200,Coins:20,Expired_Date:"2020-10-14",Detail:"Original Price: HK$800 per person"},
    {Title:"30% off on Italian Food",Restaurant:"8 ½ Otto e Mezzo - Bombana",Region:"New Territories",Mall:"APM",Image:"http://img6.16fan.com/201511/06/142312a9tz9kklo0tl5t8r.jpg-700",Quota:200,Coins:20,Expired_Date:"2020-12-23",Detail:"Original Price: HK$800 per person"}
    // etc.
  ]);

};
