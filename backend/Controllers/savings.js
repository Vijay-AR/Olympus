const Savings = require("../models/savings");

async function add(req, res) {
    try {
        const { userId, targetAmt, currency, currAmt } = req.body;
        const savingData = new Savings({ userId, targetAmt, currency, currAmt });
        await savingData.save();
        res.status(200).json({ message: "Data Saved" });
    } catch (err) {
        console.error(err);
        return res.json({ message: "Server Error, addsaving" }).status(500);
    }
}

async function get(req, res) {
    const { userId } = req.params;
    try {
        const savingDetail = await Savings.find({ userId: userId }, { userId: -1 });
        if (!savingDetail)
            return res.json({ message: "No saving found" });
        res.json({ savingDetail, message: "Saving data is fetched" }).status(200);
    } catch (err) {
        console.error(err);
        return res
            .json({ message: "Server Error, getting the saving" })
            .status(500);
    }
}

async function edit(req, res) {
    const { id } = req.params;
    try {
        const editDetail = await Savings.findOneAndUpdate(
            { _id: id },
            { $set: req.body.requestBody },
            { new: true, upsert: true }
        );
        res.json({ editDetail, message: "Saving Detail is editted" }).status(200);
    } catch (err) {
        console.error(err);
        return res.json({ message: "Server Error, editSaving" }).status(500);
    }
}

async function del(req, res) {
    const { id } = req.params;
    try {
        const delDetail = await Savings.findOneAndDelete({ _id: id });
        res.json({ message: "Saving Detail is deleted" }).status(200);
    } catch (err) {
        console.error(err);
        return res.json({ message: "Server Error, deleteSaving" }).status(500);
    }
}


module.exports = {add, get, del, edit}