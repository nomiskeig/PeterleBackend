const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const Routes = express.Router();
const PORT = 4000;

let Patient = require("./models/patient.model");

app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://127.0.0.1:27017/peterle", {
	useNewUrlParser: true
});

const connection = mongoose.connection;
connection.once("open", () =>
	console.log("MongoDB Datenbank ist erfolgreich verbunden")
);

Routes.route("/").get((req, res) => {
	Patient.find((err, patienten) => {
		if (err) {
			console.log(err);
		} else {
			res.json(patienten);
		}
	});
});

Routes.route("/get/:id").get((req, res) => {
	let id = req.params.id;
	Patient.findById(id, (err, patient) => {
		res.json(patient);
	});
});

Routes.route("/get/behandlungen/:id").get((req, res) => {
	let id = req.params.id;
	Patient.findById(id, (err, patient) => {
		res.json(patient.behandlungen);
	});
});

Routes.route("/add/behandlung/:id").post((req, res) => {
	let behandlung = req.body;
	let id = req.params.id;
	Patient.findByIdAndUpdate(
		{ _id: id },
		{ $push: { behandlungen: behandlung } },
		{ useFindAndModify: false },
		(err, result) => {
			if (err) res.send("Fehler");
			else res.send("Behandlung erfolgreich hinzugefügt");
		}
	);
	//res.send("Behandlung erfolgreich hinzugefügt");
});

Routes.route("/remove/behandlung/:patientid/:behandlungid").post((req, res) => {
	let patientid = req.params.patientid;
	let behandlungid = req.params.behandlungid;

	Patient.findByIdAndUpdate(
		{ _id: patientid },
		{ $pull: { behandlungen: { _id: behandlungid } } },
		(err, result) => {
			if (err) res.send("Fehler: " + err);
			else res.send("Behandlung erfolgreich gelöscht");
		}
	);
});

Routes.route("/addPatient").post((req, res) => {
	let patient = new Patient(req.body);
	patient
		.save()
		.then(patient => {
			res.status(200).send("Patient erfolgreich hinzugefügt");
		})
		.catch(err => {
			res.status(400).send("Hinzufügen ist fehlgeschlagen");
		});
});

function getNextID(sequenceName) {
	var sequenceDocument = Connection.db.couters.findAndModify({
		query: { _id: sequenceName },
		update: { $inc: { sequence_value: 1 } },
		new: true
	});
	return sequenceDocument.sequence_value;
}

app.use("/api/patienten", Routes);

app.listen(PORT, () => console.log("Server läuft auf Port " + PORT));
