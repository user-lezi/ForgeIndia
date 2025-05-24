# 🇮🇳 ForgeIndia

** **
> Struggling with English but still want to code in ForgeScript?
> 
> Say hello to **`forge.india`** – a Hinglish-powered package that lets you code the way *you* speak.

No more worrying about grammar or syntax in English. With **ForgeIndia**, you can write Forgescript commands using a mix of Hindi and English – just like how you talk every day.

## ✨ Features

* Write code in *Hinglish* (Hindi + English)
* Friendly syntax for native Hindi speakers
* Perfect for beginners who want to focus on logic, not language

## 🚀 Example

index.js:
```js
const { ForgeIndia } = require("forge.india");
const { ForgeClient } = require("@tryforge/forgescript");

const client = new ForgeClient({
    intents: [
        "Guilds",
        "MessageContent",
        "GuildMessages",
    ],
    events: [],
    mobile: true,
    useInviteSystem: true,
    prefixes: ["!", "<@$botID>"],
    extensions: [
        new ForgeIndia()
    ],
})

client.login("bot token")
```

commands/test.js:
```js
module.exports = {
    name: "up",
    type: "messageCreate",
    code: `$!msgReactionAddKaro[$chnlID;$msgID;👍]` 
}
```

## 📦 Installation

```bash
npm install https://github.com/user-lezi/ForgeIndia
```

Start coding in your *apni bhasha* (your own language) today!