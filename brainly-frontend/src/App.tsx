
import { Dashboard } from './pages/dashboard'
import {Signup} from './pages/Signup'
import {SharedContentPage} from './pages/SharePage'
import {Signin} from './pages/Signin'

import { BrowserRouter , Route, Routes } from 'react-router-dom'

function App() {
return ( 
  <BrowserRouter>
  <Routes>

    <Route path = "/signup" element = {<Signup />}/>
    <Route path= "/api/v1/library/share/:shareLink" element={<SharedContentPage />} />
    <Route path = "/signin" element = {<Signin/>}/>
    <Route path = "/dashboard" element = {<Dashboard />}/>
    </Routes>
  </BrowserRouter>
  )
}

export default App
