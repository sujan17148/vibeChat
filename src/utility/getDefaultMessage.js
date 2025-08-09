export default function getDefaultMessage(){
    const defaultMessages = [
        "Say hi 👋",
        "Start the conversation 💬",
        "Don't be shy, drop a message 😄",
        "Time to talk 🚀",
        "Wave hello 👋",
        "Break the ice ❄️",
        "Start messaging now 💌",
        "Say something cool 😎",
        "New chat, new vibes 🌟",
        "Get the convo rolling 🌀",
        "Begin your chat journey ✨",
        "Just say hey 🙌",
        "Let's chat 🗨️",
        "Hit send and connect 🔗",
        "Ready, set, message! 🏁",
        "You go first 😉",
        "Let's get this party started 🎉"
      ]
      return defaultMessages[ Math.floor(Math.random()*defaultMessages.length)]
}