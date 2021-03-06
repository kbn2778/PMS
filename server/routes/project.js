const express = require('express');

const router = express.Router();

const models = require('../models');
const wrap = require('express-async-wrap');

// 본인 소속 프로젝트 리스트 불러옴 get방식
router.get('/:uid', wrap(async (req, res) => {
  const assign_r = await models.assign_r.findAll({
    where: {
      uid: req.params.uid
    },
    include: ['project']
  });
  res.send(assign_r);
}));


// 프로젝트 수행원 추가, 역할 부여(PM과 ADMIN만 가능)
router.post('/:uid/:pid', wrap(async (req, res) => {
  if (req.session.user.auth === 1) {
    const create = await models.assign_r.create({
      uid: req.params.uid,
      pid: req.params.pid,
      role: req.body.role
    });
    if (create) {
      res.send({
        result: true
      });
    }
  } else if (req.session.user.auth === 2) {
    const project = await models.project.findOne({
      where: {
        pid: req.params.pid
      }
    });
    if (req.session.user.uid === project.uid) {
      const create = await models.assign_r.create({
        uid: req.params.uid,
        pid: req.params.pid,
        role: req.body.role
      });
      if (create) {
        res.send({
          result: true
        });
      }
    } else {
      res.send({
        result: false
      });
    }
  } else {
    res.send({
      result: false
    });
  }
}));

// 해당 프로젝트 제거(PM과 ADMIN만 가능)
router.delete('/:uid/:pid', wrap(async (req, res) => {
  if (req.session.user.auth === 1) {
    const destroy = await models.project.destroy({
      where: { pid: req.params.pid }
    });
    if (destroy) {
      res.send({
        result: true
      });
    }
  } else if (req.session.user.auth === 2) {
    const project = await models.project.findOne({
      where: {
        pid: req.params.pid
      }
    });
    if (req.session.user.uid === project.uid) {
      const destroy = await models.project.destroy({
        where: { pid: req.params.pid }
      });
      if (destroy) {
        res.send({
          result: true
        });
      }
    } else {
      res.send({
        result: false
      });
    }
  } else {
    res.send({
      result: false
    });
  }
}));

// 해당 to do 수정(PM과 ADMIN만 가능)
router.put('/:uid/:pid/:tdid', wrap(async (req, res) => {
  if (req.session.user.auth === 1) {
    const update = await models.todo.update(req.body, {
      where: {
        tdid: req.params.tdid
      }
    });
    if (update) {
      res.send({
        result: true
      });
    }
  } else if (req.session.user.auth === 2) {
    const todo = await models.todo.findOne({
      where: {
        tdid: req.params.tdid
      }
    });
    const project = await models.project.findOne({
      where: {
        pid: todo.pid
      }
    });
    if (req.session.user.uid === project.uid) {
      const update = await models.todo.update(req.body, {
        where: {
          tdid: req.params.tdid
        }
      });
      if (update) {
        res.send({
          result: true
        });
      }
    } else {
      res.send({
        result: false
      });
    }
  } else {
    res.send({
      result: false
    });
  }
}));

// todo 제거(PM과 ADMIN만 가능)
router.delete('/:pid/:tdid', wrap(async (req, res) => {
  if (req.session.user.auth === 1) {
    const destroy = await models.todo.destroy({
      where: { tdid: req.params.tdid }
    });
    if (destroy) {
      res.send({
        result: true
      });
    }
  } else if (req.session.user.auth === 2) {
    const todo = await models.todo.findOne({
      where: {
        tdid: req.params.tdid
      },
      include: ['project']
    });
    if (todo.project.uid === req.session.user.uid) {
      const destroy = await models.todo.destroy({
        where: { tdid: req.params.tdid }
      });
      if (destroy) {
        res.send({
          result: true
        });
      }
    } else {
      res.send({
        result: false
      });
    }
  } else {
    res.send({
      result: false
    });
  }
}));


// Todo 상세 정보 불러옴(get방식으로)
router.get('/:uid/:pid/:tdid', wrap(async (req, res) => {
  const list = await models.list.findAll({
    where: {
      uid: req.params.uid,
      tdid: req.params.tdid
    },
    include: ['todo']
  });
  res.send(list);
}));

// todo 추가
router.post('/todo', wrap(async (req, res) => {
  if (req.session.user.auth === 1) {
    const create = await models.todo.create(req.body);
    if (create) {
      res.send({
        result: true
      });
    }
  } else if (req.session.user.auth === 2) {
    const project = await models.project.findOne({
      where: {
        pid: req.body.pid
      }
    });
    if (project.uid === req.session.user.uid) {
      const create = await models.todo.create(req.body);
      if (create) {
        res.send({
          result: true
        });
      }
    } else {
      res.send({
        result: false
      });
    }
  } else {
    res.send({
      result: false
    });
  }
}));

module.exports = router;
