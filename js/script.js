/*
* Copyright by Alexander Afanasyev
* E-mail: blackbirdeagle@mail.ru
* Skype: al_sidorenko1
* */

var myMap;

ymaps.ready(function(){
    myMap = new ymaps.Map("map", {
        center: [55.617271, 37.715686],
        zoom: 12
    });

    var placemark = new ymaps.Placemark([55.617271, 37.715686],
        {
            balloonContent: 'г. Москва, Каширское шоссе, 61 корп. 3А'
        },
        {}
    );

    myMap.geoObjects.add(placemark);
    myMap.events.add('actiontick');
});


function move() {
    var s_w = $('.foot__social').width() / 2;
    $('.foot__social').css({"margin-left": -s_w + "px"});
}

move();

$(window).resize(function() {
    move();
});

jQuery(function(){
    jQuery(".phone").mask("+7(999) 999-9999");
});

$('.quest').click(function(){
    var id = $(this).attr('q');
    $('.answer').fadeOut(200);
    $('#' + id).fadeIn(200);
});

$(document).ready(function() {
    var owl = $("#reviews__slider");
    owl.owlCarousel({
        responsive: {
            0: {
                items: 1
            },
            570: {
                items: 1
            },
            600: {
                items: 1
            },
            991: {
                items: 1
            }
        },
        margin: 0,
        loop: true,
        autoplay: true,
        autoplayTimeout: 3000,
        touchDrag: true,
        dots: false,
        autoWidth: false,
        nav: true,
        navText: ['<img src = "images/prev.png" alt = ""/>', '<img src = "images/next.png" alt = ""/>'],
    });
});

/*-------------------------------------------------------------*/
(function($) {

    var defaults = {
        maxBorderOut: 10,
        lapse: 2,
        impulse: 8,
        speed: 800,
        size: 300,
        max: 250,
        value: 0,
        slide: null,
        start: null,
        stop: null
    };

    function CheckValue(checkValue, minVal, maxVal) {
        var res = checkValue;

        if (checkValue < minVal) {
            res = minVal;
        }
        else if (checkValue > maxVal) {
            res = maxVal;
        }

        return res;
    }

    var methods = {
        init:function(params) {
            var options = $.extend({}, defaults, params);

            var init = $(this).data('kineticBar');
            $(this).data('options', options);
            $(this).data('step', 1);

            if (init) {
                return this;
            } else {
                $(this).data('kineticBar', true);

                var $track = this;

                this.width(options.size);

                this.addClass('track');
                this.html('<div class="thumb"></div>')

                var $thumb = this.children('div.thumb');
                $thumb.bind('dragstart',  false);

                if (options.max < options.size) {
                    $thumb.width(options.size - options.max);
                }
                else {
                    $thumb.width(20);
                    $(this).data('step', options.max / (options.size - 20));
                }

                var isClicked = false;
                var clickPointX = 0;
                var dx = 0;

                $track.kineticBar('value', options.value);

                $thumb.bind("mousedown.kineticBar",  function(e) {
                    clickPointX = e.pageX - $(this).offset().left;
                    isClicked = true;

                    if (options.start) {
                        options.start($track.kineticBar('value'));
                    }

                    $thumb.stop();
                });

                $(document).bind("mouseup.kineticBar", function(e) {
                    if (isClicked) {

                        if (Math.abs(dx) < options.lapse) {
                            dx = 0;
                        }

                        var selfLeft = parseInt($thumb.css('left'));

                        var x = (selfLeft + options.impulse * dx);
                        x = CheckValue(x, 0, $track.width() - $thumb.width())

                        $thumb.stop().animate({
                                'left': x + 'px'
                            },

                            {
                                easing: 'easeOutCirc',
                                step: function(now, obj) {
                                    if (options.slide) {
                                        options.slide($track.kineticBar('value'));
                                    }
                                },
                                complete: function() {
                                    if (options.stop) {
                                        options.stop($track.kineticBar('value'));
                                    }
                                },
                                duration : options.speed

                            });
                    }
                    isClicked = false;

                });

                $(document).bind("mousemove.kineticBar", function(e) {
                    if (isClicked) {
                        var x = (e.pageX - $track.offset().left - clickPointX);

                        x = CheckValue(x, -options.maxBorderOut, $track.width() - $thumb.width() + options.maxBorderOut)

                        var selfLeft = parseInt($thumb.css('left'));

                        $thumb.css({
                            'left': x + 'px'
                        });
                        if (options.slide) {
                            options.slide($track.kineticBar('value'));
                        }
                        dx = x - selfLeft;
                    }
                });

            }
        },
        value: function(position) {
            var isSetter = true;

            if (!position) {
                position = Math.round($(this).data('step') * parseInt(this.children('div').css('left')));
                isSetter = false;
            }

            position = CheckValue(position, 0, $(this).data('options').max);

            if (isSetter) {
                position = Math.round(position / $(this).data('step'));
                this.children('div').css('left', position + 'px');
                if ($(this).data('options').slide) {
                    $(this).data('options').slide(position);
                }
            }

            return position;
        },
        destroy:function() {
            methods.reset.apply(this);
            $(this).unbind(".kineticBar");
            $(this).removeData('kineticBar');
            $(this).removeData('options');
        }
    };

    $.fn.kineticBar = function(method){
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method "' +  method + '" not found' );
        }
    };
})(jQuery);

$(function() {
    $('#items').width(($('#items').children().length * 324));
    $('#track').kineticBar(
        {
            size: $('#items').width(), // Размер scrollbar'a в пикселях
            max: $('#items').width(), // Максимальное значение
            // Функция, вызывающаяся при скролле
            slide: function(val) {
                $('#items').css({'left': -val + 'px'});
            }
        }
    );
});

$(function() {
    $('#items1').width(($('#items1').children().length * 196));
    $('#track1').kineticBar(
        {
            size: $('#items1').width(), // Размер scrollbar'a в пикселях
            max: $('#items1').width(), // Максимальное значение
            // Функция, вызывающаяся при скролле
            slide: function(val) {
                $('#items1').css({'left': -val + 'px'});
            }
        }
    );
});

$('.top__video').fancybox({
    openEffect  : 'none',
    closeEffect : 'none',
    helpers : {
        media : {}
    }
});

$('[popup-target]').click(function(e) {
    var el = $(this);
    var target = el.attr('popup-target');

    $('.overlay').fadeIn(200, function(){
        $('.popup.'+target).fadeIn(200);
        var top = document.documentElement.clientHeight / 2 - $('.popup.'+target).height() / 2 + $(window).scrollTop();
        var left = $('body').width() / 2 - $('.popup.'+target).width() / 2;
        left = left - 40;
        $('.popup.'+target).css('top', top).css('left', left);
    })


    return false;
});

$('.overlay, .close1').click(function(e) {
    var popup = $('.popup:visible');
    popup.fadeOut(200, function(){
        $('.overlay').fadeOut(200);
    });
    return false;
});

function keyExit(e){
    if(e.keyCode == 27){

        var popup = $('.popup:visible');
        popup.fadeOut(200, function(){
            $('.overlay').fadeOut(200);
        });
    }
}

addEventListener("keydown", keyExit);

$('.show__menu').click(function(){
    $('.float__menu').animate({left: 0}, 300);
});

$('.hide__menu').click(function(){
    $('.float__menu').animate({left: -290}, 300);
});

$(window).load(function() {
    $('.flexslider').flexslider({
        animation: "fade",
        controlNav: "thumbnails",
        directionNav: false,
    });
});

$('.fancybox').fancybox({
    openEffect  : 'none',
    closeEffect : 'none',
    helpers : {
        media : {},
        overlay: {
            locked: false
        }
    }
});
