const moment = require('moment')
function formatMessage(username,text){
    return {
        username,
        text,
        time: moment().format('h:mm a') // pour avoir le temps au format heure:minite AM/PM
    }
}

module.exports=formatMessage;