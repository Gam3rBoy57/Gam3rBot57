const Discord = require('discord.js');
const bot = new Discord.Client();
const token = 'NjY3MzYxMDE0NTg0NzA1MDI0.XiBmiQ.46AF7SYyZXFHQWSXyTOMxRpCLmo';
const Prefix = '=';
const ytdl = require("ytdl-core");
const Invite = 'https://discordapp.com/oauth2/authorize?client_id=667361014584705024&scope=bot&permissions=8'
var servers = {};


bot.on('ready', () =>{
    console.log('Dieser Bot ist online!');
    bot.user.setActivity('AuF sEiNeN bOsSツ', {
        type: 'LISTENING'
    });
});


bot.on('message', msg=>{
    if(msg.content === "Hi"){
        msg.reply('Hallo mein Freund! :)');
    }
})

bot.on('message', msg=>{
    if(msg.content === "hi"){
        msg.reply('Hallo mein Freund! :)');
    }
})


bot.on('message', message=>{

    let args = message.content.substring(Prefix.length).split(" ");

    switch(args[0]){
        case 'ping':
            message.channel.sendMessage('Pong!')
            break;
        case 'gilde':
            message.channel.sendMessage('Unsere Gilde auf Hypixel heißt: 7c')
            break;
        case 'schmutz':
            if(!args[1]) return message.reply('Error! Bitte definiere eine Zahl!')
            message.channel.bulkDelete(args[1]);
            break;
        case 'link':
            message.channel.sendMessage('Du kannst mich mit diesem Link auf einen anderen Server einladen!')
            message.channel.sendMessage(Invite);
            break;
        case 'play':

            function play(connection, message){
                var server = servers[message.guild.id];
                message.channel.send("Joine dem Sprach-Channel...")
                message.channel.send("Spiele Musik ab...")
                server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}, {audiorate}));

                server.queue.shift();

                server.dispatcher.on("end", function(){
                    if(server.queue[0]){
                        play(connection, message);
                    }else {
                        connection.disconnect();
                    }
                })


            }

            if(!args[1]){
                message.channel.send("Du musst einen Link eingeben!");
                return;
            }

            if(!message.member.voiceChannel){
                message.channel.send("Du musst dich in einem Sprach-Channel befinden um den Bot herbei zu rufen!");
                return;
            }

            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            }

            var server = servers[message.guild.id];

            server.queue.push(args[1]);

            if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection){
                play(connection, message);
            })





            break;

            case 'skip':
                var server = servers[message.guild.id];
                if(server.dispatcher) server.dispatcher.end();
                message.channel.send("Überspringe den Song...")
                break;

            case 'stop':
                var server = servers[message.guild.id];
                if(message.guild.voiceConnection){
                    for(var i = server.queue.length -1; i >=0; i--){
                        server.queue.splice(i, 1);
                    }

                    server.dispatcher.end();
                    message.channel.send("Beende die Musikliste...")
                    message.channel.send("Verlasse den Sprach-Channel...")
                    console.log('stopped the queue')
                }

                if(message.guild.connection) message.guild.voiceConnection.disconnect();

            break;


        case 'commands':
            message.channel.sendMessage('Commands: ping ; gilde ; über ; löschen (Admintool) ;')
            break;
        }
})

bot.login(token);