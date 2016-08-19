var QuickSend = Backbone.Model.extend({
    urlRoot: '/api/quicksend'
});

var QuickSendView = Backbone.View.extend({
    el: '#quick-send-form',

    events: {
        'click button': 'sendForm'
    },

    initiliaze: function initiliaze(options) {},

    sendForm: function sendForm(e) {
        e.preventDefault();
        var data = this.$el.serialize(),
            self = this;
        this.$el.append(loading);
        this.model.save(null, {
            data: data,
            success: function success(model, response) {
                $('#quick-send-success').foundation('open');
                self.$el[0].reset();
            },
            error: function error(model, response) {
                var errors = response.responseJSON;
                $('#quick-send-error').foundation('open');
            },
            complete: function complete() {
                self.$el.find('div.loading').remove();
            }
        });
    }
});

$(document).foundation();

$(document).ready(function () {

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
        } else {
            $('.scrollup').fadeOut();
        }
    });

    $('.scrollup').click(function () {
        $("html, body").animate({
            scrollTop: 0
        }, 600);
        return false;
    });
});

if (HAS_QUICK_SEND === true) {
    var form = new QuickSend(),
        formView = new QuickSendView({ model: form });
    formView.render();
}

console.log('test');
//# sourceMappingURL=main.js.map