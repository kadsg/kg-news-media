import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import Cookies from 'js-cookie'

const getDefaultState = () => {
  return {
    // eslint-disable-next-line no-undef
    id: Cookies.get('vue_admin_template_id') || '',
    token: getToken(),
    username: '',
    nickname: '',
    roleId: '',
    roleName: '',
    email: '',
    phone: '',
    createUser: '',
    createTime: '',
    updateTime: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NICKNAME: (state, nickname) => {
    state.nickname = nickname
  },
  SET_AVATAR: (state, roleId) => {
    state.roleId = roleId
  },
  SET_ROLE_NAME: (state, roleName) => {
    state.roleName = roleName
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_PHONE: (state, phone) => {
    state.phone = phone
  },

  SET_CREATE_USER: (state, createUser) => {
    state.createUser = createUser
  },
  SET_CREATE_TIME: (state, createTime) => {
    state.createTime = createTime
  },
  SET_UPDATE_TIME: (state, updateTime) => {
    state.updateTime = updateTime
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_ID', data.id)
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        // eslint-disable-next-line no-undef
        Cookies.set('vue_admin_template_id', data.id) // 保存id到Cookies
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      console.log('state.token', state.token)
      getInfo(state.id).then(response => {
        const { data } = response
        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { userId, nickname,
          roleId, roleName,
          email, phone, createUser,
          createTime, updateTime } = data

        commit('SET_ID', userId)
        commit('SET_NICKNAME', nickname)
        commit('SET_AVATAR', roleId)
        commit('SET_ROLE_NAME', roleName)
        commit('SET_EMAIL', email)
        commit('SET_PHONE', phone)
        commit('SET_CREATE_USER', createUser)
        commit('SET_CREATE_TIME', createTime)
        commit('SET_UPDATE_TIME', updateTime)

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        // eslint-disable-next-line no-undef
        Cookies.remove('vue_admin_template_id')
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

