var mqtt = require('mqtt');
var mqtt_client = mqtt.connect('mqtt://192.168.0.102');
var database;
var socket;

module.exports.init = function (db) {
    database = db;
}

var cleanJson = function (obj) {
    var isArray = obj instanceof Array;
    for (var k in obj) {
        if ((obj[k] == null) || (obj[k] == false)) {
            if (isArray) {
                if (obj[k].length > 0) {
                    obj.splice(k, 1)
                } else {
                    delete obj[k];
                }
            } else {
                delete obj[k];
            }
        } else if (typeof obj[k] == "object") {
            cleanJson(obj[k]);
            if (Object.getOwnPropertyNames(obj[k]).length == 0) {
                delete obj[k];
            }
        }
    }
}

module.exports.relayEvent = function (data) {
    mqtt_client.publish("smartbuidling/firstfloor/status", data, {'qos':1,'retain':true}, function () {
    });
    data = JSON.parse(data)
    cleanJson(data);
    console.log("aaa"+JSON.stringify({'activator':data.activator,'actuator':data.actuator}));
    database.insertNewEvent("smartbuidling/firstfloor/status",JSON.stringify({'activator':data.activator,'actuator':data.actuator}), function (result){
        mqtt_client.publish("smartbuidling/firstfloor/event", JSON.stringify(result[0].insert_event), {'qos':1,'retain':true}, function () {});
    });
}

module.exports.relayControl = function (callback) {
    mqtt_client.subscribe("smartbuidling/firstfloor/control")
    mqtt_client.on('message', function (topic, message) {
        callback(message.toString());
        database.insertNewEvent(topic,message, function (result){
            mqtt_client.publish("smartbuidling/firstfloor/event", JSON.stringify(result[0].insert_event), {'qos':1,'retain':true}, function () {});
        });
    });
}


