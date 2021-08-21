const Discord = require('discord.js');//Requerimos la librería de Discord.

module.exports = {
    name: 'ping',
    description: 'Pong..',
    /**
    *Este sería un ejemplo de como implementar las opciones.
    options: [
        {
        name: 'nombre',//Es importante que esté todo en minúsculas.
        description: 'Tu nombre.',
        required: true,//Si es requerido, lo va a pedir obligatoriamente.
        type: 3, // string
        },
        {
        name: 'edad',
        description: 'Tu edad.',
        required: false,
        type: 4, // integer - No podrá ser un string, debe ser valor númerico
        },
        ],
    */
    run: async (client, interaction, reply, args) => {
        reply(interaction, 'pong!');//Es importante que al inicio siempre lleve el parámetro de la interacción y el segundo el contenido de la respuesta al interactuar.
        /**Para un embed, debes crear el embed y agregarlo en el parámetro.
        * reply(interaction, new Discord.MessageEmbed().setDescription('pong!'));
        */
    },
};
