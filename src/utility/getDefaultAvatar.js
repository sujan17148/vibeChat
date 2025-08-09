export default function getDefaultAvatar(){
    const defaultEmojiAvatars = [
        "😄", "😎", "😊", "🧑‍💻", "👽", "🐱", "🐶", "🐸", "🐵", "🐧",
        "🦊", "🦁", "🐯", "🐼", "🐨", "🐻", "🐷", "👻", "🤖", "💀",
        "🎃", "🦄", "💩", "🧠", "⚡", "🔥", "🌈", "🎩", "🕶️", "🌟"
      ];
      return defaultEmojiAvatars[Math.floor(Math.random()*defaultEmojiAvatars.length)]
      
}