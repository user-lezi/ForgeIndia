# 🙃 So You Wanna Contribute to ForgeIndia?

Great. You’ve stumbled upon **ForgeIndia** — the extension nobody asked for, but everyone (who speaks Hinglish) needed.

Tired of `$sendMessage`? Prefer `$msgBhej`? Yeah, us too. That’s why this exists.

---

## 📦 What Even *Is* This?

**ForgeIndia** is a ForgeScript extension that lets you write bots in *Hinglish* — half Hindi, half English, all vibes.
It doesn’t translate full sentences. It just renames functions so you can pretend you're coding and texting your group chat at the same time.

---

## 🌍 Where Are The Translations?

Inside the `translations/` folder. Each `.json` file is a collection of bad decisions we proudly call "translations."

```json
{
  "$sendMessage": ["$msgBhej"],
  "$addMessageReactions": ["$msgReactionAddKaro"]
}
```

* The **key** is the original ForgeScript function.
* The **value** is an array of desi alternatives. The first one is the default. The rest? Honorable mentions.

Want to translate `$deleteMessage` into `$msgHatao`? Go for it.

---

## 🛠 How To Contribute (Without Breaking Things)

1. **Fork** the repo. Basic open source etiquette.
2. **Clone** it.

   ```bash
   git clone https://github.com/your-username/ForgeIndia
   ```
3. Open the `translations/hinglish.json` file and drop in your spicy new aliases.
4. Don't forget the `$` at the start. It’s not optional. It's ForgeScript law.
5. Want to see how much you've helped humanity?
   Run:

   ```bash
   node dist/__tests__/coverage.js
   ```

   It’ll tell you how many functions you actually translated. Prepare to be humbled.
6. Run this *life-changing* script to regenerate `COVERAGE.md`:
   
   ```bash
   npm run prepublish
   ```
   Yes, it's called "prepublish." No, you're not publishing. Just roll with it.
7. Commit. Push. PR.
   We’ll roast you if it’s bad. Merge it if it’s great.

---

## 💡 Some Unsolicited Advice

* Keep it fun, but not confusing. `$msgBhej` is fine. `$maiToChala`… not so much.
* Hinglish, not Hingrish. No need to throw in Shuddh Sanskrit.
* Consistency is cooler than chaos.
* Don’t try to translate everything. `$eval` is still `$eval`. Please.

---

Made with 🫶, frustration, and a little bit of masala.

– Team ForgeIndia 🇮🇳💥
*"Coding mein bhi apnapan chahiye boss."*
