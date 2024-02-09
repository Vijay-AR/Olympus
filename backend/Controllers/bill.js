const Bill = require('../models/bills')


async function add(req, res) {
    try {
        const { userId, title, amount, toWhom, currency, recurring, duedate } = req.body;
        const savingData = new Bill({ userId, title, amount, toWhom, currency, recurring, duedate });
        await savingData.save();
        res.status(200).json({ message: "Data Saved" });
    } catch (err) {
        console.error(err);
        return res.json({ message: "Server Error, adding bill" }).status(500);
    }
}

async function get(req, res) {
    const { userId } = req.params;
    try {
        const billDetail = await Bill.findOne({ userId: userId }, { userId: -1 });
        if (!billDetail)
            return res.json({ message: "No bill found" });
        res.json({ billDetail, message: "Bill data is fetched" }).status(200);
    } catch (err) {
        console.error(err);
        return res
            .json({ message: "Server Error, getting the bill" })
            .status(500);
    }
}

async function edit(req, res) {
    const { id } = req.params;
    try {
        const editDetail = await Bill.findOneAndUpdate(
            { _id: id },
            { $set: req.body.BillInput },
            { new: true, upsert: true }
        );
        res.json({ editDetail, message: "Bill Detail is editted" }).status(200);
    } catch (err) {
        console.error(err);
        return res.json({ message: "Server Error, editBill" }).status(500);
    }
}

async function del(req, res) {
    const { id } = req.params;
    try {
        const delDetail = await Bill.findOneAndDelete({ _id: id });
        res.json({ message: "Bill detail is deleted" }).status(200);
    } catch (err) {
        console.error(err);
        return res.json({ message: "Server Error, deleteBill" }).status(500);
    }
}


module.exports = {add, get, del, edit}