<?php


if(isset($_FILES['upl10'])){

    echo '{"status":"success", "path":"' . 'uploads/'.$_FILES['upl0']['name'] . '", "name": "fu_ID_9[]", "value": "11"}';
    exit;
}

if(isset($_FILES['upl1'])){

    echo '{"status":"error", "message": "Ошибка загрузки файла"}';
    exit;
}

if(isset($_FILES['upl2'])){

    echo '{"status":"error", "message": "Неверный формат файла"}';
    exit;
}


echo '{"status":"error", "message": "Ошибка загрузки файла"}';
exit;