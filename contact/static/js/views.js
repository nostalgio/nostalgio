export var QuickSendView = Backbone.View.extend({
    el: '#quick-send-form',
    container: '#quick-send-container',
    taglineContainer: '#tagline-container',
    CONTACT: 'contact',
    QUOTE: 'quote',

    events: {
        'click button': 'sendForm',
        'change #contact_switch': 'changeForm'
    },

    initialize: function(options) {
        this.formDisplayed = this.CONTACT;
        this.$container = $(this.container);
        this.$taglineContainer = $(this.taglineContainer);
        // this.model will refer to Contact model.
        this.quoteModel = options.quoteModel;
    },

    changeForm: function() {
        // Cache existing data.
        let data = this.getFormJSON();
        // Update Form UI
        if ($('#contact_switch').is(':checked')) {
            this.renderQuoteForm();
        } else {
            this.renderContactForm();
        }
        // Trigger resizing functions.
        $(window).trigger('resize');
        // Transfer existing data
        this.setCommonData(data);
    },

    renderContactForm: function() {
        this.formDisplayed = this.CONTACT;
        this.$taglineContainer.removeClass('hide-for-medium-only')
            .addClass('medium-6');
        this.$container.removeClass('medium-12').removeClass('large-6').removeClass('large-offset-2')
            .addClass('medium-6').addClass('large-4').addClass('large-offset-4');
        $('#quote-form-content').hide();
        $('#contact-form-content').show();
    }, 

    renderQuoteForm: function() {
        this.formDisplayed = this.QUOTE;
        this.$taglineContainer.removeClass('medium-6')
            .addClass('hide-for-medium-only');
        this.$container.removeClass('medium-6').removeClass('large-4').removeClass('large-offset-4')
            .addClass('medium-12').addClass('large-6').addClass('large-offset-2');
        $('#contact-form-content').hide();
        $('#quote-form-content').show();
    },

    getFormJSON: function() {
        let rawData = this.$el.serializeArray(),
            data = {};
        _.each(rawData, function(input) {
            data[input.name] = input.value;
        });
        return data;
    },

    setCommonData: function(data) {
        if (data.name && data.name.length > 0) {
            $('[name="name"]').val(data.name);
        }
        if (data.email && data.email.length > 0) {
            $('[name="email"]').val(data.email);
        }
    },

    sendForm: function(e) {
        e.preventDefault();
        this.$el.append(loading);
        let self = this,
            data = this.$el.serialize(),
            options = {
                data: data,
                error: function(model, response) {
                    var errors = response.responseJSON;
                    $('#quick-send-error').foundation('open');
                },
                complete: function() {
                    self.$el.find('div.loading').remove();
                }
            };
        if (this.formDisplayed == 'contact') {
            this.sendContact(data, options);
        } else {
            this.sendQuote(data, options);
        }
    },

    sendContact: function(data, defaultOptions) {
        let self = this;
        let options = {
            success: function(model, response) {
                $('#quick-send-success').foundation('open');
                self.$el[0].reset();
            }
        };
        _.extend(options, defaultOptions);

        this.model.save(null, options);
    },

    sendQuote: function(data, defaultOptions) {
        let self = this;
        let options = {
            success: function(model, response) {
                $('#quick-quote-success').foundation('open');
                self.$el[0].reset();
            }
        };
        _.extend(options, defaultOptions);

        this.quoteModel.save(null, options);
    }
});