import { useState } from "react"
import ChatUi from "./components/ChatUi"
import Dashboard from "./components/Dashboard"

function App() {
  const [isChatVisible,setIsChatVisible]=useState(false)
  return <div className="h-screen w-screen bg-secondary flex">
     <Dashboard isChatVisible={isChatVisible} setIsChatVisible={setIsChatVisible}/>
   <ChatUi isChatVisible={isChatVisible} setIsChatVisible={setIsChatVisible}/>
  </div>
}

export default App