'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var TodoConstants = require('../constants/TodoConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _todos = {};

function create(text) {
    var id = Date.now();

    _todos[id] = {
        id: id,
        complete: false,
        text: text
    };
}

function destroy(id) {
    delete _todos[id];
}

var TodoStore = assign({}, EventEmitter.prototype, {
    getAll: function() {
        return _todos;
    },
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },
    dispatcherIndex: AppDispatcher.register(function(payload) {
        var action = payload.action;
        var text;

        switch (action.actionType) {
            case TodoConstants.TODO_CREATE:
                text = action.text.trim();
                if (text) { // changed
                    create(text);
                    TodoStore.emitChange();
                }
                break;
            case TodoConstants.TODO_DESTROY:
                destroy(action.id);
                TodoStore.emitChange();
                break;
        }
    })
});

module.exports = TodoStore;
