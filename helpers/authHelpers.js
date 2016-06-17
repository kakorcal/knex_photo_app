module.exports = {
  currentUser(req, res, next){
    // attach req.user to req.locals so all jade templates has access
    if(req.isAuthenticated()) res.locals.current = req.user;
    return next();
  },
  preventLoginSignup(req, res, next){
    // req.user exists, redirect to users
    if(req.isAuthenticated()){
      res.redirect('/users');
    }else{
      return next();
    }
  },
  checkAuthentication(req, res, next){
    // filter to check every site visitor
    if(!req.isAuthenticated()){
      req.flash('Login Error', 'Please Login First');
      res.redirect('/auth/login');
    }else{
      return next();
    }
  },
  checkCorrectUser(req, res, next){
    // filter to check user with account
    // users with an account have access to CRUD features
    if(+req.params.id !== req.user.id){
      req.redirect(`/users/${req.user.id}`);
    }else{
      return next();
    }
  }
};