$(document).ready(function() {

    $('.lk-side-menu').mCustomScrollbar({
        axis: 'y'
    });

    $('.lk-report-form-item-contract-type input').styler('destroy');

    $('.lk-report-form-window-detail-link').click(function(e) {
        $('.lk-report-form-window').toggleClass('open');
        $('.lk-report-form-window-detail').slideToggle();
        e.preventDefault();
    });

    $('.lk-report-form-items').each(function() {
        Sortable.create(this, {
            handle: '.lk-report-form-item-drag',
            animation: 150,
            onEnd: function(evt) {
                calcReportForm();
            }
        });
    });

    $('body').on('click', '.lk-report-form-item-remove', function(e) {
        if (confirm('Вы действительно хотите удалить?')) {
            var curItems = $(this).parents().filter('.lk-report-form-items');
            $(this).parents().filter('.lk-report-form-item').remove();
            if (curItems.find('.lk-report-form-item').length == 0) {
                curItems.html('');
            }
            calcReportForm();
        }
        e.preventDefault();
    });

    $('.lk-report-form-item-btn-add a').click(function(e) {
        var curTemplate = $(this).attr('data-template');
        var curItems = $(this).parents().filter('.lk-report-form-subgroup').find('.lk-report-form-items');
        curItems.append($('.lk-report-form-template[data-id="' + curTemplate + '"]').html());
        calcReportForm();
        e.preventDefault();
    });

    $('body').on('keypress', '.lk-report-form-item-cost', function(evt) {
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 43 || charCode > 57)) {
            return false;
        }
        return true;
    });

    $('body').on('change', '.lk-report-form-item-cost', function() {
        var newValue = parseFloat($(this).val());
        if (newValue >= 0) {
        } else {
            newValue = 0;
        }
        if (newValue == 0) {
            $(this).val('');
        } else {
            $(this).val(newValue.toFixed(2));
        }
        calcReportForm();
    });

});

function calcReportForm() {
    var allSumm = 0;
    $('.lk-report-form-group').each(function() {
        var curGroup = $(this);
        var groupSumm = 0;
        curGroup.find('.lk-report-form-items').each(function() {
            var itemsSumm = 0;
            var curItems = $(this);
            var curSubGroup = curItems.parent();
            for (var i = 0; i < curItems.find('.lk-report-form-item').length; i++) {
                var curItem = curItems.find('.lk-report-form-item').eq(i);
                curItem.find('.lk-report-form-item-number').html(('0' + (i + 1)).substr(-2));
                var oneItemSumm = 0;
                curItem.find('.lk-report-form-item-cost').each(function() {
                    var newValue = parseFloat($(this).val());
                    if (newValue >= 0) {
                    } else {
                        newValue = 0;
                    }
                    oneItemSumm += newValue;
                });
                itemsSumm += oneItemSumm;
                curItem.find('.lk-report-form-item-summ').html(String(oneItemSumm.toFixed(2)).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
            }

            curSubGroup.find('.lk-report-form-subgroup-summ').html(String(itemsSumm.toFixed(2)).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
            allSumm += itemsSumm;
            groupSumm += itemsSumm;
        });
        curGroup.find('.lk-report-form-group-summ').html(String(groupSumm.toFixed(2)).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
    });
    $('.lk-report-form-summ span').html(String(allSumm.toFixed(2)).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
    $('.lk-report-form-window-summ span').html(String(allSumm.toFixed(2)).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));

    $('.lk-report-form-window-detail').html('');
    for (var i = 0; i < $('.lk-report-form-group').length; i++) {
        var curGroup = $('.lk-report-form-group').eq(i);
        var windowHTML =    '<div class="lk-report-form-window-detail-group">' +
                                '<div class="lk-report-form-window-detail-group-title">' + curGroup.find('.lk-report-form-group-title').html() + '</div>';
        if (curGroup.find('.lk-report-form-subgroup-title').length > 0) {
            for (var j = 0; j < curGroup.find('.lk-report-form-subgroup').length; j++) {
                var curSubGroup = curGroup.find('.lk-report-form-subgroup').eq(j);
                windowHTML +=   '<div class="lk-report-form-window-detail-subgroup">' +
                                    '<div class="lk-report-form-window-detail-subgroup-title">' + curSubGroup.find('.lk-report-form-subgroup-title').html() + '</div>' +
                                    '<div class="lk-report-form-window-detail-subgroup-summ">' + curSubGroup.find('.lk-report-form-subgroup-summ').html() + ' руб.</div>' +
                                '</div>';
            }
        } else {
            windowHTML +=       '<div class="lk-report-form-window-detail-group-summ">' + curGroup.find('.lk-report-form-group-summ').html() + ' руб.</div>';
        }
        windowHTML +=       '</div>';
        $('.lk-report-form-window-detail').append(windowHTML);
    }
}

$(window).on('load resize scroll', function() {
    $('.lk-report-form-window').each(function() {
        if ($(window).scrollTop() > $('header').outerHeight() + 50) {
            $('.lk-report-form-window').css({'top': 50});
        } else {
            $('.lk-report-form-window').css({'top': $('header').outerHeight() + 50 - $(window).scrollTop()});
        }
    });
});