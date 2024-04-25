/**
 * РћС‚РїСЂР°РІРёС‚СЊ РїРѕС‡С‚Сѓ
 *
 * @version    1.0
 **/
class SubmitMail {
  /**
   * РћС‚РїСЂР°РІРёС‚СЊ РЅР° СЏРЅРґРµРєСЃ, ajax
   *
   * @version    1.1
   *
   * @dependence jQuery
   *
   * @param      form, pathPhpFile, endFunc
   * @return     СЃС‚СЂРѕРєСѓ
   **/
  static yandex(form, pathPhpFile = "mail.php", endFunc) {
    jQuery(form).submit(function (e) {
      e.preventDefault();

      jQuery
        .ajax({
          type: "POST",
          url: pathPhpFile,
          data: jQuery(this).serialize(),
        })
        .done(endFunc);

      return false;
    });
  }

  static yandex_reCaptacha_v3(form, pathPhpFile = "mail.php", endFunc) {
    jQuery(form).on("submit", (e) => {
      e.preventDefault();

      grecaptcha.ready(() => {
        grecaptcha
          .execute(kReCaptcha_v3["siteKey"], { action: "homepage" })
          .then((recaptchaToken) => {
            document.getElementById("recaptcha-token").value = recaptchaToken;

            jQuery
              .ajax({
                type: "POST",
                url: kReCaptcha_v3["phpFileCaptcha"],
                data: { recaptcha_token: recaptchaToken },
              })
              .done((result) => {
                if (result["score"] <= 0.5) return;

                jQuery
                  .ajax({
                    type: "POST",
                    url: pathPhpFile,
                    data: jQuery(form).serialize(),
                  })
                  .done(endFunc);
              });
          });
      });
    });
  }
}
/**
 * РЈРїСЂР°РІР»РµРЅРёРµ С‚Р°Р±Р»РёС†РѕР№ РЅР°СЃРѕСЃРѕРІ
 *
 * @version    1.0
 *
 * @dependence jQuery
 *
 * @param      element
 **/
class TableNasosyWq {
  constructor($table) {
    this.$table = $table;
  }

  /**
   * Р”РѕР±Р°РІРёС‚СЊ РґР°РЅРЅС‹Рµ РІ С‚Р°Р±Р»РёС†Сѓ
   *
   * @version    1.0
   *
   * @dependence jQuery
   *
   * @param      РјР°СЃСЃРёРІ
   **/
  add(data) {
    let $columns = this.$table.find(".table-nasosy-wq__col");

    $columns.each(function (i, el) {
      let $content = jQuery(el).find(".table-nasosy-wq__content");

      $content.append(`<span class="table-nasosy-wq__field">${data[i]}</span>`);
    });
  }
}

/**
 * Razor
 *
 * РР·РјРµРЅРёС‚СЊ СЃС‚СЂРѕРєРё С‡РµСЂРµР· СЂРµРіСѓР»СЏСЂРЅС‹Рµ РІС‹СЂР°Р¶РµРЅРёСЏ
 *
 * @version    1.0
 **/
class Razor {
  /**
   * РР·РјРµРЅРёС‚СЊ СЃС‚СЂРѕРєСѓ СЃ РїРѕРјРѕС‰СЊСЋ regExp
   *
   * @version    1.0
   *
   * @param      regExp, Р·Р°РјРµРЅРёС‚СЊ РЅР°, РёР·РјРµРЅСЏРµРјР°СЏ СЃС‚СЂРѕРєР°
   * @return     СЃС‚СЂРѕРєСѓ
   *
   * @example    Razor.replace( '^Test', 'Ress', str );
   **/
  static replace(re, replace = "", str) {
    return str.replace(new RegExp(re, "g"), replace);
  }

  /**
   * Р’РµСЂРЅСѓС‚СЊ С‚РѕР»СЊРєРѕ С†РёС„СЂС‹
   *
   * @version    1.0
   *
   * @param      СЃС‚СЂРѕРєР°
   * @return     СЃС‚СЂРѕРєСѓ
   *
   * @example    Razor.onlyNum( str );
   **/
  static onlyNum(str) {
    return str.replace(new RegExp(/\D/, "gm"), "");
  }
}

/**
 * РџСЂРѕРЅСѓРјРµСЂРѕРІР°С‚СЊ С‚Р°Р±Р»С†Сѓ
 * РґРѕР±Р°РІРёС‚СЊ РЅРѕРјРµСЂР° СЃС‚СЂРѕРє
 *
 * @version    1.0
 *
 * @dependence jQuery
 *
 * @param      1 СЃРёРјРІРѕР», СЃС‚СЂРѕРєР°
 * @return     СЃС‚СЂРѕРєСѓ
 **/
function nososySnpTableAddNubmer() {
  $(`.table-nasosy-wq__content`).each(function (i, el) {
    let number = 1;

    $(el)
      .find(".table-nasosy-wq__field")
      .each(function (i, el) {
        $(el).attr("number", number++);
      });
  });

  $(`.table-nasosy-wq, .table-nasosy-wq_price`).each(function (i, el) {
    let number = 1;

    $(el)
      .find(".table-nasosy-wq__col")
      .each(function (i, el) {
        $(el).attr("number", number++);
      });
  });
}

/*--------------------------------------------------------------
>> РўР°Р±Р»РёС†С‹ РЅР°СЃРѕСЃРѕРІ: РџРѕРёСЃРє РђРЅРёРјР°С†РёСЏ
--------------------------------------------------------------*/
function searchNasosyWq_animation($btn, $table) {
  if ($btn.siblings("input").attr("value") != "")
    $table.animate({ opacity: "0.15" });
}
/*--------------------------------------------------------------
<< РўР°Р±Р»РёС†С‹ РЅР°СЃРѕСЃРѕРІ: РџРѕРёСЃРє РђРЅРёРјР°С†РёСЏ
--------------------------------------------------------------*/

/*--------------------------------------------------------------
>> РўР°Р±Р»РёС†С‹ РЅР°СЃРѕСЃРѕРІ: РџРѕРёСЃРє
--------------------------------------------------------------*/
function searchNasosyWq_search($search, TableClass) {
  setTimeout(() => {
    let $fields = $(
      `.${TableClass} .table-nasosy-wq__field, .${TableClass} ~ .${TableClass} .table-nasosy-wq__field`
    );

    let fieldText,
      searchText = $search.find("input").attr("value").toLowerCase();

    $fields.each(function (i, el) {
      $(el).show();

      fieldText = $(el).text().toLowerCase();

      let $table = $(el).parent().parent().parent();
      let $col = $(el).parent().parent();
      let fieldNumber = $(el).attr("number");

      let data = [];

      data.push($(el));

      $table
        .find(`.table-nasosy-wq__field:nth-child(${fieldNumber})`)
        .each(function (i, el) {
          data.push($(el).text().toLowerCase().includes(searchText));
        });

      if (!data.includes(true)) {
        $table = $(data[0]).parent().parent().parent();
        $col = $(data[0]).parent().parent();
        fieldNumber = $(data[0]).attr("number");

        $table.find(`.table-nasosy-wq__field:nth-child(${fieldNumber})`).hide();
      }
    });
  }, 250);

  $(`.${TableClass}`).animate({ opacity: "1" });
}
/*--------------------------------------------------------------
<< РўР°Р±Р»РёС†С‹ РЅР°СЃРѕСЃРѕРІ: РџРѕРёСЃРє
--------------------------------------------------------------*/

/*--------------------------------------------------------------
>> РљРЅРѕРїРєР° РѕС‡РёСЃС‚РёС‚СЊ РїРѕРёСЃРє
--------------------------------------------------------------*/
function searchNasosyWq_searchClaer($btnClose, TableClass) {
  $btnClose.addClass("hide");

  let $search = $btnClose.siblings("input");
  let $fields = $(
    `.${TableClass} .table-nasosy-wq__field, .${TableClass} ~ .${TableClass} .table-nasosy-wq__field`
  );

  $search.attr("value", "");

  $fields.each(function (i, el) {
    $(el).show();
  });

  $(`.${TableClass}`).animate({ opacity: "1" });
}
/*--------------------------------------------------------------
<< РљРЅРѕРїРєР° РѕС‡РёСЃС‚РёС‚СЊ РїРѕРёСЃРє
--------------------------------------------------------------*/

/**
 * РџРѕР»СѓС‡РёС‚СЊ GET РїР°СЂР°РјРµС‚СЂ
 *
 * @version    1.0
 *
 * @dependence jQuery
 *
 * @param      РїРµСЂРµРјРµРЅРЅР°СЏ
 * @return     СЃС‚СЂРѕРєСѓ
 *
 * @example    getAllUrlParams().product; | getAllUrlParams('http://test.com/?a=abc').a
 **/
function getAllUrlParams(url) {
  // РёР·РІР»РµРєР°РµРј СЃС‚СЂРѕРєСѓ РёР· URL РёР»Рё РѕР±СЉРµРєС‚Р° window
  var queryString = url ? url.split("?")[1] : window.location.search.slice(1);

  // РѕР±СЉРµРєС‚ РґР»СЏ С…СЂР°РЅРµРЅРёСЏ РїР°СЂР°РјРµС‚СЂРѕРІ
  var obj = {};

  // РµСЃР»Рё РµСЃС‚СЊ СЃС‚СЂРѕРєР° Р·Р°РїСЂРѕСЃР°
  if (queryString) {
    // РґР°РЅРЅС‹Рµ РїРѕСЃР»Рµ Р·РЅР°РєР° # Р±СѓРґСѓС‚ РѕРїСѓС‰РµРЅС‹
    queryString = queryString.split("#")[0];

    // СЂР°Р·РґРµР»СЏРµРј РїР°СЂР°РјРµС‚СЂС‹
    var arr = queryString.split("&");

    for (var i = 0; i < arr.length; i++) {
      // СЂР°Р·РґРµР»СЏРµРј РїР°СЂР°РјРµС‚СЂ РЅР° РєР»СЋС‡ => Р·РЅР°С‡РµРЅРёРµ
      var a = arr[i].split("=");

      // РѕР±СЂР°Р±РѕС‚РєР° РґР°РЅРЅС‹С… РІРёРґР°: list[]=thing1&list[]=thing2
      var paramNum = undefined;
      var paramName = a[0].replace(/\[\d*\]/, function (v) {
        paramNum = v.slice(1, -1);
        return "";
      });

      // РїРµСЂРµРґР°С‡Р° Р·РЅР°С‡РµРЅРёСЏ РїР°СЂР°РјРµС‚СЂР° ('true' РµСЃР»Рё Р·РЅР°С‡РµРЅРёРµ РЅРµ Р·Р°РґР°РЅРѕ)
      var paramValue = typeof a[1] === "undefined" ? true : a[1];

      // РїСЂРµРѕР±СЂР°Р·РѕРІР°РЅРёРµ СЂРµРіРёСЃС‚СЂР°
      paramName = paramName.toLowerCase();
      paramValue = paramValue.toLowerCase();

      // РµСЃР»Рё РєР»СЋС‡ РїР°СЂР°РјРµС‚СЂР° СѓР¶Рµ Р·Р°РґР°РЅ
      if (obj[paramName]) {
        // РїСЂРµРѕР±СЂР°Р·СѓРµРј С‚РµРєСѓС‰РµРµ Р·РЅР°С‡РµРЅРёРµ РІ РјР°СЃСЃРёРІ
        if (typeof obj[paramName] === "string") {
          obj[paramName] = [obj[paramName]];
        }
        // РµСЃР»Рё РЅРµ Р·Р°РґР°РЅ РёРЅРґРµРєСЃ...
        if (typeof paramNum === "undefined") {
          // РїРѕРјРµС‰Р°РµРј Р·РЅР°С‡РµРЅРёРµ РІ РєРѕРЅРµС† РјР°СЃСЃРёРІР°
          obj[paramName].push(paramValue);
        }
        // РµСЃР»Рё РёРЅРґРµРєСЃ Р·Р°РґР°РЅ...
        else {
          // СЂР°Р·РјРµС‰Р°РµРј СЌР»РµРјРµРЅС‚ РїРѕ Р·Р°РґР°РЅРЅРѕРјСѓ РёРЅРґРµРєСЃСѓ
          obj[paramName][paramNum] = paramValue;
        }
      }
      // РµСЃР»Рё РїР°СЂР°РјРµС‚СЂ РЅРµ Р·Р°РґР°РЅ, РґРµР»Р°РµРј СЌС‚Рѕ РІСЂСѓС‡РЅСѓСЋ
      else {
        obj[paramName] = paramValue;
      }
    }
  }

  return obj;
}

/*--------------------------------------------------------------
>>> Start: РћРєРЅРѕ Cookie
--------------------------------------------------------------*/
function checkCookies() {
  let cookieDate = localStorage.getItem("cookieDate");
  let cookieNotification = document.querySelector(".alert-cookie");
  let cookieBtn = cookieNotification.querySelector(".cookie_accept");

  // Р•СЃР»Рё Р·Р°РїРёСЃРё РїСЂРѕ РєСѓРєРёСЃС‹ РЅРµС‚ РёР»Рё РѕРЅР° РїСЂРѕСЃСЂРѕС‡РµРЅР° РЅР° 1 РіРѕРґ, С‚Рѕ РїРѕРєР°Р·С‹РІР°РµРј РёРЅС„РѕСЂРјР°С†РёСЋ РїСЂРѕ РєСѓРєРёСЃС‹
  if (!cookieDate || +cookieDate + 31536000000 < Date.now()) {
    cookieNotification.classList.remove("hide");
  }

  cookieBtn.addEventListener("click", function () {
    localStorage.setItem("cookieDate", Date.now());
  });
}
/*--------------------------------------------------------------
<<< Close: РћРєРЅРѕ Cookie
--------------------------------------------------------------*/

function tableNasosyGetFieldText(text, number, $this) {
  return $this
    .parents(".table-nasosy-wq__col")
    .siblings(".table-nasosy-wq__col")
    .children(`.table-nasosy-wq__title:contains("${text}")`)
    .next()
    .find(`.table-nasosy-wq__field[number="${number}"]`)
    .text();
}
