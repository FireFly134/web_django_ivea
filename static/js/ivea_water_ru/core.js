(Joomla = window.Joomla || {}),
  (Joomla.editors = Joomla.editors || {}),
  (Joomla.editors.instances = Joomla.editors.instances || {}),
  (function (e, t) {
    "use strict";
    (e.submitform = function (e, o, n) {
      o || (o = t.getElementById("adminForm")),
        e && (o.task.value = e),
        (o.noValidate = !n),
        n
          ? o.hasAttribute("novalidate") && o.removeAttribute("novalidate")
          : o.setAttribute("novalidate", "");
      var r = t.createElement("input");
      (r.style.display = "none"),
        (r.type = "submit"),
        o.appendChild(r).click(),
        o.removeChild(r);
    }),
      (e.submitbutton = function (t) {
        e.submitform(t);
      }),
      (e.Text = {
        strings: {},
        _: function (t, o) {
          var n = e.getOptions("joomla.jtext");
          return (
            n && (this.load(n), e.loadOptions({ "joomla.jtext": null })),
            (o = void 0 === o ? "" : o),
            (t = t.toUpperCase()),
            void 0 !== this.strings[t] ? this.strings[t] : o
          );
        },
        load: function (e) {
          for (var t in e)
            e.hasOwnProperty(t) && (this.strings[t.toUpperCase()] = e[t]);
          return this;
        },
      }),
      (e.JText = e.Text),
      (e.optionsStorage = e.optionsStorage || null),
      (e.getOptions = function (t, o) {
        return (
          e.optionsStorage || e.loadOptions(),
          void 0 !== e.optionsStorage[t] ? e.optionsStorage[t] : o
        );
      }),
      (e.loadOptions = function (o) {
        if (!o) {
          for (
            var n,
              r,
              a,
              i = t.querySelectorAll(".joomla-script-options.new"),
              s = 0,
              l = 0,
              d = i.length;
            l < d;
            l++
          )
            (n = (r = i[l]).text || r.textContent),
              (a = JSON.parse(n)) && (e.loadOptions(a), s++),
              (r.className = r.className.replace(" new", " loaded"));
          if (s) return;
        }
        if (e.optionsStorage) {
          if (o)
            for (var c in o)
              o.hasOwnProperty(c) && (e.optionsStorage[c] = o[c]);
        } else e.optionsStorage = o || {};
      }),
      (e.replaceTokens = function (e) {
        if (/^[0-9A-F]{32}$/i.test(e)) {
          var o,
            n,
            r,
            a = t.getElementsByTagName("input");
          for (o = 0, r = a.length; o < r; o++)
            "hidden" == (n = a[o]).type &&
              "1" == n.value &&
              32 == n.name.length &&
              (n.name = e);
        }
      }),
      (e.isEmail = function (e) {
        console.warn(
          "Joomla.isEmail() is deprecated, use the formvalidator instead"
        );
        return /^[\w.!#$%&вЂљГ„Гґ*+\/=?^`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]{2,})+$/i.test(
          e
        );
      }),
      (e.checkAll = function (e, t) {
        if (!e.form) return !1;
        t = t || "cb";
        var o,
          n,
          r,
          a = 0;
        for (o = 0, r = e.form.elements.length; o < r; o++)
          (n = e.form.elements[o]).type == e.type &&
            0 === n.id.indexOf(t) &&
            ((n.checked = e.checked), (a += n.checked ? 1 : 0));
        return e.form.boxchecked && (e.form.boxchecked.value = a), !0;
      }),
      (e.renderMessages = function (o) {
        e.removeMessages();
        var n,
          r,
          a,
          i,
          s,
          l,
          d,
          c = t.getElementById("system-message-container");
        for (n in o)
          if (o.hasOwnProperty(n)) {
            (r = o[n]),
              (a = t.createElement("div")),
              (d = "notice" === n ? "alert-info" : "alert-" + n),
              (d = "message" === n ? "alert-success" : d),
              (d = "error" === n ? "alert-error alert-danger" : d),
              (a.className = "alert " + d);
            var u = t.createElement("button");
            for (
              u.setAttribute("type", "button"),
                u.setAttribute("data-dismiss", "alert"),
                u.className = "close",
                u.innerHTML = "Г—",
                a.appendChild(u),
                void 0 !== e.JText._(n) &&
                  (((i = t.createElement("h4")).className = "alert-heading"),
                  (i.innerHTML = e.JText._(n)),
                  a.appendChild(i)),
                s = r.length - 1;
              s >= 0;
              s--
            )
              ((l = t.createElement("div")).innerHTML = r[s]), a.appendChild(l);
            c.appendChild(a);
          }
      }),
      (e.removeMessages = function () {
        for (
          var e = t.getElementById("system-message-container");
          e.firstChild;

        )
          e.removeChild(e.firstChild);
        (e.style.display = "none"), e.offsetHeight, (e.style.display = "");
      }),
      (e.ajaxErrorsMessages = function (t, o, n) {
        var r = {};
        if ("parsererror" === o) {
          for (
            var a = t.responseText.trim(), i = [], s = a.length - 1;
            s >= 0;
            s--
          )
            i.unshift(["&#", a[s].charCodeAt(), ";"].join(""));
          (a = i.join("")),
            (r.error = [
              e.JText._("JLIB_JS_AJAX_ERROR_PARSE").replace("%s", a),
            ]);
        } else
          "nocontent" === o
            ? (r.error = [e.JText._("JLIB_JS_AJAX_ERROR_NO_CONTENT")])
            : "timeout" === o
            ? (r.error = [e.JText._("JLIB_JS_AJAX_ERROR_TIMEOUT")])
            : "abort" === o
            ? (r.error = [e.JText._("JLIB_JS_AJAX_ERROR_CONNECTION_ABORT")])
            : t.responseJSON && t.responseJSON.message
            ? (r.error = [
                e.JText._("JLIB_JS_AJAX_ERROR_OTHER").replace("%s", t.status) +
                  " <em>" +
                  t.responseJSON.message +
                  "</em>",
              ])
            : t.statusText
            ? (r.error = [
                e.JText._("JLIB_JS_AJAX_ERROR_OTHER").replace("%s", t.status) +
                  " <em>" +
                  t.statusText +
                  "</em>",
              ])
            : (r.error = [
                e.JText._("JLIB_JS_AJAX_ERROR_OTHER").replace("%s", t.status),
              ]);
        return r;
      }),
      (e.isChecked = function (e, o) {
        if (
          (void 0 === o && (o = t.getElementById("adminForm")),
          (o.boxchecked.value = e
            ? parseInt(o.boxchecked.value) + 1
            : parseInt(o.boxchecked.value) - 1),
          o.elements["checkall-toggle"])
        ) {
          var n,
            r,
            a,
            i = !0;
          for (n = 0, a = o.elements.length; n < a; n++)
            if (
              "checkbox" == (r = o.elements[n]).type &&
              "checkall-toggle" != r.name &&
              !r.checked
            ) {
              i = !1;
              break;
            }
          o.elements["checkall-toggle"].checked = i;
        }
      }),
      (e.popupWindow = function (e, t, o, n, r) {
        var a = (screen.width - o) / 2,
          i =
            "height=" +
            n +
            ",width=" +
            o +
            ",top=" +
            (screen.height - n) / 2 +
            ",left=" +
            a +
            ",scrollbars=" +
            r +
            ",resizable";
        window.open(e, t, i).window.focus();
      }),
      (e.tableOrdering = function (o, n, r, a) {
        void 0 === a && (a = t.getElementById("adminForm")),
          (a.filter_order.value = o),
          (a.filter_order_Dir.value = n),
          e.submitform(r, a);
      }),
      (window.writeDynaList = function (e, o, n, r, a, i) {
        console.warn(
          "window.writeDynaList() is deprecated without a replacement!"
        );
        for (
          var s = t.createElement("select"), l = e.split(" "), d = 0;
          d < l.length;
          d++
        ) {
          var c = l[d].split("=");
          "on" !== c[0].trim().substr(0, 2).toLowerCase() &&
            "href" !== c[0].trim().toLowerCase() &&
            s.setAttribute(c[0], c[1].replace(/\"/g, ""));
        }
        var u,
          m,
          p,
          h = n == r;
        for (u = 0; u < o.length; u++)
          if ((p = o[u])[0] == n) {
            m = h ? a == p[1] : 0 === u;
            var f = t.createElement("option");
            f.setAttribute("value", p[1]),
              (f.innerText = p[2]),
              m && f.setAttribute("selected", "selected"),
              s.appendChild(f);
          }
        i ? i.appendChild(s) : t.body.appendChild(s);
      }),
      (window.changeDynaList = function (e, o, n, r, a) {
        console.warn(
          "window.changeDynaList() is deprecated without a replacement!"
        );
        for (var i, s, l, d, c = t.adminForm[e], u = n == r; c.firstChild; )
          c.removeChild(c.firstChild);
        i = 0;
        for (s in o)
          o.hasOwnProperty(s) &&
            (l = o[s])[0] == n &&
            (((d = new Option()).value = l[1]),
            (d.text = l[2]),
            ((u && a == d.value) || (!u && 0 === i)) && (d.selected = !0),
            (c.options[i++] = d));
        c.length = i;
      }),
      (window.radioGetCheckedValue = function (e) {
        if (
          (console.warn(
            "window.radioGetCheckedValue() is deprecated without a replacement!"
          ),
          !e)
        )
          return "";
        var t,
          o = e.length;
        if (void 0 === o) return e.checked ? e.value : "";
        for (t = 0; t < o; t++) if (e[t].checked) return e[t].value;
        return "";
      }),
      (window.getSelectedValue = function (e, o) {
        console.warn(
          "window.getSelectedValue() is deprecated without a replacement!"
        );
        var n = t[e][o],
          r = n.selectedIndex;
        return null !== r && r > -1 ? n.options[r].value : null;
      }),
      (window.listItemTask = function (t, o) {
        return (
          console.warn(
            "window.listItemTask() is deprecated use Joomla.listItemTask() instead"
          ),
          e.listItemTask(t, o)
        );
      }),
      (e.listItemTask = function (e, o) {
        var n,
          r = t.adminForm,
          a = 0,
          i = r[e];
        if (!i) return !1;
        for (; (n = r["cb" + a]); ) (n.checked = !1), a++;
        return (
          (i.checked = !0), (r.boxchecked.value = 1), window.submitform(o), !1
        );
      }),
      (window.submitbutton = function (t) {
        console.warn(
          "window.submitbutton() is deprecated use Joomla.submitbutton() instead"
        ),
          e.submitbutton(t);
      }),
      (window.submitform = function (t) {
        console.warn(
          "window.submitform() is deprecated use Joomla.submitform() instead"
        ),
          e.submitform(t);
      }),
      (window.saveorder = function (e, t) {
        console.warn("window.saveorder() is deprecated without a replacement!"),
          window.checkAll_button(e, t);
      }),
      (window.checkAll_button = function (o, n) {
        var r, a;
        for (
          console.warn(
            "window.checkAll_button() is deprecated without a replacement!"
          ),
            n = n || "saveorder",
            r = 0;
          r <= o;
          r++
        ) {
          if (!(a = t.adminForm["cb" + r]))
            return void alert(
              "You cannot change the order of items, as an item in the list is `Checked Out`"
            );
          a.checked = !0;
        }
        e.submitform(n);
      }),
      (e.loadingLayer = function (o, n) {
        if (((o = o || "show"), (n = n || t.body), "load" === o)) {
          var r = (e.getOptions("system.paths") || {}).root || "",
            a = t.createElement("div");
          (a.id = "loading-logo"),
            (a.style.position = "fixed"),
            (a.style.top = "0"),
            (a.style.left = "0"),
            (a.style.width = "100%"),
            (a.style.height = "100%"),
            (a.style.opacity = "0.8"),
            (a.style.filter = "alpha(opacity=80)"),
            (a.style.overflow = "hidden"),
            (a.style["z-index"] = "10000"),
            (a.style.display = "none"),
            (a.style["background-color"] = "#fff"),
            (a.style["background-image"] =
              'url("' + r + '/media/jui/images/ajax-loader.gif")'),
            (a.style["background-position"] = "center"),
            (a.style["background-repeat"] = "no-repeat"),
            (a.style["background-attachment"] = "fixed"),
            n.appendChild(a);
        } else
          t.getElementById("loading-logo") || e.loadingLayer("load", n),
            (t.getElementById("loading-logo").style.display =
              "show" == o ? "block" : "none");
        return t.getElementById("loading-logo");
      }),
      (e.extend = function (e, t) {
        for (var o in t) t.hasOwnProperty(o) && (e[o] = t[o]);
        return e;
      }),
      (e.request = function (t) {
        (t = e.extend(
          { url: "", method: "GET", data: null, perform: !0 },
          t
        )).method = t.data ? "POST" : t.method.toUpperCase();
        try {
          var o = window.XMLHttpRequest
            ? new XMLHttpRequest()
            : new ActiveXObject("MSXML2.XMLHTTP.3.0");
          if (
            (o.open(t.method, t.url, !0),
            o.setRequestHeader("X-Requested-With", "XMLHttpRequest"),
            o.setRequestHeader("X-Ajax-Engine", "Joomla!"),
            "POST" === t.method)
          ) {
            var n = e.getOptions("csrf.token", "");
            n && o.setRequestHeader("X-CSRF-Token", n),
              (t.headers && t.headers["Content-Type"]) ||
                o.setRequestHeader(
                  "Content-Type",
                  "application/x-www-form-urlencoded"
                );
          }
          if (t.headers)
            for (var r in t.headers)
              t.headers.hasOwnProperty(r) &&
                o.setRequestHeader(r, t.headers[r]);
          if (
            ((o.onreadystatechange = function () {
              4 === o.readyState &&
                (200 === o.status
                  ? t.onSuccess && t.onSuccess.call(window, o.responseText, o)
                  : t.onError && t.onError.call(window, o));
            }),
            t.perform)
          ) {
            if (t.onBefore && !1 === t.onBefore.call(window, o)) return o;
            o.send(t.data);
          }
        } catch (e) {
          return window.console && console.log(e), !1;
        }
        return o;
      });
  })(Joomla, document);
