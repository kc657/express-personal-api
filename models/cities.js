var mongoose = require ('mongoose'),
    Schema = mongoose.Schema



var CitiesSchema = new Schema ({
  name: String,
  lat: Number,
  long: Number
})

var Cities = mongoose.model('Cities', CitiesSchema)
module.exports = Cities
