/**Puntos a tener en cuenta:
* Recuerda invitar al bot con el scope: Application.commands
* ClientID = El ID de tu bot.
* GuildID = El ID del servidor.
*/
const fs = require('fs') //fs
const Discord = require('discord.js);//Necesitas la librería de Discord, (v12.5.3).
const client = new Discord.Client();

client.slash = new Discord.Collection();//Aquí almacenaremos los comandos en barra.

client.on('ready', () => {
    console.log('Slash commands example ready.');
});

const slashFolders = fs.readdirSync('./slashCmds');//Debes crear un directorio en dónde se encontraran los comandos en barra.

//Hacemos dos for loop para tomar las carpetas y de esas carpetas los archivos que contienen el código del comando.
for (const slashFolder of slashFolders) {
const slashFiles = fs.readdirSync(`./slashCmds/${slashFolder}`).filter((file) => file.endsWith(".js"));
  
for (const slashFile of slashFiles) {
  
  let slashCommand = require(__dirname + '/slashCmds/' + slashFolder + `/${slashFile}`);//Acá obtenemos las propiedades de el archivo del código tomado.
  let dat = { name: slashCommand.name, description: slashCommand.description };//Este será el dato por defecto.
  if (slashCommand.options) dat = { name: slashCommand.name, description: slashCommand.description, options: slashCommand.options };//Si hay argumentos de opciones, agregaremos esa propiedad.
 
  client.slash.set(slashCommand.name, slashCommand);//Agregamos el slash a la colección del Discord.
  client.api.applications("ClientID").commands.post({ data: dat });//Crearemos el comando (De manera global en este ejemplo, también puedes hacerlo por servidores).
  /**
  * En caso de que quieras agregarlo con servidores, reemplaza la linea anterior por esta:
  client.api.applications("ClientID").guilds("GuildID").commands.post({ data: data });
  */
    };
};

//Crearemos una función flecha o como gustes, en este caso con los parámetros de la interacción que recibimos del evento y el contenido del mensaje.
const createAPIMessage = async (interaction, content) => {
   const { data, files } = await Discord.APIMessage.create(
     client.channels.resolve(interaction.channel_id),
     content).resolveData().resolveFiles()
     return { ...data, files }
 };

//Creo otra función flecha para responder a la interacción del Slash.
const reply = async (interaction, response) => {
   let data = {
     content: response,
    };
  //Si el contenido del mensaje es un object, con esto chequearemos que es un embed y crearemos el mensaje desde la Api de Discord como si fuera un mensaje con la función que hicimos anteriormente.
   if (typeof response === 'object') {
    data = await createAPIMessage(interaction, response);
   };
   client.api.interactions(interaction.id, interaction.token).callback.post({
       data: {
         type: 4,
         data,
        },
      })//Y con esto respondemos a la interacción.
  };

//Ahora creamos un evento
client.ws.on('INTERACTION_CREATE', async (interaction) => {
  if (interaction.type != 2) return;//Haremos una condición para chequear si la interacción no es igual a un comando en barra para retornar nada.
  const { name, options } = interaction.data;//Obtenemos esas dos propiedades que ocuparemos de la propiedad de la interacción creada.
  const args = {};

  if (options) {
    for (const option of options) {
    const { name, value } = option
    args[name] = value
    }
  }//Chequeamos si la interacción del evento tiene opciones y agregamos los argumentos que trae la interacción.

  const command = client.slash.get(name);//Obtenemos el comando de la interacción creada.
  if(!command) return;//Si no está en la colección del Discord, retornamos nada.
  try {
    command.run(client, interaction, reply, args);//Intentamos correr el comando con los parámetros.
  } catch (error) {
    console.error(error);//Si no se pudo correr, mandará un error.
  };
});

client.login('token')
