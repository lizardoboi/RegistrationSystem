$(document).ready(function() {

    // первый список
    $('#html').change(function() {
        var selectedOption = $(this).val();
        if (selectedOption) {

            $.ajax({
                type: 'POST',
                url: '/request',
                data: { langOp: selectedOption },
                success: function(response) {
                    $('#ajax').html(response);
                },
                error: function(xhr, status, error) {
                    console.error(error);
                }
            });
        }
    });

    // второй список
    $('#ajax').change(function() {
        var selectedWord = $(this).val();
        if (selectedWord) {
            var selectedLanguage = $('#html').val();
            var translation;
            switch(selectedWord) {
                case 'Вилка':
                    switch(selectedLanguage) {
                        case 'Русский':
                            translation = 'Fork, Haarukka';
                            break;
                    }
                    break;
                case 'Самовар':
                    switch(selectedLanguage) {
                        case 'Русский':
                            translation = 'Samovar, Samovaari';
                            break;
                    }
                    break;
                case 'Матрёшка':
                    switch(selectedLanguage) {
                        case 'Русский':
                            translation = 'Matryoshka, Matrjoska';
                            break;
                    }
                    break;
                case 'Fork':
                    switch(selectedLanguage) {
                        case 'Английский':
                            translation = 'Вилка, Haarukka';
                            break;
                    }
                    break;
                case 'Spoon':
                    switch(selectedLanguage) {
                        case 'Английский':
                            translation = 'Ложка, Lusikka';
                            break;
                    }
                    break;
                case 'Beans':
                    switch(selectedLanguage) {
                        case 'Английский':
                            translation = 'Бобы, Papu';
                            break;
                    }
                    break;
                case 'Metsä':
                    switch(selectedLanguage) {
                        case 'Финский':
                            translation = 'Лес, Forest';
                            break;
                    }
                    break;
                case 'Moottoripyörä':
                    switch(selectedLanguage) {
                        case 'Финский':
                            translation = 'Мотоцикл, Motorcycle';
                            break;
                    }
                    break;
                case 'Tölkki':
                    switch(selectedLanguage) {
                        case 'Финский':
                            translation = 'Банка, Jar';
                            break;
                    }
                    break;
            }
            if (selectedWord && selectedLanguage) {
                $('#result').text('Выбранный язык ' + selectedLanguage + ' и ваше слово ' + selectedWord + '. Перевод: ' + translation);
            }
        }
    });
});
