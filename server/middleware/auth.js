import passport from 'passport'
// import User from '../model/User.model'

const handleJWT = (req, res, next, requiredRoles) => {
  return async (err, user, info) => {
    const error = err || info
    if (error || !user) return res.status(401).json({ status: 401, ...err })

    await req.logIn(user, { session: false })

    if (!requiredRoles.reduce((acc, rec) => acc && user.role.some((t) => t === rec), true)) {
      return res.status(401).json({ status: 401, role: user.role, required: requiredRoles, ...err })
    }
    req.user = user
    return next()
  }
}

const auth = (requiredRoles = []) => {
  return (req, res, next) => {
    return passport.authenticate('jwt',
      { session: true },
      handleJWT(req, res, next, requiredRoles))(req, res, next)
  }
}

export default auth