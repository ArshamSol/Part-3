const mongoose = require('mongoose')

mongoose.set('strictQuery', false)


const url = process.env.MONGODB_URI


//console.log('connecting to', url)

mongoose.connect(url)

  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const phonebookSchema = new mongoose.Schema({
  //id: Number,
  name:{
    type: String,
    minLength: 3,
    required: true
  },
  number:
    {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          // Regular expression to match the phone number pattern
          const phoneRegex = /^\d{2,3}-\d+$/;
          return phoneRegex.test(value);
        },
        message: props => `${props.value} is not a valid phone number!`
      }
    }
})


phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Phonebook', phonebookSchema)
