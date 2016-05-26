var mqtt = require('mqtt');
var mqtt_config = require('../config/mqtt.js')();
var mqtt_client = mqtt.connect(mqtt_config.host, { username: mqtt_config.username, password: mqtt_config.password });

String.prototype.endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

module.exports = function Mqtt(database) {
    mqtt_client.subscribe("salwatorska6/+/status");
    mqtt_client.subscribe("salwatorska6/+/control");
    mqtt_client.subscribe("salwatorska6/+");
    mqtt_client.on('message', function (topic, message) {
        try {
            var json_message = JSON.parse(message);
            if (topic.endsWith('status')) {
                json_message = { 'activator': json_message.activator, 'actuator': json_message.actuator };
            }
            if (topic.endsWith('control')) {
                json_message = { 'actuator': json_message.actuator };
            }
            cleanJson(json_message);
 //           console.log(json_message);
            database.insertNewEvent(topic, JSON.stringify(json_message), function (result) {
                mqtt_client.publish("salwatorska6/firstfloor/event", JSON.stringify(result[0].insert_event), { 'qos': 1, 'retain': true }, function () { });
            });
        } catch (err) { console.log(err) };

    });

    return {
        get_client: function () {
            return mqtt_client;
        }
    }
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
        }
        else if (typeof obj[k] == "object") {
            if (Object.getOwnPropertyNames(obj[k]).length == 0) {
                delete obj[k];
            } else {
                cleanJson(obj[k]);
                if (Object.getOwnPropertyNames(obj[k]).length == 0) {
                    delete obj[k];
                }
            }
        }
    }
}




