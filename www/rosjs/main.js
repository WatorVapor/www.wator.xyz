import ROSLIB from 'https://cdn.jsdelivr.net/npm/roslib@1.3.0/+esm';
console.log(':::ROSLIB=<',ROSLIB,'>');
const rosConfig = {};
console.log(':::ROSLIB.Ros=<',ROSLIB.Ros,'>');
console.log(':::ROSLIB.Topic=<',ROSLIB.Topic,'>');

const ros =  new ROSLIB.Ros(rosConfig);
console.log(':::ros=<',ros,'>');

ros.sendEncodedMessage = (messageEncoded) => {
  console.log('::sendEncodedMessage:messageEncoded=<',messageEncoded,'>');
}
ros.getTopics((topics)=>{
  console.log('::getTopics:topics=<',topics,'>');  
});
const topicVelConf = {
  ros : ros,
  name : '/cmd_vel',
  messageType : 'geometry_msgs/Twist'
};
const cmdVel = new ROSLIB.Topic(topicVelConf);
console.log(':::cmdVel=<',cmdVel,'>');

const msgTwist = {
  linear : {
   x : 0.1,
   y : 0.2,
   z : 0.3
  },
  angular : {
   x : -0.1,
   y : -0.2,
   z : -0.3
  }
};

const twist = new ROSLIB.Message(msgTwist);
console.log(':::twist=<',twist,'>');
cmdVel.publish(twist);

const topicOdomConf = {
  ros: ros,
  name: '/odom',
  messageType: 'nav_msgs/Odometry'
};
const odom = new ROSLIB.Topic(topicOdomConf);
odom.subscribe((odomMsg) => {
  console.log('::subscribe:odomMsg=<',odomMsg,'>');
});
