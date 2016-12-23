module.exports = function(RED) {
  'use strict';

  var Apiai = require('apiai');

  function ApiaiAgentNode(n) {
    RED.nodes.createNode(this,n);
    if(this.credentials) {
      this.accessToken = this.credentials.accessToken;
    }
    this.apiai = Apiai(this.accessToken);
  }

  RED.nodes.registerType('apiai-agent', ApiaiAgentNode, {
    credentials: {
      accessToken: {type: 'text'}
    }
  });

  function ApiaiTextRequestNode(n) {
    RED.nodes.createNode(this,n);
    var node = this;
    this.agent = RED.nodes.getNode(n.agent);
    if(!this.agent) {
      this.error(RED._('Missing Api.ai agent'));
      return;
    }

    this.on('input', function(msg){
      var options = msg.options || {};
      options.sessionId = options.sessionId || 'nodered_' + (1+Math.random()*4294967295).toString(16);
      var request = this.agent.apiai.textRequest(msg.payload, options);
      node.status({fill: 'yellow', shape: 'dot', text: 'requesting'});


      request.on('response', function(response){
        
        msg._apiai = response;
        if(response.result) {
          if(response.result.action) {
            msg.action = response.result.action;
          }
          if(response.result.fulfillment && response.result.fulfillment.speech ) {
            msg.payload = response.result.fulfillment.speech;
          }
        }
        node.send([msg, null]);
        node.status({});
      });

      request.on('error', function(error){
        msg.error = error;
        node.send([null,msg]);
        node.status({});
      });

      request.end();

    });
  }

  RED.nodes.registerType('apiai-text', ApiaiTextRequestNode);

  function ApiaiEventRequestNode(n) {
    RED.nodes.createNode(this,n);
    var node = this;
    this.agent = RED.nodes.getNode(n.agent);
    if(!this.agent) {
      this.error(RED._('Missing Api.ai agent'));
      return;
    }
   this.eventname = n.eventname;

    if(!this.eventname){
      this.error(RED._('Missing Api.ai event name'));
      return;

    }

    this.on('input', function(msg){
      var options = msg.options || {};
      options.sessionId = options.sessionId || 'nodered_' + (1+Math.random()*4294967295).toString(16);

      var eventPayload = {};


      eventPayload.name = this.eventname;
      eventPayload.data = msg.payload;

      var request = this.agent.apiai.eventRequest(eventPayload,options);

      console.log(" sending " + request.event );
      node.status({fill: 'yellow', shape: 'dot', text: 'requesting'});


      request.on('response', function(response){

        msg._apiai = response;
        if(response.result) {
          if(response.result.action) {
            msg.action = response.result.action;
          }
          if(response.result.fulfillment && response.result.fulfillment.speech ) {
            msg.payload = response.result.fulfillment.speech;
          }
        }
        node.send([msg, null]);
        node.status({});
      });

      request.on('error', function(error){
        console.log("api.ai get error")
        msg.error = error;
        node.send([null,msg]);
        node.status({});
      });

      request.end();

    });
  }

  RED.nodes.registerType('apiai-event', ApiaiEventRequestNode);


  function ApiaiVoiceRequestNode(n) {

  }
};
