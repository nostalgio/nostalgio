var QuickSend = Backbone.Model.extend({
    urlRoot: '/api/quicksend'
});

var QuickQuote = Backbone.Model.extend({
    urlRoot: '/api/quickquote'
});

var QuickSendView = Backbone.View.extend({
    el: '#quick-send-form',
    container: '#quick-send-container',
    taglineContainer: '#tagline-container',
    formContent: '#contact-form-content',
    CONTACT: 'contact',
    QUOTE: 'quote',

    events: {
        'click button': 'sendForm',
        'change #contact_switch': 'changeForm'
    },

    initialize: function initialize(options) {
        this.formDisplayed = this.CONTACT;
        this.$container = $(this.container);
        this.$taglineContainer = $(this.taglineContainer);
        this.$formContent = $(this.formContent);
        this.contactHTML = this.$formContent.html();
        this.quoteHTML = $('#quote-form-content').removeAttr('style').html();
        $('#quote-form-content').remove();
        // this.model will refer to Contact model.
        this.quoteModel = options.quoteModel;
    },

    changeForm: function changeForm() {
        // Cache existing data.
        var data = this.getFormJSON();
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

    renderContactForm: function renderContactForm() {
        this.formDisplayed = this.CONTACT;
        this.$taglineContainer.removeClass('hide-for-medium-only').addClass('medium-6');
        this.$container.removeClass('medium-12').removeClass('large-6').removeClass('large-offset-2').addClass('medium-6').addClass('large-4').addClass('large-offset-4');
        this.$formContent.html(this.contactHTML);
    },

    renderQuoteForm: function renderQuoteForm() {
        this.formDisplayed = this.QUOTE;
        this.$taglineContainer.removeClass('medium-6').addClass('hide-for-medium-only');
        this.$container.removeClass('medium-6').removeClass('large-4').removeClass('large-offset-4').addClass('medium-12').addClass('large-6').addClass('large-offset-2');
        this.$formContent.html(this.quoteHTML);
    },

    getFormJSON: function getFormJSON() {
        var rawData = this.$el.serializeArray(),
            data = {};
        _.each(rawData, function (input) {
            data[input.name] = input.value;
        });
        return data;
    },

    setCommonData: function setCommonData(data) {
        if (data.name && data.name.length > 0) {
            $('[name="name"]').val(data.name);
        }
        if (data.email && data.email.length > 0) {
            $('[name="email"]').val(data.email);
        }
    },

    sendForm: function sendForm(e) {
        e.preventDefault();
        this.$el.append(loading);
        var self = this,
            data = this.$el.serialize(),
            options = {
            data: data,
            error: function error(model, response) {
                var errors = response.responseJSON;
                $('#quick-send-error').foundation('open');
            },
            complete: function complete() {
                self.$el.find('div.loading').remove();
            }
        };
        if (this.formDisplayed == 'contact') {
            this.sendContact(data, options);
        } else {
            this.sendQuote(data, options);
        }
    },

    sendContact: function sendContact(data, defaultOptions) {
        var self = this;
        var options = {
            success: function success(model, response) {
                $('#quick-send-success').foundation('open');
                self.$el[0].reset();
            }
        };
        _.extend(options, defaultOptions);

        this.model.save(null, options);
    },

    sendQuote: function sendQuote(data, defaultOptions) {
        var self = this;
        var options = {
            success: function success(model, response) {
                $('#quick-quote-success').foundation('open');
                self.$el[0].reset();
            }
        };
        _.extend(options, defaultOptions);

        this.quoteModel.save(null, options);
    }
});

$(document).foundation();

$(document).ready(function () {
    var MOBILE_WIDTH = 640;

    $('.bxslider').bxSlider();

    $(document).ready(function () {
        $('#faq .block-faq_question').click(function () {
            $(this).next('.block-faq_answer').slideToggle(500);
            $(this).toggleClass('close');
        });
    });

    $('.reveal_modal').click(function (event) {
        event.preventDefault();

        $('#modal-content').empty();
        var link = $(this).attr("href");
        $('#modal-content').load(link + " .modal-content");
    });

    $('.testimonials').bxSlider({
        auto: true,
        mode: 'vertical',
        pager: false,
        controls: false,
        slideMargin: 3
    });

    $('.adverts').bxSlider({
        minSlides: 3,
        maxSlides: 3,
        slideWidth: 210,
        slideMargin: 15
    });

    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.scrollup').fadeIn();
            $('#logo').css({
                'height': '38px'
            });
        } else {
            $('.scrollup').fadeOut();
            $('#logo').css({
                'height': '80px'
            });
        }
    });

    $('.scrollup').click(function () {
        $("html, body").animate({
            scrollTop: 0
        }, 600);
        return false;
    });

    $('.scrolldown').click(function () {
        var toTop = $('.intro').innerHeight() - 42;
        $("html, body").animate({
            scrollTop: toTop
        }, 600);
        return false;
    });

    var center_divs = function center_divs() {
        var MENU_HEIGHT = 54,
            FUDGE = 10,
            divHeight = $('.vertical-center').innerHeight(),
            windowHeight = $(window).innerHeight(),
            windowWidth = $(window).innerWidth();
        if (windowWidth < MOBILE_WIDTH) {
            $('.intro').stop().removeAttr('style');
            $('.vertical-center').stop().removeAttr('style');
        } else if (windowHeight - MENU_HEIGHT < divHeight) {
            $('.intro').css({ 'height': 'auto' });
        } else if (windowWidth > MOBILE_WIDTH) {
            $('.intro').css({ 'height': '100vh' });
            // Vertically align
            $('.vertical-center').stop().animate({
                'margin-top': windowHeight / 2 - divHeight / 2 + FUDGE
            });
        }
    };

    center_divs();
    $(window).on('resize', function () {
        center_divs();
    });
});

if (HAS_QUICK_SEND === true) {
    var contact = new QuickSend(),
        quote = new QuickQuote(),
        formView = new QuickSendView({ model: contact, quoteModel: quote });
    formView.render();
}
//# sourceMappingURL=main.js.map