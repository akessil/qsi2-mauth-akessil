const express = require('express');
const { createGroup } = require('../controller/groups');
const logger = require('../logger');

const apiGroups = express.Router();

// http://apidocjs.com/#params
/**
 * @api {post} /groups Group creation
 * @apiVersion 1.0.0
 * @apiName createGroup
 * @apiGroup Users
 *
 * @apiParam {STRING} title Title of the group.
 * @apiParam {STRING} description  Description of the group.
 *
 * @apiSuccess {BOOLEAN} success Success.
 * @apiSuccess {STRING} message Message.
 * @apiSuccess {JSON} group Group information and metadatas (owner and members).
 */
apiGroups.post('/', (req, res) =>
    !req.body.title
        ? res.status(400).send({
            success: false,
            message: 'Title is required'
        })
        : createGroup({title: req.body.title, description: req.body.description, owner:{id: '98c61e5d-cd73-43bb-89cf-fbd6d89c38e3'}})
            .then(group => {
                return res.status(201).send({
                    success: true,
                    group: group,
                    message: 'group created'
                });
            })
            .catch(err => {
                logger.error(`💥 Failed to create group : ${err.stack}`);
                return res.status(500).send({
                    success: false,
                    message: `${err.name} : ${err.message}`
                });
            })
);


module.exports = { apiGroups };
