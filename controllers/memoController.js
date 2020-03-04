const { create, update } = require('../utils/dbUtil');
const { getMemoByMemoId } = require('../utils/relationUtil');
const db = require('../models/database');

module.exports = {
  getMemosList: (req, res) => {
    const memos = db.get('memos').value();

    res.send(memos);
  },
  createMemo: (req, res) => {
    const { title, content } = req.body;

    if (title) {
      const data = db
        .get('memos')
        .push(create({ title, content }))
        .write();

      res.send(data[data.length - 1]);
    } else {
      res.status(500).send('must provide a valid title');
    }
  },
  getMemo: (req, res) => {
    const memoId = req.params.id;

    const memo = getMemoByMemoId(memoId);

    if (memo) {
      res.send(memo);
    } else {
      res.status(500).send('invalid memo id');
    }
  },
  updateMemo: (req, res) => {
    const memoId = req.params.id;
    const { title, content } = req.body;

    db.get('memos')
      .find({ id: memoId })
      .assign(update({ title, content }))
      .write();

    const memo = getMemoByMemoId(memoId);

    if (memo) {
      res.send(memo);
    } else {
      res.status(500).send('unable to update memo');
    }
  },
  deleteMemo: (req, res) => {
    const memoId = req.params.id;

    const memo = getMemoByMemoId(memoId);

    db.get('memos')
      .remove({ id: memoId })
      .write();

    /**
     * Delete all relations
     */
    db.get('labelsToMemos')
      .remove({ memoId })
      .write();

    res.send(memo);
  },
};