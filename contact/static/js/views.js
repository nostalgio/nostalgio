export var QuickSendView = Backbone.View.extend({
    el: '#quick-send-form',

    events: {
        'click button': 'sendForm'
    },

    initiliaze: function(options) {

    },

    sendForm: function(e) {
        e.preventDefault();
        let data = this.$el.serialize(),
            self = this;
        this.$el.append(loading);
        this.model.save(null, {
            data: data,
            success: function(model, response) {
                $('#quick-send-success').foundation('open');
                self.$el[0].reset();
            },
            error: function(model, response) {
                var errors = response.responseJSON;
                $('#quick-send-error').foundation('open');
            },
            complete: function() {
                self.$el.find('div.loading').remove();
            }
        });
    } 
});