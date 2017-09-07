export default {
  getCount: state => {
    return state.count
  },
  dType: state => {
    return state.env.dType
  },
  loginUser: state => {
    return state.loginUser
  }
}
