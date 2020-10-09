$(document).ready(function() {

    $('.lk-side-menu').mCustomScrollbar({
        axis: 'y'
    });

    $('.lk-report-form-window-detail-link').click(function(e) {
        $('.lk-report-form-window').toggleClass('open');
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
        var newHTML = $('.lk-report-form-template[data-id="' + curTemplate + '"]').html();
        var curTime = +new Date;
        curItems.append(newHTML.replace(/_VAR_NAME_/g, $(this).attr('data-var-name')).replace(/_VAR_ID_/g, curTime));

        curItems.find('.lk-report-form-input-date input').each(function() {
            if (!$(this).hasClass('inputDate')) {
                initInputDate($(this));
            }
        });

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

    if ($('.lk-report-form').length > 0) {
        calcReportForm();
    }

    $.validator.addMethod('inputDate',
        function(curDate, element) {
            if (this.optional(element) && curDate == '') {
                return true;
            } else {
                if (curDate.match(/^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$/)) {
                    var userDate = new Date(curDate.substr(6, 4), Number(curDate.substr(3, 2)) - 1, Number(curDate.substr(0, 2)));
                    if ($(element).attr('min')) {
                        var minDateStr = $(element).attr('min');
                        var minDate = new Date(minDateStr.substr(6, 4), Number(minDateStr.substr(3, 2)) - 1, Number(minDateStr.substr(0, 2)));
                        if (userDate < minDate) {
                            $.validator.messages['inputDate'] = 'Минимальная дата - ' + minDateStr;
                            return false;
                        }
                    }
                    if ($(element).attr('max')) {
                        var maxDateStr = $(element).attr('max');
                        var maxDate = new Date(maxDateStr.substr(6, 4), Number(maxDateStr.substr(3, 2)) - 1, Number(maxDateStr.substr(0, 2)));
                        if (userDate > maxDate) {
                            $.validator.messages['inputDate'] = 'Максимальная дата - ' + maxDateStr;
                            return false;
                        }
                    }
                    return true;
                } else {
                    $.validator.messages['inputDate'] = 'Дата введена некорректно';
                    return false;
                }
            }
        },
        ''
    );

    $.validator.addMethod('requiredGroup',
        function(value, element) {
            var curRow = $(element).parents().filter('.lk-report-form-item-row');
            var result = false;
            curRow.find('.requiredGroup').each(function() {
                if ($(this).val() != '') {
                    result = true;
                }
            });
            if (result) {
                curRow.find('.requiredGroup').removeClass('error').parent().find('label.error').remove();
            } else {
                curRow.find('.requiredGroup').addClass('error').parent().find('label.error').remove();
                curRow.find('.requiredGroup').each(function() {
                    $(this).parent().append('<label class="error">обязательное поле</label>');
                });
            }
            return result;
        },
        'обязательное поле'
    );

    $('form').each(function() {
        initForm($(this));
    });

    $('body').on('click', '.lk-report-form-window-detail-group-title', function(e) {
        var groupID = Number($(this).attr('data-groupid'));
        $('html, body').animate({'scrollTop': $('.lk-report-form-group').eq(groupID).find('.lk-report-form-group-title').offset().top});
    });

    $('body').on('click', '.lk-report-form-window-detail-subgroup-title', function(e) {
        var groupID = Number($(this).attr('data-groupid'));
        var subgroupID = Number($(this).attr('data-subgroupid'));
        $('html, body').animate({'scrollTop': $('.lk-report-form-group').eq(groupID).find('.lk-report-form-subgroup').eq(subgroupID).find('.lk-report-form-subgroup-title').offset().top});
    });

    $('.lk-report-form-window-detail-inner').mCustomScrollbar({
        axis: 'y'
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

    $('.lk-report-form-window-detail-inner').html('');
    for (var i = 0; i < $('.lk-report-form-group').length; i++) {
        var curGroup = $('.lk-report-form-group').eq(i);
        var windowHTML =    '<div class="lk-report-form-window-detail-group">' +
                                '<div class="lk-report-form-window-detail-group-title" data-groupid="' + i + '">' + curGroup.find('.lk-report-form-group-title').html() + '</div>';
        if (curGroup.find('.lk-report-form-subgroup-title').length > 0) {
            for (var j = 0; j < curGroup.find('.lk-report-form-subgroup').length; j++) {
                var curSubGroup = curGroup.find('.lk-report-form-subgroup').eq(j);
                windowHTML +=   '<div class="lk-report-form-window-detail-subgroup">' +
                                    '<div class="lk-report-form-window-detail-subgroup-title" data-groupid="' + i + '" data-subgroupid="' + j + '">' + curSubGroup.find('.lk-report-form-subgroup-title').html() + '</div>' +
                                    '<div class="lk-report-form-window-detail-subgroup-summ">' + curSubGroup.find('.lk-report-form-subgroup-summ').html() + ' руб.</div>' +
                                '</div>';
            }
        } else {
            windowHTML +=       '<div class="lk-report-form-window-detail-group-summ">' + curGroup.find('.lk-report-form-group-summ').html() + ' руб.</div>';
        }
        windowHTML +=       '</div>';
        $('.lk-report-form-window-detail-inner').append(windowHTML);
    }
    
    $('.lk-report-form-subgroup').each(function() {
        var curGroup = $(this);
        if (curGroup.find('.lk-report-form-item').length == 0) {
            curGroup.find('.lk-report-form-item-headers').removeClass('visible');
        } else {
            curGroup.find('.lk-report-form-item-headers').addClass('visible');
        }
    });
}

$(window).on('load resize scroll', function() {
    $('.lk-report-form-window').each(function() {
        if ($(window).scrollTop() > $('header').outerHeight()) {
            $('.lk-report-form-window').css({'top': 15});
        } else {
            $('.lk-report-form-window').css({'top': $('header').outerHeight() + 15 - $(window).scrollTop()});
        }
    });
});

function initInputDate(field) {
    field.mask('00.00.0000');
    field.attr('autocomplete', 'off');
    field.addClass('inputDate');

    field.on('keyup', function() {
        var curValue = $(this).val();
        if (curValue.match(/^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$/)) {
            var isCorrectDate = true;
            var userDate = new Date(curValue.substr(6, 4), Number(curValue.substr(3, 2)) - 1, Number(curValue.substr(0, 2)));
            if ($(this).attr('min')) {
                var minDateStr = $(this).attr('min');
                var minDate = new Date(minDateStr.substr(6, 4), Number(minDateStr.substr(3, 2)) - 1, Number(minDateStr.substr(0, 2)));
                if (userDate < minDate) {
                    isCorrectDate = false;
                }
            }
            if ($(this).attr('max')) {
                var maxDateStr = $(this).attr('max');
                var maxDate = new Date(maxDateStr.substr(6, 4), Number(maxDateStr.substr(3, 2)) - 1, Number(maxDateStr.substr(0, 2)));
                if (userDate > maxDate) {
                    isCorrectDate = false;
                }
            }
            if (isCorrectDate) {
                var myDatepicker = $(this).data('datepicker');
                if (myDatepicker) {
                    var curValueArray = curValue.split('.');
                    myDatepicker.selectDate(new Date(Number(curValueArray[2]), Number(curValueArray[1]) - 1, Number(curValueArray[0])));
                    myDatepicker.show();
                    $(this).focus();
                }
            } else {
                $(this).addClass('error');
                return false;
            }
        }
    });

    field.each(function() {
        var minDateText = $(this).attr('min');
        var minDate = null;
        if (typeof (minDateText) != 'undefined') {
            var minDateArray = minDateText.split('.');
            minDate = new Date(Number(minDateArray[2]), Number(minDateArray[1]) - 1, Number(minDateArray[0]));
        }
        var maxDateText = $(this).attr('max');
        var maxDate = null;
        if (typeof (maxDateText) != 'undefined') {
            var maxDateArray = maxDateText.split('.');
            maxDate = new Date(Number(maxDateArray[2]), Number(maxDateArray[1]) - 1, Number(maxDateArray[0]));
        }
        if ($(this).hasClass('maxDate1Year')) {
            var curDate = new Date();
            curDate.setFullYear(curDate.getFullYear() + 1);
            curDate.setDate(curDate.getDate() - 1);
            maxDate = curDate;
            var maxDay = curDate.getDate();
            if (maxDay < 10) {
                maxDay = '0' + maxDay
            }
            var maxMonth = curDate.getMonth() + 1;
            if (maxMonth < 10) {
                maxMonth = '0' + maxMonth
            }
            $(this).attr('max', maxDay + '.' + maxMonth + '.' + curDate.getFullYear());
        }
        var startDate = new Date();
        if (typeof ($(this).attr('value')) != 'undefined') {
            var curValue = $(this).val();
            if (curValue != '') {
                var startDateArray = curValue.split('.');
                startDate = new Date(Number(startDateArray[2]), Number(startDateArray[1]) - 1 , Number(startDateArray[0]));
            }
        }
        $(this).datepicker({
            language: 'ru',
            minDate: minDate,
            maxDate: maxDate,
            startDate: startDate,
            toggleSelected: false
        });
        if (typeof ($(this).attr('value')) != 'undefined') {
            var curValue = $(this).val();
            if (curValue != '') {
                var startDateArray = curValue.split('.');
                startDate = new Date(Number(startDateArray[2]), Number(startDateArray[1]) - 1 , Number(startDateArray[0]));
                $(this).data('datepicker').selectDate(startDate);
            }
        }
    });
}

function initForm(curForm) {
    curForm.find('.lk-report-form-input-date input').each(function() {
        initInputDate($(this));
    });

    curForm.validate({
        ignore: ''
    });
}