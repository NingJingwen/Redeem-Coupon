/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  //'/': { view: 'pages/homepage' },


  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/

  'GET /': 'PersonController.homepage',

  'GET /person/create': 'PersonController.create',
  'POST /person/create': 'PersonController.create',

  'GET /person/admin': 'PersonController.admin',


  'GET /person/read/:id': 'PersonController.read',
  'DELETE /person/:id': 'PersonController.delete',

  'GET /person/update/:id': 'PersonController.update',
  'POST /person/update/:id': 'PersonController.update',

  'GET /person/search': 'PersonController.searchandpaginate',
  'GET /person/paginate': 'PersonController.searchandpaginate',

  'GET /getsession':'UserController.getSession',
  'GET /person/MyRedeemedCoupons': 'PersonController.MyRedeemedCoupons',

  'GET /user/login': 'UserController.login',
  'POST /user/login': 'UserController.login',
  'POST /user/logout': 'UserController.logout',
  

  'GET /person/:id/members': 'PersonController.populate',
  'GET /user/:id/coupons': 'UserController.populate',
  'POST /user/:id/coupons/add/:fk': 'UserController.add',
  'POST /user/:id/coupons/remove/:fk': 'UserController.remove',
};
