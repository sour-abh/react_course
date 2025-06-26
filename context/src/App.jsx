
import Login from "./components/login"
import Profile from "./components/profile"
import UserContextProvider from "./UserContext/UserContextProvider"

function App() {


  return (
    <UserContextProvider>
      <h1> hello</h1>
      <Login/>
      <Profile/>

    </UserContextProvider>
  )
}

export default App
