export default (store) => ({
  path : '/**',
  onEnter : () => {
    window.location.href = '/#/login'
  }
})