const eventCreate = (msg, args) => {
    console.log("DEBUG: eventCreate function");
    msg.channel.send("DEBUG: eventCreate function");
};
const eventAttend = (msg, args) => {
    console.log("DEBUG: eventAttend function");
    msg.channel.send("DEBUG: eventAttend function");
};
const eventCancel = (msg, args) => {
    console.log("DEBUG: eventCancel function");
    msg.channel.send("DEBUG: eventCancel function");
};
const eventDelete = (msg, args) => {
    console.log("DEBUG: eventDelete function");
    msg.channel.send("DEBUG: eventDelete function");
};
const eventModify = (msg, args) => {
    console.log("DEBUG: eventModify function");
    msg.channel.send("DEBUG: eventModify function");
};
const eventList = (msg, args) => {    
    console.log("DEBUG: eventList function");
    msg.channel.send("DEBUG: eventList function");
};

exports.run = (client, message, args) => {
    let subcommand = args[0];
    switch (subcommand) {
        case "create" :
             eventCreate(message, args);
             break;
        case "attend" :
            eventAttend(message, args);
            break;
        case "cancel" :
            eventCancel(message, args);
            break;
        case "delete" :
            eventDelete(message, args);
            break;
        case "modify" :
            eventModify(message, args);
            break;
        case "list" :
            eventList(message, args);
            break;
    }
}
