const express = require('express');
const { createGroup, findAllByOwner } = require('../controller/groups');
const logger = require('../logger');

const apiGroupsProtected = express.Router();

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
apiGroupsProtected.post('/', (req, res) =>
    !req.body.title
        ? res.status(400).send({
            success: false,
            message: 'Title is required'
        })
        : createGroup({title: req.body.title, description: req.body.description, owner: req.user})
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

apiGroupsProtected.get('/allMyGroups', (req, res) => {
    logger.info('get all groups ownerId:' + req.user.id);
    findAllByOwner(req.user.id).then(groups =>{
        return res.status(200).send({
            success: true,
            groups: groups,
            message: "my owen groups"
        })
    }).catch(err => {
        logger.error(err.stack);
        return err;
    })
});



module.exports = { apiGroupsProtected };
