import { ForgeClient } from "@tryforge/forgescript";
import { config } from "dotenv";
import { ForgeIndia, ForgeIndiaTranslation } from "..";
config();

const client = new ForgeClient({
  prefixes: ["!"],
  token: process.env.Token!,
  intents: ["MessageContent", "GuildMessages", "Guilds"],
  events: ["ready", "messageCreate"],
  extensions: [
    new ForgeIndia({
      debug: true,
      translation: ForgeIndiaTranslation.Hinglish,
      // exclude: ["$sendMessage"],
    }),
  ],
});

client.commands.add({
  name: "ping",
  type: "messageCreate",
  code: "`$pingms`",
});
client.commands.add({
  name: "eval",
  type: "messageCreate",
  code: `$onlyIf[$or[$authorID==903681538842054686;$authorID==910837428862984213]]
  $eval[$message]
  $sendMessage[$channelID;$codeblock[$message] $executionTime]`,
});

client.commands.add({
  type: "messageCreate",
  name: "djs",
  code: `$onlyIf[$or[$authorID==903681538842054686;$authorID==910837428862984213]]
  $onlyIf[$authorID==910837428862984213]
$djsEval[
(async()=>{let { EmbedBuilder:E,codeBlock:CD,ButtonBuilder:BB,ButtonStyle:BS,ActionRowBuilder:ARB,ComponentType:CT}=require('discord.js'),z=ctx.args,a,r=RegExp('\\['+String.fromCharCode(...\\[92, 115, 92, 83\\])+'\\]{1,4000}','g');try{a=await eval(z.join(' '))}catch(e){a=e};let u={a:function(emoji,style,id,dis){return new BB().setEmoji(emoji).setStyle(BS\\[style\\]).setCustomId(id).setDisabled(dis)},b:function(a=!1,b=!1,c=!1){return \\[new ARB().addComponents(this.a('◀️','Primary','back',a),this.a('🗑️','Danger','del',b),this.a('▶️','Primary','next',c))\\]}},b=('object'==typeof a?require('util').inspect(a):a)+'',c=b.match(r)||\\[' '\\],d=0,e=c.map((e,f)=>new E().setColor(0x313236).setTitle('Evaluted').setDescription(CD('js', e)).setFooter({text:\`Page \$\{f + 1}/\$\{c.length} • \$\{b.length} • \$\{typeof a}\`})),v=await ctx.channel.send({embeds:\\[e\\[d\\]\\],components:u.b(!0,!1,e.length<2)}),col=v.createMessageComponentCollector({ componentType:CT.Button,time:30e5});col.on('collect',(i)=>i.user.id!==ctx.user.id?i.reply({content:\`Only \$\{ctx.user.toString()} can use the buttons!\`,ephemeral:!0}):(i.deferUpdate().catch(()=>{}),'del'==i.customId)?v.delete().catch(()=>{}):(d+='next'==i.customId?1:-1,v.edit({components:u.b(0==d,!1,!e\\[d+1\\]),embeds:\\[e\\[d\\]\\]}).catch(()=>{})));col.on('end',()=>v.edit({components:u.b(!0, !0, !0)}).catch(()=>{}));return''})()
]
`,
});

client.login();
