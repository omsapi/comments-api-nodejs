var express = require('express');
var config=require('omsapi-config');

var Comment = require('../models/comment');
var RelationToken=require('../lib/relation-token');
var relationToken=new RelationToken(config.get('token:relationSecret'));

var router = express.Router();

module.exports = function (passport) {
    router.get('/heartbeat', function (req, res) {
        res.send();
    });

    router.post('/',
        passport.authenticate('access-token', {session: false, assignProperty: 'payload'}),
        passport.authenticate('relation-token', {session: false, assignProperty: 'relation'}),
        function (req, res, next) {
            var comment = new Comment({
                userId: req.payload.userId,
                relationId: req.relation.id,
                relationName: req.relation.name,
                content: req.body.content
            });

            comment.save(function (err) {
                if (err) {
                    return next(err);
                }

                createRelationToken(comment, function(token){
                    var commentDto = commentMapper(comment, token);
                    res.send(commentDto);
                });
            });
        }
    );

    router.get('/',
        passport.authenticate('access-token', {session: false, assignProperty: 'payload'}),
        function (req, res, next) {
            Comment.find({userId: req.payload.userId}, function (err, comments) {
                if (err) {
                    return next(err);
                }


                var commentDtos = comments.map(function(comment){
                    return commentMapper(comment);
                });

                res.send(commentDtos);
            });
        }
    );

    return router;
};

function commentMapper(comment, token) {
    return {
        id: comment._id,
        userId: comment.userId,
        content: comment.content,
        created: comment.created,
        relationToken: token
    };
}
function createRelationToken(comment, callback) {
    relationToken.create(comment._id, comment.relationId, comment.userId, 'comment', function (token) {
        callback(token);
    });
}
