const user = require("../models/user.js");
const group = require("../models/group.js");
const Splitwise = require("splitwise-js-map");

const creategroup = async (req, res) => {
  const { userId, title } = req.body.groupInput;
  const newgroup = new group(req.body.groupInput);
  try {
    console.log("userid 12: ", userId);
    newgroup.members.push(userId);
    const updatedgroup = await group.findByIdAndUpdate(
      newgroup._id,
      { $push: { members: userId } },
      { new: true }
    );
    const userr = await user.findByIdAndUpdate(
      userId,
      { $push: { groups: newgroup._id } },
      { new: true }
    );
    await newgroup.save();
    res.status(200).json({ newgroup });
  } catch (err) {
    next(err);
    console.log(err);
  }
};

const getDebts = async (req, res) => {
  const { groupId } = req.params;

  try {
    const grp = await group.findById(groupId);
    console.log("getDebts:", grp);
    res.status(200).json(grp.simplifyDebt);
  } catch (err) {
    console.log(err);
  }
};

const joingroup = async (req, res) => {
  // console.log(req.body.joinCode)
  const { userId, JoingCode } = req.body.joinCode;
  const existgroup = await group.findOne({ groupCode: JoingCode });
  if (!existgroup) {
    return res.status(404).json({ message: "Group not found" });
  }
  if (existgroup.members.includes(userId)) {
    return res
      .status(400)
      .json({ message: "User is already a member of this group" });
  }
  const newgroup = await group.findByIdAndUpdate(
    existgroup._id,
    { $push: { members: userId } },
    { new: true }
  );
  const userr = await user.findByIdAndUpdate(
    userId,
    { $push: { groups: existgroup._id } },
    { new: true }
  );
  const updatedGroup = await newgroup.save();
  res.status(200).json({ message: "Joined to the group", existgroup });
};
const getgroups = async (req, res) => {
  const userId = req.params.id;
  try {
    console.log(userId);
    const userr = await user.findById(userId);
    const allgroups = userr.groups;
    const groupDetails = await Promise.all(
      allgroups.map(async (groupId) => {
        const groupDetail = await group.findById(groupId);
        return groupDetail;
      })
    );
    res.json(groupDetails);
  } catch (err) {
    console.log(err);
  }
};
const getmembers = async (req, res) => {
  const groupId = req.params.id;
  // console.log(req.params.userId)
  try {
    // const groups = await group.find({
    //     $or:[
    //     {members: { $in: userId }},{userId: userId},],})
    console.log(groupId);
    const groupweneed = await group.findById(groupId);
    const allmembers = groupweneed.members;
    // res.json({allgroups})
    const memberDetails = await Promise.all(
      allmembers.map(async (userId) => {
        const memberDetail = await user.findById(userId);
        return memberDetail;
      })
    );
    res.json(memberDetails);
  } catch (err) {
    console.log(err);
  }
};
const splitBill = async (req, res) => {
  const { amount, groupData } = req.body.input;
  const userr = req.body.input.user;

  const n = groupData.members.length;
  console.log(req.body);

  try {
    const billSplit = await Promise.all(
      groupData.members.map(async (mem) => {
        const { username } = await user.findById(mem);
        return {
          amount: amount / n,
          creator: userr._id,
          name: username,
          userId: mem,
          settled: false,
          approved: false,
        };
      })
    );
    const updatedgroup = await group.findByIdAndUpdate(
      groupData._id,
      { $push: { billSplit: billSplit } },
      { new: true }
    );

    res.json(updatedgroup);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const markPaid = async (req, res) => {
  // Group id
  const id = req.params.id;
  // User id
  const userId = req.body.userId;

  try {
    const group1 = await group.findById(id);

    // Find the index of the user in the billSplit array
    console.log(group1.billSplit[0]);
    const userIndex = group1.billSplit[0].findIndex(
      (mem) => mem.userId === userId
    );

    // If the user is found, update the settled field
    if (userIndex !== -1) {
      const currentSettledValue = group1.billSplit[0][userIndex].settled;
      await group.updateOne(
        { _id: group1._id, "billSplit.0.userId": userId },
        { $set: { "billSplit.0.$.settled": !currentSettledValue } }
      );
    }

    res.json(group1);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const markApproved = async (req, res) => {
  // Group id
  const id = req.params.id;
  // User id
  const userId = req.body.userId;

  try {
    const group1 = await group.findById(id);

    // Find the index of the user in the billSplit array
    const userIndex = group1.billSplit[0].findIndex(
      (mem) => mem.userId === userId
    );

    // If the user is found, update the settled field
    if (userIndex !== -1) {
      const currentApprovedValue = group1.billSplit[0][userIndex].approved;
      await group.updateOne(
        { _id: group1._id, "billSplit.0.userId": userId },
        { $set: { "billSplit.0.$.approved": !currentApprovedValue } }
      );
    }
    console.log("mark approved api:", group1.billSplit);

    res.json(group1);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const simplifyDebt = async (req, res) => {
  const debts = req.body.outputArray;
  const id = req.params.id;

  try {
    const splits = Splitwise(debts);
    splits.forEach((subArray) => subArray.push(false));
    const updatedgroup = await group.findByIdAndUpdate(
      id,
      { $set: { simplifyDebt: splits } },
      { new: true }
    );
    console.log(splits);
    res.json(splits);
  } catch (err) {
    res.json("unable to simplify");
  }
};
const deleteGroup = async (req, res) => {
  const groupId = req.params.id;
  try {
    const groupToDelete = await group.findById(groupId);
    if (!groupToDelete) {
      return res.status(404).json({ error: "Group not found" });
    }
    await group.findByIdAndDelete(groupId);
    const members = groupToDelete.members;
    await Promise.all(
      members.map(async (userId) => {
        const userToUpdate = await user.findById(userId);
        if (userToUpdate) {
          userToUpdate.groups = userToUpdate.groups.filter(
            (groupId) => groupId.toString() !== groupToDelete._id.toString()
          );
          await userToUpdate.save();
        }
      })
    );

    res.status(200).json({ message: "Group deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Unable to delete group" });
  }
};
const approveDebt = async (req, res) => {
  const id = req.params.id;
  const arr = req.body;

  try {
    const updatedGroup = await group.findOneAndUpdate(
      {
        _id: id,
        simplifyDebt: {
          $elemMatch: {
            0: arr[0],
            1: arr[1],
          },
        },
      },
      {
        $set: {
          "simplifyDebt.$[outer].3": true,
        },
      },
      {
        arrayFilters: [{ "outer.0": arr[0], "outer.1": arr[1] }],
        new: true, // Return the modified document
      }
    );

    res.json(updatedGroup);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getgroup = async (req, res) => {
  const id = req.params.id;
  try {
    const grp = await group.findById(id);
    console.log(grp);
    res.json(grp);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const addComment = async (req, res) => {
  const { groupId, userId, text, username } = req.body;

  try {
    const groupp = await group.findByIdAndUpdate(
      groupId,
      {
        $push: {
          comments: {
            userId: userId,
            text: text,
            username: username,
          },
        },
      },
      { new: true }
    );

    res.status(200).json({ groupp });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getAllComments = async (req, res) => {
  const groupId = req.params.id;

  try {
    const groupp = await group.findById(groupId);

    if (!groupp) {
      return res.status(404).json({ error: "Group not found" });
    }

    const commentss = groupp.comments || [];

    res.status(200).json({ commentss });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const addFriendsToGroup = async (req, res) => {
  const { id } = req.params;
  const friends = req.body.friends; 
  let updatedGroup = {};
  try {
    const existgroup = await group.findById(id);

    if (!existgroup) {
      return res.status(404).json({ error: "Group not found" });
    }
    await Promise.all(friends.map(async (friend) => {
      const friendId = (await user.findOne({ username: friend }))._id;
      if (!existgroup.members.includes(friendId)) {
        const tempgroup = await group.findByIdAndUpdate(
          id,
          { $push: { members: friendId } },
          { new: true }
        );

        const userr = await user.findByIdAndUpdate(
          friendId,
          { $push: { groups: id } },
          { new: true }
        );
        updatedGroup = await tempgroup.save();
      }
    }))

    res.status(200).json({updatedGroup, message: 'Welcome to all the new friends'});
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error at adding friend" });
  }
};

module.exports = {
  creategroup,
  joingroup,
  getgroups,
  getmembers,
  splitBill,
  markPaid,
  markApproved,
  deleteGroup,
  simplifyDebt,
  approveDebt,
  getDebts,
  getgroup,
  addComment,
  getAllComments,
  addFriendsToGroup,
};
