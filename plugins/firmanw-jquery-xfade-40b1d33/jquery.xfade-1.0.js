/*
 * jQuery xFade 1.0
 * http://labs.firmanw.com/jquery-xfade
 *
 * Copyright (c) 2011 Firman Wandayandi
 * Dual licensed under the MIT and GPL licenses.
 *
 * Based on jQuery InnerFade by Torsten Baldes http://medienfreunde.com/lab/innerfade/
 *
 * Available options:
 *  effect:         Animation effect. Can be set to 'fade' or 'slide'. (Default: 'fade'),
 *  speed:          Transition speed in milliseconds or keywords 'slow', 'normal' or 'fast'. (Default: 'normal'),
 *  timeout:        Delay between transitions in milliseconds (Default: '2000'),
 *  order:          Items order. Can be set to 'sequence', 'random' or 'random-start'. (Default: 'sequence'),
 *  height:         Container height. (Default: 'auto'),
 *  containerClass: CSS class to added into container. (Default: false),
 *  children:       jQuery children selector (Default: false)
 *  onBefore:       Callback that fires right before the transition. It receives the following arguments:
 *                  current item index, last item index, current item, last item and items. (Default: false)
 */

(function($) {

    var xfade = [];
    var $xfadeContainers = [];

    $.fn.xfade = function(options) {
        return this.each(function(i) {
            $xfadeContainers.push($(this));

            xfade[i] = {
                container:  null,
                settings:   {
                    'effect':           'fade',
                    'speed':            'normal',
                    'order':            'sequence',
                    'timeout':          2000,
                    'height':           'auto',
                    'containerClass':   false,
                    'children':         false,
                    'onBefore':         false
                },
                timeout:    200,
                current:    1,
                last:       0,
                init: function(container, options) {
                    var me = this;
                    me.container = container;

                    if (options) $.extend(me.settings, options);

                    var elements = me.items();

                    if (elements.length > 1) {
                        $(me.container).css({position: 'relative', height: me.settings.height});
                        if (me.settings.containerClass) $(me.container).addClass(me.settings.containerClass);

                        for (var i = 0; i < elements.length; i++) {
                            $(elements[i]).css('z-index', String(elements.length-i)).css('position', 'absolute').hide();
                        };

                        if (me.settings.order == 'sequence') {
                            me.onBefore(0, null, $(elements[0]), null, elements);
                            me.timeout = setTimeout(function() {
                                me.next();
                            }, me.settings.timeout);

                            $(elements[me.last]).show();
                        } else if (me.settings.order == 'random') {
                            me.last = Math.floor (Math.random() * elements.length);
                            do {
                                me.current = Math.floor (Math.random() * elements.length);
                            } while (me.last == me.current );

                            me.onBefore(me.current, me.last, $(elements[me.current]), $(elements[me.last]), elements);
                            me.timeout = setTimeout(function() {
                                me.next();
                            }, me.settings.timeout);

                            $(elements[me.current]).show();
                        } else if (me.settings.order == 'random-start') {
                            me.settings.order = 'sequence';
                            me.current = Math.floor (Math.random() * elements.length);

                            me.onBefore(me.current, me.last, $(elements[me.current]), $(elements[me.last]), elements);
                            me.timeout = setTimeout(function(){
                                me.next();
                            }, me.settings.timeout);
                            $(elements[me.current]).show();
                        } else {
                            alert('xfade:order must either be \'sequence\', \'random\' or \'random-start\'');
                        }
                    }
                },
                items: function() {
                    var me = this;
                    if (me.settings.children) return $(me.container).children();
                    else return $(me.container).children(me.settings.children);
                },
                next: function() {
                    var me = this;
                    var elements = me.items();
                    
                    me.onBefore(me.current, me.last, $(elements[me.current]), $(elements[me.last]), elements);

                    if (me.settings.effect == 'slide') {
                        $(elements[me.last]).slideUp(me.settings.speed);
                        $(elements[me.current]).slideDown(me.settings.speed);
                    } else if (me.settings.effect == 'fade') {
                        $(elements[me.last]).fadeOut(me.settings.speed);
                        $(elements[me.current]).fadeIn(me.settings.speed, function() {
                            removeFilter($(this)[0]);
                        });
                    } else
                        alert('xfade:effect must either be \'slide\' or \'fade\'');

                    if (me.settings.order == 'sequence') {
                        if ((me.current + 1) < elements.length) {
                            me.current += 1;
                            me.last = me.current - 1;
                        } else {
                            me.current = 0;
                            me.last = elements.length - 1;
                        }
                    } else if (me.settings.order == 'random') {
                        me.last = me.current;
                        while (me.current == me.last) me.current = Math.floor(Math.random() * elements.length);
                    } else {
                        alert('xfade:order must either be \'sequence\', \'random\' or \'random-start\'');
                    }

                    me.timeout = setTimeout((function() {
                        me.next(elements);
                    }), me.settings.timeout);
                },
                to: function(element) {
                    var me = this;

                    if (typeof(element) == 'object' && element.jquery) {
                        if (element.length == 0) return false;

                        $.each(me.items(), function(i) {
                            if ($(this)[0] == element[0]) element = i;
                        });
                    }

                    $.each(me.items(), function() {
                        if ($(this).css('display') != 'none') $(this).fadeOut();
                    })

                    clearTimeout(me.timeout);
                    me.current = element;
                    me.next();
                },
                refresh: function() {
                    var me = this;
                    var elements = me.items();

                    $.each(elements, function(i) {
                        $(this).css({'z-index': String(elements.length - i), 'position': 'absolute'});
                        if (i != me.last) $(this).css({'display': 'none'});
                    });
                },
                onBefore: function(current, last, e_current, e_last, elements) {
                    var me = this;

                    if (typeof(me.settings.onBefore) == 'function') me.settings.onBefore(current, last, e_current, e_last, elements);
                }
            };

            xfade[i].init(this, options);

        });
    };

    $.xfadeInstance = function(container) {
        var i = 0;

        do {
          if ($($xfadeContainers[i]).get(0) == $(container).get(0)) return xfade[i];
          i++;
        } while (i < $xfadeContainers.length - 1)
        
        return false;
    };

    $.fn.xfadeNext = function() {
      var xfade = $.xfadeInstance(this);
      if (xfade) xfade.next();
    };

    $.fn.xfadeTo = function(item) {
        var xfade = $.xfadeInstance(this);
        if (xfade) xfade.to(item);
    };

    $.fn.xfadeRefresh = function(item) {
        var xfade = $.xfadeInstance(this);
        if (xfade) xfade.refresh(item);
    };

})(jQuery);

// **** remove Opacity-Filter in ie ****
function removeFilter(element) {
    if(element.style.removeAttribute){
        element.style.removeAttribute('filter');
    }
}
