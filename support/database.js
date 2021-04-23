const mongoose = require(`mongoose`);

mongoose.connect('mongodb+srv://ImpostorBot:rSDhdzPFtLbkofgy@cluster0.scips.mongodb.net/database', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

const claimsSchema = new mongoose.Schema({
    _id: String,
    voiceId: String,
    chatChannelId: String,
    channelId: String,
    code: String
});

try { exports.claims = mongoose.model('Claims', claimsSchema); }
catch { };

exports.fetch = async (model, obj) => {
    let rtn;
    await model.findOne(obj).then(d => rtn = d);
    return rtn;
};