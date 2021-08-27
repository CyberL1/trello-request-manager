module.exports = client => {
    console.log("ready");
    client.user.setActivity('User requests', {type: "WATCHING"});
}