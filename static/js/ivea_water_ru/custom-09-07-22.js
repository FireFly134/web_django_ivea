/*!~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
~~~~~~~~~~~~~~~~~~~~~~~ Table of contents ~~~~~~~~~~~~~~~~~~~~~~

Popup table order

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Popup form order - Button

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~!*/
document.addEventListener("DOMContentLoaded", () => {
  /*--------------------------------------------------------------
>> РџСЂРѕРЅСѓРјРµСЂРѕРІР°С‚СЊ С‚Р°Р±Р»РёС†С‹
--------------------------------------------------------------*/
  nososySnpTableAddNubmer();
  /*--------------------------------------------------------------
<< РџСЂРѕРЅСѓРјРµСЂРѕРІР°С‚СЊ С‚Р°Р±Р»РёС†С‹
--------------------------------------------------------------*/

  /*--------------------------------------------------------------
>>> Start: РћРєРЅРѕ Cookie
--------------------------------------------------------------*/
  checkCookies();
  /*--------------------------------------------------------------
<<< Close: РћРєРЅРѕ Cookie
--------------------------------------------------------------*/

  /*--------------------------------------------------------------
>> Get СЃСЃС‹Р»РєР° РґР»СЏ РІРєР»Р°РґРѕРє РЅР°СЃРѕСЃР°
--------------------------------------------------------------*/
  if (document.location.pathname.includes("nasosy-cnp")) {
    var $btnPresentation = $(
      'a.nn_tabs-toggle[data-id="РїСЂРµР·РµРЅС‚Р°С†РёСЏ"][href="#РїСЂРµР·РµРЅС‚Р°С†РёСЏ"]'
    );
    var $btnDesc = $(
      'a.nn_tabs-toggle[data-id="РѕРїРёСЃР°РЅРёРµ"][href="#РѕРїРёСЃР°РЅРёРµ"]'
    );
    var $btnDocs = $(
      'a.nn_tabs-toggle[data-id="РґРѕРєСѓРјРµРЅС‚Р°С†РёСЏ"][href="#РґРѕРєСѓРјРµРЅС‚Р°С†РёСЏ"]'
    );
    var $btnNasosy = $(
      'a.nn_tabs-toggle[data-id="РЅР°СЃРѕСЃС‹-wq"][href="#РЅР°СЃРѕСЃС‹-wq"]'
    );
    var $btnPrice = $(
      'a.nn_tabs-toggle[data-id="РїСЂР°Р№СЃ"][href="#РїСЂР°Р№СЃ"]'
    );
    var $btnSelection = $(
      'a.nn_tabs-toggle[data-id="РїРѕРґР±РѕСЂ"][href="#РїРѕРґР±РѕСЂ"]'
    );
    var $btnDeviceAutossv = $(
      'a.nn_tabs-toggle[data-id="РїСЂРёР±РѕСЂ-autossv"][href="#РїСЂРёР±РѕСЂ-autossv"]'
    );

    /* РћС‡РёСЃС‚РёС‚СЊ url */
    $btnPresentation.on("click", () => {
      history.pushState({}, "", "");
    });

    /* Р РµРґРµСЂРµРєС‚ РїРѕ get РїР°СЂР°РјРµС‚СЂР°Рј */
    if (document.location.href.includes("tab=desc"))
      $btnDesc.find("*").trigger("click");
    if (document.location.href.includes("tab=documentation"))
      $btnDocs.find("*").trigger("click");
    if (document.location.href.includes("tab=table-nasosy"))
      $btnNasosy.find("*").trigger("click");
    if (document.location.href.includes("tab=price"))
      $btnPrice.find("*").trigger("click");
    if (document.location.href.includes("tab=selection"))
      $btnSelection.find("*").trigger("click");
    if (document.location.href.includes("tab=device-autossv"))
      $btnDeviceAutossv.find("*").trigger("click");

    /* Р”РѕР±Р°РІРёС‚СЊ get РїР°СЂР°РјРµС‚СЂ */
    $btnDesc.on("click", function () {
      history.pushState({}, "", "?tab=desc");
    });
    $btnDocs.on("click", function () {
      history.pushState({}, "", "?tab=documentation");
    });
    $btnNasosy.on("click", function () {
      history.pushState({}, "", "?tab=table-nasosy");
    });
    $btnPrice.on("click", function () {
      history.pushState({}, "", "?tab=price");
    });
    $btnSelection.on("click", function () {
      history.pushState({}, "", "?tab=selection");
    });
    $btnDeviceAutossv.on("click", function () {
      history.pushState({}, "", "?tab=device-autossv");
    });

    /* Scroll РґР»СЏ РєРЅРѕРїРєРё РЅР°Р·Р°Рґ. Р”Р»СЏ С‚Р°Р±Р»РёС†С‹ РЅР°СЃРѕСЃРѕРІ */
    if (document.location.href.includes("tab=table-nasosy&scroll=true")) {
      $([document.documentElement, document.body]).animate(
        { scrollTop: $btnNasosy.offset().top },
        1500
      );
    }
  }
  /*--------------------------------------------------------------
<< Get СЃСЃС‹Р»РєР° РґР»СЏ РІРєР»Р°РґРѕРє РЅР°СЃРѕСЃР°
--------------------------------------------------------------*/

  /*--------------------------------------------------------------
>>> Start: РќР°СЃС‚СЂРѕР№РєР° РїРµСЂРµС…РѕРґР° РїРѕ СЃСЃС‹Р»РєР°Рј РґР»СЏ РІРєР»РґРєРё: РџСЂРµР·РµРЅС‚Р°С†РёСЏ
--------------------------------------------------------------*/
  if (document.location.pathname.includes("nasosy-cnp")) {
    $("a.nasosy-redirect").on("click", function (e) {
      e.preventDefault();

      let url = $(this).attr("href");
      let tabName = $(this).attr("tab-name");
      let $tab = $(
        `a.nn_tabs-toggle[data-id="${tabName}"][href="#${tabName}"]`
      );

      history.pushState({}, "", url);

      $tab.find("*").trigger("click");

      $([document.documentElement, document.body]).animate(
        { scrollTop: $tab.offset().top },
        1000
      );
    });
  }
  /*--------------------------------------------------------------
<<< Close: РќР°СЃС‚СЂРѕР№РєР° РїРµСЂРµС…РѕРґР° РїРѕ СЃСЃС‹Р»РєР°Рј РґР»СЏ РІРєР»РґРєРё: РџСЂРµР·РµРЅС‚Р°С†РёСЏ
--------------------------------------------------------------*/

  /*--------------------------------------------------------------
>> Р¤РёР»СЊС‚СЂ РґР»СЏ С‚Р°Р±Р»РёС†С‹ РЅР°СЃРѕСЃРѕРІ
--------------------------------------------------------------*/
  var $select = $(".filter-nasosy-wq");
  var $tables = $(".table-nasosy-wq");
  var option2 = $select.children().eq(1).val();

  $select.on("input", function () {
    let option = $select.val();

    $tables.each(function (i, el) {
      if ($(el).hasClass(`table-nasosy-wq_${option}`)) {
        $(el).css("display", "grid");
      } else if ($select.val() == "all") {
        $(el).css("display", "grid");
      } else {
        $(el).css("display", "none");
      }
    });
  });
  /*--------------------------------------------------------------
<< Р¤РёР»СЊС‚СЂ РґР»СЏ С‚Р°Р±Р»РёС†С‹ РЅР°СЃРѕСЃРѕРІ
--------------------------------------------------------------*/

  /*--------------------------------------------------------------
>> Р’С‹СЃРѕС‚Р° СЃС‚СЂРѕРєРё РґР»СЏ С‚Р°Р±Р»РёС†С‹ РЅР°СЃРѕСЃРѕРІ Price
--------------------------------------------------------------*/
  var $btnPrice = $(
    'a.nn_tabs-toggle[data-id="РїСЂР°Р№СЃ"][href="#РїСЂР°Р№СЃ"]'
  );

  $btnPrice.on("click", function () {
    setTimeout(() => {
      var height = [];
      var $fields = $(".table-nasosy-wq_price .table-nasosy-wq__field");

      /* Р’С‹Р№С‚Рё, РµСЃР»Рё СѓР¶Рµ РѕРїСЂРµРґРµР»РµРЅР° РІС‹СЃРѕС‚Р° */
      if (
        typeof $fields.attr("style") !== "undefined" &&
        $fields.attr("style") !== false &&
        $fields.attr("style").includes("height")
      )
        return false;

      $fields.each(function (i, el) {
        height.push($(el).height());
      });
      $fields.each(function (i, el) {
        $(el).height(Math.max.apply(null, height) + "px");
      });
    }, 500);
  });

  if (document.location.href.includes("tab=price"))
    $btnPrice.find("*").trigger("click");
  /*--------------------------------------------------------------
<< Р’С‹СЃРѕС‚Р° СЃС‚СЂРѕРєРё РґР»СЏ С‚Р°Р±Р»РёС†С‹ РЅР°СЃРѕСЃРѕРІ Price
--------------------------------------------------------------*/

  /*--------------------------------------------------------------
>> Р”Р°С‚Р° РґР»СЏ С‚Р°Р±Р»РёС†С‹ С†РµРЅ РЅР°СЃРѕСЃРѕРІ
--------------------------------------------------------------*/
  let date = new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" });

  /* РЈРґР°Р»РёС‚СЊ СЃРµРєСѓРЅРґС‹ */
  date = Razor.replace(/:\d\d$/, "", date);

  $(".current-date").text(date + " (РњРЎРљ)");
  /*--------------------------------------------------------------
<< Р”Р°С‚Р° РґР»СЏ С‚Р°Р±Р»РёС†С‹ С†РµРЅ РЅР°СЃРѕСЃРѕРІ
--------------------------------------------------------------*/

  /*--------------------------------------------------------------
>> РўР°Р±Р»РёС†С‹ РЅР°СЃРѕСЃРѕРІ: РџРѕРёСЃРє
--------------------------------------------------------------*/

  /* РђРЅРёРјР°С†РёСЏ
==============================================================*/
  $(
    '.search-nasosy-wq:not(.search_price) button, .search-nasosy-wq:not(".search_price") .search-nasosy-wq__close'
  ).on("click", function () {
    searchNasosyWq_animation($(this), $(".table-nasosy-wq"));
  });

  $(
    ".search-nasosy-wq.search_price button, .search-nasosy-wq.search_price .search-nasosy-wq__close"
  ).on("click", function () {
    searchNasosyWq_animation($(this), $(".table-nasosy-wq_price"));
  });

  /* РџРѕРёСЃРє
==============================================================*/
  $(".search-nasosy-wq:not(.search_price)").on("submit", function (e) {
    e.preventDefault();

    searchNasosyWq_search($(this), "table-nasosy-wq");
  });

  $(".search-nasosy-wq.search_price").on("submit", function (e) {
    e.preventDefault();

    searchNasosyWq_search($(this), "table-nasosy-wq_price");
  });

  /* РљРЅРѕРїРєР° РѕС‡РёСЃС‚РёС‚СЊ РїРѕРёСЃРє
==============================================================*/
  $(".search-nasosy-wq input").on("input", function () {
    let $field = $(this);
    let $close = $(this).siblings(".search-nasosy-wq__close");
    let val = $(this).attr("value");

    if (val != "") {
      $close.removeClass("hide");
    } else {
      $close.addClass("hide");
    }
  });

  $(".search-nasosy-wq:not(.search_price) .search-nasosy-wq__close").on(
    "click",
    function () {
      searchNasosyWq_searchClaer($(this), "table-nasosy-wq");
    }
  );
  $(".search-nasosy-wq.search_price .search-nasosy-wq__close").on(
    "click",
    function () {
      searchNasosyWq_searchClaer($(this), "table-nasosy-wq_price");
    }
  );
  /*--------------------------------------------------------------
<< РўР°Р±Р»РёС†С‹ РЅР°СЃРѕСЃРѕРІ: РџРѕРёСЃРє
--------------------------------------------------------------*/

  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
>>> Start: Popup table order
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  $(".table-nasosy-order").on("click", function () {
    $("#blure, #window_table_order").show();
    $(".form-table-order .call_request").addClass("disabled");

    /* Save data for email */
    $(".form-table-order__name").text(
      tableNasosyGetFieldText(
        "РќР°Р·РІР°РЅРёРµ",
        $(this).parent().attr("number"),
        $(this)
      )
    );
    $(".form-table-order__availability").text(
      "РќР°Р»РёС‡РёРµ - " +
        tableNasosyGetFieldText(
          "РќР°Р»РёС‡РёРµ",
          $(this).parent().attr("number"),
          $(this)
        ) +
        " С€С‚."
    );
    $(".form-table-order__date").text(
      "РћР¶РёРґР°РµРјР°СЏ РґР°С‚Р° РїРѕСЃС‚СѓРїР»РµРЅРёСЏ - " +
        tableNasosyGetFieldText(
          "РћР¶РёРґР°РµРјР°СЏ РґР°С‚Р° РїРѕСЃС‚СѓРїР»РµРЅРёСЏ",
          $(this).parent().attr("number"),
          $(this)
        )
    );
    $(".form-table-order__price").text(
      "РЎС‚РѕРёРјРѕСЃС‚СЊ - " +
        tableNasosyGetFieldText(
          "РЎС‚РѕРёРјРѕСЃС‚СЊ, СЂСѓР±.",
          $(this).parent().attr("number"),
          $(this)
        ) +
        " СЂСѓР±. СЃ РќР”РЎ"
    );

    $("input.form-table-order__name").val(
      tableNasosyGetFieldText(
        "РќР°Р·РІР°РЅРёРµ",
        $(this).parent().attr("number"),
        $(this)
      )
    );
    $("input.form-table-order__availability").val(
      tableNasosyGetFieldText(
        "РќР°Р»РёС‡РёРµ",
        $(this).parent().attr("number"),
        $(this)
      )
    );
    $("input.form-table-order__date").val(
      tableNasosyGetFieldText(
        "РћР¶РёРґР°РµРјР°СЏ РґР°С‚Р° РїРѕСЃС‚СѓРїР»РµРЅРёСЏ",
        $(this).parent().attr("number"),
        $(this)
      )
    );
    $("input.form-table-order__price").val(
      tableNasosyGetFieldText(
        "РЎС‚РѕРёРјРѕСЃС‚СЊ, СЂСѓР±.",
        $(this).parent().attr("number"),
        $(this)
      ) + " СЂСѓР±. СЃ РќР”РЎ"
    );
  });

  SubmitMail.yandex_reCaptacha_v3(
    ".form-table-order",
    "https://ivea-water.ru/templates/wt_plussone_jom/mail/mail.php",
    () => {
      alert(
        `Р‘Р»Р°РіРѕРґР°СЂРёРј Р·Р° РѕР±СЂР°С‰РµРЅРёРµ РІ РЅР°С€Сѓ РєРѕРјРїР°РЅРёСЋ. Р’Р°С€ Р·Р°РїСЂРѕСЃ СѓР¶Рµ РїРѕСЃС‚СѓРїРёР» РЅР° РїРѕС‡С‚Сѓ. РћР±СЂР°С‚РЅСѓСЋ СЃРІСЏР·СЊ РјС‹ РґР°РґРёРј РІ С‚РµС‡РµРЅРёРё 15 РјРёРЅСѓС‚ РїРѕ СѓРєР°Р·Р°РЅРЅС‹Рј РІР°РјРё РєРѕРЅС‚Р°РєС‚Р°Рј. \n\nР’С‹ РјРѕР¶РµС‚Рµ РїСЂРѕРґРѕР»Р¶РёС‚СЊ РІС‹Р±РѕСЂ Рё РЅР°РїСЂР°РІРёС‚СЊ РµС‰Рµ Р·Р°РїСЂРѕСЃС‹, РїРѕ С‚РµРј РЅР°СЃРѕСЃР°Рј, РєРѕС‚РѕСЂС‹Рµ РІР°Рј РЅРµРѕР±С…РѕРґРёРјС‹.`
      );

      $(".form-table-order").siblings(".window_close").trigger("click");
      $(".form-table-order").trigger("reset");
    }
  );
  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
<<< Close: Popup table order
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
>>> Start: Popup form order - Button
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  $('input[type="checkbox"]').on("input", function () {
    let $submit = $(".form-table-order .call_request");

    if ($(this).is(":checked")) $submit.removeClass("disabled");
    else $submit.addClass("disabled");
  });
  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
<<< Close: Popup form order - Button
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
});
