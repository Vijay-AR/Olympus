const Transaction = require("../models/trans");

const addTrans = async (req, res) => {
  const { type, amount, currency, category, desc, date } = req.body;

  const detail = { type, amount, currency, category, desc, date };

  const transaction = new Transaction(detail);

  try {
    await transaction.save();
    res
      .status(200)
      .json({ message: "Transaction saved successfully", transaction });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error at adding Transaction" });
  }
};

const getTrans = async (req, res) => {
  const { userId } = req.param;

  try {
    const transaction = await Transaction.findOne({ userId: userId }, {userId: -1}).exec();
    res.json({ transaction }).status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error at fetching Transaction" });
  }
}

const editTrans = async(req, res)=>{
    const {id} = req.param
    try {

        const transaction = await Transaction.findById({id})
        if(!transaction) return res.status(404).json({message: "Unable to fetch the give transaction detail"})

        const newtran = await Transaction.findByIdAndUpdate(id,{
            $set:req.body.transInput
        },{new:true})


        if(!newtran) return res.status(404).json({meassage : "Transaction not found"})

        res.json(newtran)


    } catch (error) {
        console.error(error)
        res.status(500).json({message :"Server error at editing transaction"})
    }
}



const deleteTrans = async(req, res)=>{
    const {id} = req.param
    try{
        const transaction = await Transaction.find({id})
        if(!transaction) return res.status(404).json({message: "Unable to fetch the given transaction"})
        const deleted = await Transaction.findByIdAndDelete({id})
        res.staus(200).json({message: "Deleted Succesfully"})
    }catch(error){
        console.error(error)
        res.status(500).json({message: "Server error at deleting the transaction"})
    }
}

module.exports = {getTrans, editTrans, deleteTrans, addTrans}