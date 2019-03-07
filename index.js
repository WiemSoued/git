const mongoose = require("mongoose");
const express = require("express");
const app = express();

////////////////////////////////CONNECXION ///////////////////

mongoose
  .connect("mongodb://localhost/personne")
  .then(console.log("CONNECTED SUCCEFULY ....."))
  .catch(error => console.log("COULD NOT CONNECT TO DATABASE.....", error));

//////////////////////////////SCHEMA //////////////////////////

const personneSchema = mongoose.Schema({
  name: { type: String, required: true /*, minlength : 2 , maxlength : 20*/ },
  age: Number,
  hobbies: {
    type: String,
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: "HOBBIES SHOULD NOT BE EMPTY ..."
    }
  }
});

//////////////////////MODELE/////////////////////////////////////////

const Personne = mongoose.model("personne", personneSchema);
async function createData() {
  const personne = new Personne({
    name: "wafa",
    age: 31,
    hobbies: ["Working"],
    //lowercase : true ,
    upercase: true,
    trim: true
  });

  try {
    const result = await personne.save();
    console.log(result);
  } catch (ex) {
    for (field in ex.errors) console.log(ex.errors[field]);
  }
}

/////////////////////////////GET DATA /////////////////////////////

async function getData() {
  const personnes = await Personne.find();
  //.find({hobbies : $in ['sleeping','eating']})
  //.sort({name : 1})
  //.or([{hobbies :'sleeping '} ,{ hobbies :'eating'}])
  //.and ({name : /.*w.*/i})
  //.populate('name')
  console.log(personnes);
}

///////////////////////////////UPDATE DATA /////////////////////////////

async function updateData(id) {
  const personne = await Personne.findById(id);
  if (!personne)
    return console.log("COULD NOT FIND PERSON WITH THE FOLLOWING ID ......");
  personne.age = 23;
  const result = await personne
    .save()
    .then(console.log("DATA UPDATED SUCCEFULT....."));
  console.log(result);
}

/////////////////////////AN OTHER METHODE FOR UPDATE/////////////////////////

async function updateData2(id) {
  const result = await Personne.update(
    { _id: id },
    {
      $set: {
        name: "Rabiaa",
        age: 53
      }
    }
  );
  Console.log(result);
}

///////////////////////////////FIND  BY ID AND UPDATE///////////////////////:

async function updateData3(id) {
  const result = await Personne.findByIdAndUpdate(
    id,
    {
      $set: {
        name: "Rabiaa",
        age: 55
      }
    },
    { new: true }
  );
  Console.log(result);
}

///////////////// REMOVING ONE DOCUMENT ////////////////////

async function removeOneDocument(id) {
  const result = await Personne.deleteOne({ _id: id })
    .then(console.log("DELETED SUCCEFULY"))
    .catch(error => console.log("COULD NOT DELETE DOCUEMENT", error));
  console.log(result);
}

/////////////////////REMOVING MANY DOCUMENTS ////////////////////

async function removeManyDocuments(id) {
  const result = await Personne.deleteMany({ _id: id })
    .then(console.log("DELETED SUCCEFULY"))
    .catch(error => console.log("COULD NOT DELETE DOCUEMENT", error));
  console.log(result);
}

////////////////GET ALL PERSONS API//////////////////////////////////////////

app.get("/personnes", async (req, res) => {
  const personnes = await Personne.find();
  res.send(personnes);
});

///////////////////////// GET A PERSON BY ID //////////////////////////

app.get("/:id", async (req, res) => {
  const personne = await Personne.findById(req.params.id);
  res.send(personne);
});

///////////////////// UPDATE A PERSON ///////////////////////

///NOT WORKING
// app.put("/update/:id", async (req, res) => {
//   console.log(req.body);
//   const personne = await Personne.findByIdAndUpdate(
//     { _id: req.params.id },
//     {
//       $set: {
//         age: req.body.age,
//         new: true
//       }
//     }
//   );
//   if (!personne)
//     return res
//       .status(404)
//       .send("COULD NOT UPDATE PERSON , PERSON DOES NOT EXIST .... ");

//   personne.age = req.body.age;
//   res.send(personne);
// });
// app.put("/update/:id", (req, res) => {
//   Personne.update({ _id: req.params.id }, req.body).then(function() {
//     Personne.findOne({ _id: req.params.id }).then(function(personne) {
//       res.send(personne);
//     });
//   });
// });

app.put("/update/:id", function(req, res) {
  Personne.findById({ _id: req.params.id }, function(err, Personne) {
    console.log(Personne.age);
    if (err) throw err;
    Personne.age = 20;
    console.log(req.query.age);
    Personne.save(function(err, result) {
      if (err) throw err;
      res.send(result);
      console.log(" Personne updated successfully");
    });
  });
});

////////////////////// DELETE A PERSON BY ID ///////////////////

app.delete("/delete/:id", async (req, res) => {
  const personne = await Personne.findByIdAndDelete(req.params.id);
  if (!personne)
    return res
      .status(404)
      .send("COULD NOT DELETE PERSON , PERSON DOES NOT EXIST .... ");
  res.send(personne);
});

///////////////////////////PORT ///////////////////////////////

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

///////////////// GEOLOCATION ////////////////////////////////

function geo() {
  navigator.geolocation.getCurrentPosition(showMap);
}

////////////APPELLES//////////////////////////////////////////////

//createData() ;
getData();
//updateData('5c6e7800fd8dab4d840b8b71');
//updateData2('5c6e78bb1628ac5a74a9477c');
//updateData3('5c6e78bb1628ac5a74a9477c');
//removeOneDocument('5c6e7800fd8dab4d840b8b71');
//removeManyDocuments('5c6e7822df43033d0c9e6b51');
