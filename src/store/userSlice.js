import { createSlice } from '@reduxjs/toolkit'

// const initialState = {
//   value: null,
// }
// const initialState = {
//   value: [],
// }
const initialState = {
  email: null,
  uid: null
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUserData: (state, action) => {
      state.email = action.payload[0]
      state.uid = action.payload[1]
      console.log('zalogowano:  ' + state.email)
    },
    logoutUser: (state) => {
      state.email = null
      state.uid = null
      console.log('pomyślnie wylogowano.  state:  ' + state.email)
    },
  },
})

// Action creators are generated for each case reducer function
//export const userEmail = state => state.email

export const { loginUserData, logoutUser} = userSlice.actions


export default userSlice.reducer