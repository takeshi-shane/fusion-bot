const Discord = require('discord.js');
const client = new Discord.Client();

const config = require("./config.json");
var query = require('samp-query');

const server_status = {
    total_users_ID: '487210345702621184',
    member_count_ID: '487210346424172544',
    bot_count_ID: '570627933337681939'
}

let cooldown = new Set();
let cdseconds = 180;

client.on('ready', () => {
    console.log('I am online now!');
	
    var raportCNL = client.channels.find(channel => channel.id === '576392140389744653');
    setInterval(() => {
	raportCNL.send("---------------------");
	setTimeout(function() { GetServerPlayers(raportCNL, "193.203.39.36", 'Nephrite') }, 1500)
    	setTimeout(function() { GetServerPlayers(raportCNL, "193.203.39.49", 'OG-Times') }, 2000)
	setTimeout(function() { GetServerPlayers(raportCNL, "193.203.39.13", 'B-Zone (RPG1)') }, 3000)
	setTimeout(function() { GetServerPlayers(raportCNL, "193.203.39.46", 'B-Hood') }, 4000)    
    }, 86400000);
})

client.on('guildMemberAdd', member => {
    let join_channel = client.channels.get('576392140389744653')
    join_channel.send(`**[+]** Alo verutziii! ${member} s-a alaturat acestui grup!`);

    const embed = new Discord.RichEmbed()
        .setAuthor(`Bine ai venit in clubul The Fusion, ${member.displayName}!`)
        .setDescription('**Iti uram sedere placuta alaturi de noi.\nDaca ai intrebari, ni le poti adresa pe chatul <#general>.\n\nO zi/seara/dimineata placuta :wink:!**')
        .setThumbnail('https://cdn.discordapp.com/icons/285793218023653376/7301f7da88defd2d47f18879fd3b8577.jpg')
        .setColor('#3388d2')
        .setTimestamp()
        .setFooter('joined', 'https://cdn.discordapp.com/icons/285793218023653376/7301f7da88defd2d47f18879fd3b8577.jpg');
    member.user.send(embed);

    //server status
    let users_channel = client.channels.get(server_status.total_users_ID)
    users_channel.setName(`total members: ${member.guild.memberCount}`);
    let human_channel = client.channels.get(server_status.member_count_ID)
    human_channel.setName(`human count: ${member.guild.members.filter(m => !m.user.bot).size}`);
    let bot_channel = client.channels.get(server_status.bot_count_ID)
    bot_channel.setName(`bot count: ${member.guild.members.filter(m => m.user.bot).size}`);
})

client.on('guildMemberRemove', member => {
    //server status
    let users_channel = client.channels.get(server_status.total_users_ID)
    users_channel.setName(`total members: ${member.guild.memberCount}`);
    let human_channel = client.channels.get(server_status.member_count_ID)
    human_channel.setName(`human count: ${member.guild.members.filter(m => !m.user.bot).size}`);
    let bot_channel = client.channels.get(server_status.bot_count_ID)
    bot_channel.setName(`bot count: ${member.guild.members.filter(m => m.user.bot).size}`);
})

client.on('message', msg => {
    if(msg.content === "Salut") {
        if(cooldown.has(msg.author.id)) return;
        msg.channel.send('Salutare!');
        
        cooldown.add(msg.author.id);   

        setTimeout(() => {
            cooldown.delete(msg.author.id)  
        }, cdseconds * 1000)
    }
  
    if(msg.content.indexOf(config.prefix) !== 0) return;
    const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase()

    if(command === "ads") {
        if(!msg.member.permissions.has('ADMINISTRATOR')) return msg.reply("nu ai acces la aceasta comanda!");
        let message_channel = msg.mentions.channels.first();
        if(message_channel) {
            let embed = new Discord.RichEmbed()
            .setAuthor('Announcements:')
            .setDescription('Sustine serverul de discord cu o distribuire a urmatorului link:\nInvite: https://discord.gg/DsWCJDa')
            .setColor('#AB51A1')
            msg.delete();
            message_channel.send(embed);
        } else {
            let embed = new Discord.RichEmbed()
            .setAuthor('Announcements:')
            .setDescription('Sustine serverul de discord cu o distribuire a urmatorului link:\nInvite: https://discord.gg/DsWCJDa')
            .setColor('#AB51A1')
            msg.delete();
            msg.channel.send(embed);
        }
    }
    else if(command === "cc") {
        if(msg.member.hasPermission("MANAGE_MESSAGES")) {
            msg.channel.fetchMessages()
               .then(function(list) {
                    msg.channel.bulkDelete(list);
                    msg.reply("chat cleared!");
            }, function(err){msg.channel.send("Eroare: Nu pot sterge mesajele acestui canal.")})                        
        } else { msg.reply("nu ai acces la aceasta comanda!"); }
    }
    else if(command === "servers") {
    	if(!msg.member.permissions.has('MANAGE_MESSAGES')) return msg.reply("nu ai acces la aceasta comanda!");
	setTimeout(function() { GetServerPlayers(msg, "193.203.39.36", 'Nephrite') }, 1000)
    	setTimeout(function() { GetServerPlayers(msg, "193.203.39.49", 'OG-Times') }, 2000)
	setTimeout(function() { GetServerPlayers(msg, "193.203.39.13", 'B-Zone (RPG1)') }, 3000)
	setTimeout(function() { GetServerPlayers(msg, "193.203.39.46", 'B-Hood') }, 4000)
    }
    else if(command === "testanno") {
	msg.channel.send({files: ["./images/anno.png"]});    
    }
})

function GetServerPlayers(msg, ip, sv_name) {
	var options = { host: ip }
	query(options, function (error, response) {
	    if(error) msg.send(`**${sv_name}**: Can't get result!`);
	    else msg.send(`**${sv_name}**: ${response['online']}/${response['maxplayers']}`);
	})
}

client.login(process.env.TOKEN);
