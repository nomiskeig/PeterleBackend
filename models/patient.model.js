const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Patient = new Schema({
	_id: Number,
	privat: Boolean,

	allgemein: {
		vorname: String,
		nachname: String,
		alter: Number,
		gebdatum: Date,
		addresse: {
			straße: String,
			hausnummer: Number,
			plz: Number,
			ort: String
		},
		nummern: {
			mobil: Number,
			privat: Number,
			arbeit: Number
		},
		rechnungsempfaenger: String,
		bemerkungen: String,
		krankheiten: String
	},
	behandlungen: [
		{
			_id: Number,
			datum: Date,
			art: String,
			maßnahme: String,
			mittel: String,
			notiz: String,
			beobachten: String,
			behandlung: String
		}
	]
});

module.exports = mongoose.model("Patient", Patient);
